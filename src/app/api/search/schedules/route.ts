import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { parseDateFromURL } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const routeId = searchParams.get('routeId')
    const origin = searchParams.get('origin')
    const destination = searchParams.get('destination')
    const date = searchParams.get('date')

    // Search by routeId or by origin/destination to find routes
    let routeWhereClause: Record<string, unknown> = {}
    
    if (routeId) {
      routeWhereClause.id = routeId
    } else if (origin && destination) {
      routeWhereClause = {
        origin: {
          contains: origin,
          mode: 'insensitive'
        },
        destination: {
          contains: destination,
          mode: 'insensitive'
        }
      }
    } else {
      return NextResponse.json({ error: 'Route ID or origin/destination is required' }, { status: 400 })
    }

    // Find matching routes
    const routes = await prisma.route.findMany({
      where: routeWhereClause,
      include: {
        schedules: {
          include: {
            bus: true
          }
        }
      }
    })

    if (routes.length === 0) {
      return NextResponse.json([])
    }

    // Get all buses for generating schedules
    const buses = await prisma.bus.findMany()

    if (buses.length === 0) {
      return NextResponse.json([])
    }

    // Generate dynamic schedules for the requested date (or today if no date provided)
    const searchDate = date ? parseDateFromURL(date) : new Date()
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset time to start of day for comparison
    searchDate.setHours(0, 0, 0, 0) // Reset time to start of day
    
    // Don't allow searching for past dates
    if (searchDate < today) {
      searchDate.setTime(today.getTime())
    }

    const generatedSchedules = []

    for (const route of routes) {
      // Generate multiple schedules per route with different buses and times
      const scheduleCount = Math.min(5, buses.length) // Up to 5 schedules per route
      
      for (let i = 0; i < scheduleCount; i++) {
        const bus = buses[i % buses.length]
        
        // Generate departure times throughout the day
        const baseHour = route.origin.toLowerCase().includes('jakarta') ? 6 + (i * 3) : 7 + (i * 2)
        const departureHour = baseHour % 24
        const routeDuration = route.duration || 180 // Default 3 hours if null
        
        const departureTime = new Date(searchDate)
        departureTime.setHours(departureHour, i * 15, 0, 0) // Stagger by 15 minutes
        
        const arrivalTime = new Date(departureTime)
        arrivalTime.setMinutes(arrivalTime.getMinutes() + routeDuration)
        
        // Calculate fare with variation based on bus type
        let fareMultiplier = 1
        if (bus.type.includes('Executive')) fareMultiplier = 1.2
        if (bus.type.includes('Sleeper')) fareMultiplier = 1.4
        
        // Calculate real available seats based on confirmed bookings for this schedule
        const scheduleId = `generated-${route.id}-${bus.id}-${i}`
        const confirmedBookings = await prisma.booking.findMany({
          where: {
            scheduleId: scheduleId,
            status: 'CONFIRMED',
          },
          select: {
            seatIds: true
          }
        })
        
        const bookedSeatsCount = confirmedBookings.reduce((total, booking) => total + booking.seatIds.length, 0)
        const availableSeats = Math.max(0, bus.totalSeats - bookedSeatsCount)
        
        generatedSchedules.push({
          id: `generated-${route.id}-${bus.id}-${i}`,
          busId: bus.id,
          routeId: route.id,
          departureTime: departureTime.toISOString(),
          arrivalTime: arrivalTime.toISOString(),
          availableSeats,
          fare: Math.round(route.baseFare * fareMultiplier),
          bus,
          route
        })
      }
    }

    // Sort by departure time
    generatedSchedules.sort((a, b) => new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime())

    return NextResponse.json(generatedSchedules)
  } catch (error) {
    console.error('Search schedules error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
