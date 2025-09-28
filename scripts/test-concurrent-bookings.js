const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConcurrentBookings() {
  // Get a schedule to test with
  const schedule = await prisma.schedule.findFirst({
    include: { bus: true }
  });
  
  if (!schedule) {
    console.log('No schedule found for testing');
    return;
  }
  
  console.log(`Testing with schedule: ${schedule.id}`);
  console.log(`Available seats: ${schedule.availableSeats}`);
  
  // Get some seats for this bus
  const seats = await prisma.seat.findMany({
    where: { busId: schedule.busId },
    take: 3
  });
  
  if (seats.length < 3) {
    console.log('Not enough seats found for testing');
    return;
  }
  
  console.log(`Using seats: ${seats.map(s => s.number).join(', ')}`);
  
  // Simulate concurrent bookings
  const bookingPromises = [];
  
  for (let i = 0; i < 3; i++) {
    const bookingPromise = fetch('http://localhost:3000/api/booking/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        scheduleId: schedule.id,
        seatIds: [seats[i].id],
        passengerDetails: [{
          name: `Passenger ${i+1}`,
          age: 25,
          gender: 'MALE'
        }],
        totalAmount: 100000
      })
    });
    
    bookingPromises.push(bookingPromise);
  }
  
  // Wait for all bookings to complete
  const results = await Promise.allSettled(bookingPromises);
  
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      console.log(`Booking ${index + 1}: Success`);
    } else {
      console.log(`Booking ${index + 1}: Failed - ${result.reason}`);
    }
  });
  
  // Check final seat availability
  const updatedSchedule = await prisma.schedule.findUnique({
    where: { id: schedule.id }
  });
  
  console.log(`Final available seats: ${updatedSchedule.availableSeats}`);
}

testConcurrentBookings()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
