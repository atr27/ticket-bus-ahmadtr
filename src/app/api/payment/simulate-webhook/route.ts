import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { bookingId } = body

    if (!bookingId) {
      return NextResponse.json({ error: 'bookingId is required' }, { status: 400 })
    }

    // Find the booking with its payment
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { payment: true }
    })
    
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }
    
    if (!booking.payment) {
      return NextResponse.json({ error: 'No payment record found for this booking' }, { status: 404 })
    }
    
    // Update payment status to PAID
    const updatedPayment = await prisma.payment.update({
      where: { id: booking.payment.id },
      data: { status: 'PAID' }
    })
    
    // Update booking status to CONFIRMED
    const updatedBooking = await prisma.booking.update({
      where: { id: booking.id },
      data: { 
        status: 'CONFIRMED',
        paymentStatus: 'PAID'
      }
    })
    
    return NextResponse.json({ 
      message: 'Webhook simulation completed successfully',
      bookingId: updatedBooking.id,
      bookingStatus: updatedBooking.status,
      paymentStatus: updatedBooking.paymentStatus
    })
  } catch (error) {
    console.error('Webhook simulation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
