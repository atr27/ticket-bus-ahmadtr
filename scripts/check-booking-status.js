// Script to check the status of a specific booking
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkBookingStatus(bookingId) {
  try {
    console.log(`Checking status for booking: ${bookingId}`);
    
    // Find the booking with its payment
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { payment: true }
    });
    
    if (!booking) {
      console.log('Booking not found');
      return;
    }
    
    console.log('Booking Status:', booking.status);
    console.log('Payment Status:', booking.paymentStatus);
    
    if (booking.payment) {
      console.log('Payment Record Status:', booking.payment.status);
      console.log('Payment Xendit ID:', booking.payment.xenditId);
    } else {
      console.log('No payment record found');
    }
    
  } catch (error) {
    console.error('Error checking booking status:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Check the booking from the logs
const bookingId = process.argv[2] || 'cmg0ideco0005wj0k1dikby1t';
checkBookingStatus(bookingId);
