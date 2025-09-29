import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: bookingId } = await context.params

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { schedule: true, payment: true }
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    if (booking.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (booking.status === 'CANCELLED') {
      return NextResponse.json({ error: 'Booking already cancelled' }, { status: 400 })
    }

    // Update booking status
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'CANCELLED',
        paymentStatus: 'REFUNDED' // Assuming refund if paid
      }
    })

    // Increase available seats
    await prisma.schedule.update({
      where: { id: booking.scheduleId },
      data: {
        availableSeats: {
          increment: booking.seatIds.length
        }
      }
    })

    // If payment exists, update payment status
    if (booking.payment) {
      await prisma.payment.update({
        where: { id: booking.payment.id },
        data: {
          status: 'REFUNDED'
        }
      })
    }

    return NextResponse.json({ message: 'Booking cancelled successfully' })
  } catch (error) {
    console.error('Cancel booking error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
