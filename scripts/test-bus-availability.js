// Using built-in fetch (Node.js 18+)

const BASE_URL = 'http://localhost:3000';

async function testBusAvailability() {
  console.log('🚌 Testing Bus Availability for Multiple Dates...\n');

  const testCases = [
    {
      origin: 'Jakarta',
      destination: 'Bandung',
      dates: [
        new Date().toISOString().split('T')[0], // Today
        new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Next week
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Next month
      ]
    },
    {
      origin: 'Jakarta',
      destination: 'Yogyakarta',
      dates: [
        new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Day after tomorrow
        new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Two weeks
      ]
    },
    {
      origin: 'Surabaya',
      destination: 'Malang',
      dates: [
        new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days from now
      ]
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n📍 Testing route: ${testCase.origin} → ${testCase.destination}`);
    console.log('=' .repeat(50));

    for (const date of testCase.dates) {
      console.log(`\n📅 Date: ${date}`);
      
      try {
        const url = `${BASE_URL}/api/search/schedules?origin=${encodeURIComponent(testCase.origin)}&destination=${encodeURIComponent(testCase.destination)}&date=${date}`;
        console.log(`🔍 Searching: ${url}`);
        
        const response = await fetch(url);
        const schedules = await response.json();

        if (response.ok) {
          console.log(`✅ Found ${schedules.length} available buses`);
          
          if (schedules.length > 0) {
            console.log('\n🚌 Available Buses:');
            schedules.forEach((schedule, index) => {
              const departureTime = new Date(schedule.departureTime);
              const arrivalTime = new Date(schedule.arrivalTime);
              
              console.log(`   ${index + 1}. ${schedule.bus.operator} (${schedule.bus.type})`);
              console.log(`      Departure: ${departureTime.toLocaleTimeString()}`);
              console.log(`      Arrival: ${arrivalTime.toLocaleTimeString()}`);
              console.log(`      Available Seats: ${schedule.availableSeats}/${schedule.bus.totalSeats}`);
              console.log(`      Fare: IDR ${schedule.fare.toLocaleString()}`);
              console.log(`      Schedule ID: ${schedule.id}`);
              console.log('');
            });
          } else {
            console.log('❌ No buses available for this date');
          }
        } else {
          console.log(`❌ Error: ${schedules.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.log(`❌ Request failed: ${error.message}`);
      }
      
      console.log('-'.repeat(30));
    }
  }

  console.log('\n🎉 Bus availability testing completed!');
  console.log('\n📝 Summary:');
  console.log('- Buses should be available for all future dates');
  console.log('- Each route should show multiple bus options');
  console.log('- Schedule IDs should start with "generated-" for dynamic schedules');
  console.log('- Different bus operators and types should be available');
}

// Run the test
testBusAvailability().catch(console.error);
