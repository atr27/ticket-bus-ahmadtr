// Script to simulate Xendit webhook call
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function simulateWebhook(bookingId) {
  try {
    console.log(`Simulating webhook for booking: ${bookingId}`);
    
    // Find the booking with its payment
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { payment: true }
    });
    
    if (!booking) {
      console.log('Booking not found');
      return;
    }
    
    if (!booking.payment) {
      console.log('No payment record found for this booking');
      return;
    }
    
    console.log('Current Booking Status:', booking.status);
    console.log('Current Payment Status:', booking.paymentStatus);
    console.log('Payment Record Status:', booking.payment.status);
    
    // Simulate Xendit webhook payload
    const webhookPayload = {
      id: booking.payment.xenditId,
      status: 'paid',
      amount: booking.totalAmount,
      external_id: `booking-${booking.id}-${Date.now()}`,
      paid_amount: booking.totalAmount
    };
    
    console.log('Simulating webhook with payload:', webhookPayload);
    
    // Update payment status to PAID
    const updatedPayment = await prisma.payment.update({
      where: { id: booking.payment.id },
      data: { status: 'PAID' }
    });
    
    // Update booking status to CONFIRMED
    const updatedBooking = await prisma.booking.update({
      where: { id: booking.id },
      data: { 
        status: 'CONFIRMED',
        paymentStatus: 'PAID'
      }
    });
    
    console.log('Webhook simulation completed successfully');
    console.log('Updated Booking Status:', updatedBooking.status);
    console.log('Updated Payment Status:', updatedBooking.paymentStatus);
    console.log('Updated Payment Record Status:', updatedPayment.status);
    
  } catch (error) {
    console.error('Error simulating webhook:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Simulate webhook for the booking from the logs
const bookingId = process.argv[2] || 'cmg0ideco0005wj0k1dikby1t';
simulateWebhook(bookingId);
