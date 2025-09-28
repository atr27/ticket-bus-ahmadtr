// Test script to verify payment status updates
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testPaymentStatus() {
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
    
    console.log('Current payment status:', payment.status);
    console.log('Current booking status:', payment.booking.status);
    console.log('Current booking paymentStatus:', payment.booking.paymentStatus);
    
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
    
    console.log('Updated payment status:', updatedPayment.status);
    console.log('Updated booking status:', updatedBooking.status);
    console.log('Updated booking paymentStatus:', updatedBooking.paymentStatus);
    
  } catch (error) {
    console.error('Error testing payment status:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPaymentStatus();
