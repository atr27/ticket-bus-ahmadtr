import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createBookingSchema = z.object({
  scheduleId: z.string(),
  seatIds: z.array(z.string()),
  passengerDetails: z.array(z.object({
    name: z.string(),
    age: z.number(),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER'])
  })),
  totalAmount: z.number(),
  travelDate: z.string().optional() // Add travel date for generated schedules
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { scheduleId, seatIds, passengerDetails, totalAmount, travelDate } = createBookingSchema.parse(body)

    // Check if schedule exists or if it's a generated schedule ID
    let schedule = await prisma.schedule.findUnique({
      where: { id: scheduleId },
      include: { route: true, bus: true }
    })

    // If schedule doesn't exist and it's a generated ID, create it
    if (!schedule && scheduleId.startsWith('generated-')) {
      const parts = scheduleId.split('-')
      if (parts.length >= 4) {
        const routeId = parts[1]
        const busId = parts[2]
        const scheduleIndex = parseInt(parts[3])

        // Get route and bus details
        const route = await prisma.route.findUnique({ where: { id: routeId } })
        const bus = await prisma.bus.findUnique({ where: { id: busId } })

        if (route && bus) {
          // Generate the same schedule details as in the search API
          const baseHour = route.origin.toLowerCase().includes('jakarta') ? 6 + (scheduleIndex * 3) : 7 + (scheduleIndex * 2)
          const departureHour = baseHour % 24
          const routeDuration = route.duration || 180

          const departureTime = travelDate ? new Date(travelDate) : new Date()
          if (!travelDate) {
            departureTime.setDate(departureTime.getDate() + 1) // Tomorrow by default if no travel date
          }
          departureTime.setHours(departureHour, scheduleIndex * 15, 0, 0)

          const arrivalTime = new Date(departureTime)
          arrivalTime.setMinutes(arrivalTime.getMinutes() + routeDuration)

          let fareMultiplier = 1
          if (bus.type.includes('Executive')) fareMultiplier = 1.2
          if (bus.type.includes('Sleeper')) fareMultiplier = 1.4

          const availableSeats = bus.totalSeats - Math.floor(Math.random() * Math.floor(bus.totalSeats * 0.2))

          // Create the schedule in the database
          schedule = await prisma.schedule.create({
            data: {
              id: scheduleId,
              busId: bus.id,
              routeId: route.id,
              departureTime,
              arrivalTime,
              availableSeats,
              fare: Math.round(route.baseFare * fareMultiplier)
            },
            include: { route: true, bus: true }
          })
        }
      }
    }

    if (!schedule) {
      return NextResponse.json({ error: 'Schedule not found' }, { status: 404 })
    }

    // Use transaction to prevent race conditions
    const result = await prisma.$transaction(async (tx) => {
      // Check if schedule still has enough seats (double-check within transaction)
      const currentSchedule = await tx.schedule.findUnique({
        where: { id: scheduleId }
      })

      if (!currentSchedule || currentSchedule.availableSeats < seatIds.length) {
        throw new Error('Not enough seats available')
      }

      // Check if seats are available (not booked)
      const existingBookings = await tx.booking.findMany({
        where: {
          scheduleId: scheduleId,
          seatIds: {
            hasSome: seatIds
          },
          status: {
            in: ['PENDING', 'CONFIRMED']
          }
        }
      })

      if (existingBookings.length > 0) {
        throw new Error('Some seats are already booked')
      }

      // Create booking
      const booking = await tx.booking.create({
        data: {
          userId: session.user.id,
          scheduleId: scheduleId,
          seatIds: seatIds,
          passengerDetails: passengerDetails,
          totalAmount: totalAmount,
          status: 'PENDING',
          paymentStatus: 'PENDING'
        }
      })

      // Update available seats atomically
      await tx.schedule.update({
        where: { id: scheduleId },
        data: {
          availableSeats: {
            decrement: seatIds.length
          }
        }
      })

      return booking
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Create booking error:', error)

    if (error instanceof Error) {
      if (error.message === 'Not enough seats available' || error.message === 'Some seats are already booked') {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
