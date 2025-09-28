// Using built-in fetch (Node.js 18+)

const BASE_URL = 'http://localhost:3000';

async function testSeatSelection() {
  console.log('🪑 Testing Seat Selection with Generated Schedule IDs...\n');

  try {
    // First, get some schedules from search
    console.log('1. Getting schedules from search...');
    const searchUrl = `${BASE_URL}/api/search/schedules?origin=Jakarta&destination=Bandung&date=2025-09-28`;
    const searchResponse = await fetch(searchUrl);
    const schedules = await searchResponse.json();

    if (!searchResponse.ok || schedules.length === 0) {
      console.log('❌ No schedules found in search');
      return;
    }

    console.log(`✅ Found ${schedules.length} schedules`);
    
    // Test the first few schedules
    const testSchedules = schedules.slice(0, 3);
    
    for (let i = 0; i < testSchedules.length; i++) {
      const schedule = testSchedules[i];
      console.log(`\n2.${i + 1} Testing schedule: ${schedule.id}`);
      console.log(`    Bus: ${schedule.bus.operator} (${schedule.bus.type})`);
      console.log(`    Route: ${schedule.route.origin} → ${schedule.route.destination}`);
      
      // Test fetching the schedule details (what seat selection page does)
      const scheduleUrl = `${BASE_URL}/api/schedule/${schedule.id}?date=2025-09-28`;
      console.log(`    Fetching: ${scheduleUrl}`);
      
      const scheduleResponse = await fetch(scheduleUrl);
      
      if (scheduleResponse.ok) {
        const scheduleDetails = await scheduleResponse.json();
        console.log(`    ✅ Schedule details retrieved successfully`);
        console.log(`    📍 Departure: ${new Date(scheduleDetails.departureTime).toLocaleString()}`);
        console.log(`    📍 Arrival: ${new Date(scheduleDetails.arrivalTime).toLocaleString()}`);
        console.log(`    🪑 Available Seats: ${scheduleDetails.availableSeats}/${scheduleDetails.bus.totalSeats}`);
        console.log(`    💰 Fare: IDR ${scheduleDetails.fare.toLocaleString()}`);
        console.log(`    🚌 Bus Seats in DB: ${scheduleDetails.bus.seats.length}`);
      } else {
        const error = await scheduleResponse.json();
        console.log(`    ❌ Failed to get schedule details: ${error.error}`);
      }
    }

    console.log('\n🎉 Seat selection testing completed!');
    console.log('\n📝 Summary:');
    console.log('- Generated schedule IDs should be retrievable via /api/schedule/[id]');
    console.log('- Schedule details should include bus, route, and seat information');
    console.log('- Departure/arrival times should match the search results');
    console.log('- Bus seats should be available for seat selection');

  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
  }
}

// Run the test
testSeatSelection().catch(console.error);
