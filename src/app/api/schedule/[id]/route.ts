import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: scheduleId } = await params
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')

    if (!scheduleId) {
      return NextResponse.json({ error: 'Schedule ID is required' }, { status: 400 })
    }

    let schedule = await prisma.schedule.findUnique({
      where: {
        id: scheduleId
      },
      include: {
        bus: {
          include: {
            seats: true
          }
        },
        route: true
      }
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
        const bus = await prisma.bus.findUnique({ 
          where: { id: busId },
          include: { seats: true }
        })

        if (route && bus) {
          // Generate the same schedule details as in the search API
          const baseHour = route.origin.toLowerCase().includes('jakarta') ? 6 + (scheduleIndex * 3) : 7 + (scheduleIndex * 2)
          const departureHour = baseHour % 24
          const routeDuration = route.duration || 180

          const departureTime = date ? new Date(date) : new Date()
          if (!date) {
            departureTime.setDate(departureTime.getDate() + 1) // Tomorrow by default if no date
          }
          departureTime.setHours(departureHour, scheduleIndex * 15, 0, 0)

          const arrivalTime = new Date(departureTime)
          arrivalTime.setMinutes(arrivalTime.getMinutes() + routeDuration)

          let fareMultiplier = 1
          if (bus.type.includes('Executive')) fareMultiplier = 1.2
          if (bus.type.includes('Sleeper')) fareMultiplier = 1.4

          // Calculate real available seats based on confirmed bookings for this date
          const confirmedBookings = await prisma.booking.findMany({
            where: {
              scheduleId: scheduleId,
              status: 'CONFIRMED',
              // For generated schedules, we need to check bookings for the specific date
            },
            select: {
              seatIds: true
            }
          })
          
          const bookedSeatsCount = confirmedBookings.reduce((total, booking) => total + booking.seatIds.length, 0)
          const availableSeats = Math.max(0, bus.totalSeats - bookedSeatsCount)

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
            include: {
              bus: {
                include: {
                  seats: true
                }
              },
              route: true
            }
          })
        }
      }
    }

    if (!schedule) {
      return NextResponse.json({ error: 'Schedule not found' }, { status: 404 })
    }

    return NextResponse.json(schedule)
  } catch (error) {
    console.error('Get schedule error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
