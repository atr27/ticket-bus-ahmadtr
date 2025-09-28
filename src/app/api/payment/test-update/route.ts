import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { bookingId, status } = body

    if (!bookingId || !status) {
      return NextResponse.json({ error: 'bookingId and status are required' }, { status: 400 })
    }

    // Find payment by bookingId
    const payment = await prisma.payment.findUnique({
      where: { bookingId }
    })

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    // Update payment status
    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: { status }
    })

    // Update booking status
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { 
        status: status === 'PAID' ? 'CONFIRMED' : status === 'FAILED' ? 'CANCELLED' : 'PENDING',
        paymentStatus: status
      }
    })

    return NextResponse.json({ 
      message: 'Payment status updated successfully',
      paymentId: updatedPayment.id,
      bookingId: updatedBooking.id,
      paymentStatus: updatedPayment.status,
      bookingStatus: updatedBooking.status
    })
  } catch (error) {
    console.error('Test update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
