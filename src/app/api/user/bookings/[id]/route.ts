import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const bookingId = params.id

    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        userId: session.user.id // Ensure user can only access their own bookings
      },
      include: {
        schedule: {
          include: {
            route: true,
            bus: true
          }
        },
        payment: true,
        seats: true
      }
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    return NextResponse.json(booking)
  } catch (error) {
    console.error('Get booking error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
