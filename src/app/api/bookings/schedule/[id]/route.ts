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

    // Find all bookings for this schedule
    const bookings = await prisma.booking.findMany({
      where: {
        scheduleId: scheduleId,
        // Only return confirmed bookings as they represent actual occupied seats
        status: 'CONFIRMED'
      },
      select: {
        id: true,
        seatIds: true,
        status: true,
        createdAt: true
      }
    })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Get schedule bookings error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
