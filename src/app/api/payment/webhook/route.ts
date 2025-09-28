import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Webhook received:', body)
    
    // Verify webhook signature
    const signature = request.headers.get('x-callback-token')
    
    // In production, verify the signature with your webhook token
    // For now, we'll skip verification in development but log it
    if (process.env.NODE_ENV === 'production') {
      if (signature !== process.env.XENDIT_WEBHOOK_TOKEN) {
        console.error('Invalid webhook signature')
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    const { id, status, amount, external_id, paid_amount } = body

    // Extract bookingId from external_id
    const bookingId = external_id.split('-')[1]

    // Find payment by xenditId
    const payment = await prisma.payment.findFirst({
      where: { xenditId: id }
    })

    if (!payment) {
      console.error('Payment not found for xenditId:', id)
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    console.log('Processing payment status update:', { paymentId: payment.id, status, amount })

    // Map Xendit status to our payment status
    let newPaymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' = 'PENDING'
    let newBookingStatus: 'PENDING' | 'CONFIRMED' | 'CANCELLED' = 'PENDING'

    switch (status.toLowerCase()) {
      case 'paid':
      case 'settled':
        newPaymentStatus = 'PAID'
        newBookingStatus = 'CONFIRMED'
        break
      case 'expired':
      case 'failed':
        newPaymentStatus = 'FAILED'
        newBookingStatus = 'CANCELLED'
        break
      case 'pending':
        newPaymentStatus = 'PENDING'
        newBookingStatus = 'PENDING'
        break
      default:
        console.warn('Unknown payment status:', status)
        newPaymentStatus = 'PENDING'
        newBookingStatus = 'PENDING'
    }

    // Update payment status
    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: newPaymentStatus
      }
    })

    // Update booking status
    const updatedBooking = await prisma.booking.update({
      where: { id: payment.bookingId },
      data: {
        status: newBookingStatus,
        paymentStatus: newPaymentStatus
      }
    })

    console.log('Payment and booking status updated successfully:', {
      paymentId: updatedPayment.id,
      bookingId: updatedBooking.id,
      paymentStatus: newPaymentStatus,
      bookingStatus: newBookingStatus
    })
    
    return NextResponse.json({ 
      message: 'Webhook processed successfully',
      paymentId: updatedPayment.id,
      bookingId: updatedBooking.id,
      paymentStatus: newPaymentStatus,
      bookingStatus: newBookingStatus
    })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
