// Test script to simulate Xendit webhook calls
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testWebhook() {
  try {
    // Find a payment record to test with
    const payment = await prisma.payment.findFirst({
      include: {
        booking: true
      }
    });
    
    if (!payment) {
      console.log('No payment found in database');
      return;
    }
    
    console.log('Testing webhook for payment:', payment.id);
    console.log('Current payment status:', payment.status);
    console.log('Current booking status:', payment.booking.status);
    console.log('Current booking paymentStatus:', payment.booking.paymentStatus);
    
    // Simulate a successful payment webhook from Xendit
    const webhookData = {
      id: payment.xenditId,
      status: 'paid',
      amount: payment.amount,
      external_id: `booking-${payment.bookingId}-${Date.now()}`,
      paid_amount: payment.amount
    };
    
    console.log('Simulating webhook data:', webhookData);
    
    // This would normally be handled by the webhook endpoint
    // For testing, we'll directly update the records
    
    // Update payment status to PAID
    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'PAID' }
    });
    
    // Update booking status to CONFIRMED
    const updatedBooking = await prisma.booking.update({
      where: { id: payment.bookingId },
      data: { 
        status: 'CONFIRMED',
        paymentStatus: 'PAID'
      }
    });
    
    console.log('Webhook simulation completed successfully');
    console.log('Updated payment status:', updatedPayment.status);
    console.log('Updated booking status:', updatedBooking.status);
    console.log('Updated booking paymentStatus:', updatedBooking.paymentStatus);
    
  } catch (error) {
    console.error('Error testing webhook:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testWebhook();
