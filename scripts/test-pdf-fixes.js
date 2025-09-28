// Test script to verify PDF styling fixes
// Run this in Node.js environment to test the fixes

const testBookingData = {
  id: "test-booking-very-long-id-123456789-abcdef",
  status: "CONFIRMED",
  paymentStatus: "PAID",
  totalAmount: 150000,
  seatIds: ["A1", "A2"],
  passengerDetails: [
    {
      name: "John Doe with a Very Long Name That Might Cause Text Overflow Issues",
      age: "30",
      gender: "Male",
      seatNumber: "A1"
    },
    {
      name: "Jane Doe",
      age: "28",
      gender: "Female", 
      seatNumber: "A2"
    }
  ],
  createdAt: new Date().toISOString(),
  schedule: {
    id: "schedule-456",
    departureTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    arrivalTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString(),
    fare: 70000,
    bus: {
      id: "bus-789",
      operator: "Primajasa Express Travel Company with Very Long Name That Should Be Truncated",
      type: "Executive Class with Premium Amenities and Extra Comfort Features",
      totalSeats: 40
    },
    route: {
      id: "route-101",
      origin: "Jakarta Terminal Pulogebang International Bus Station Complex",
      destination: "Bandung Terminal Ledeng Central Station and Transportation Hub",
      duration: 480
    }
  },
  payment: {
    id: "payment-202",
    amount: 150000,
    method: "Credit Card (Visa ending in 1234) - Online Payment",
    status: "PAID",
    createdAt: new Date().toISOString()
  }
}

console.log('Test booking data with long text values created for PDF styling fixes:')
console.log('- Long booking ID:', testBookingData.id)
console.log('- Long passenger name:', testBookingData.passengerDetails[0].name)
console.log('- Long bus operator:', testBookingData.schedule.bus.operator)
console.log('- Long route origin:', testBookingData.schedule.route.origin)
console.log('- Long route destination:', testBookingData.schedule.route.destination)

console.log('\nFixes applied:')
console.log('✓ Increased section height from 70 to 80')
console.log('✓ Added text overflow protection')
console.log('✓ Improved text wrapping with proper width calculation')
console.log('✓ Limited text to 2 lines with ellipsis for overflow')
console.log('✓ Added passenger name truncation')
console.log('✓ Improved spacing and layout consistency')
console.log('✓ Fixed QR code text truncation')

console.log('\nTo test the fixes:')
console.log('1. Import the generateTicketPDF function from ticket-generator.ts')
console.log('2. Call: const pdf = generateTicketPDF(testBookingData)')
console.log('3. Call: pdf.save("fixed-ticket.pdf")')
console.log('4. Check the generated PDF for proper text styling and layout')

module.exports = { testBookingData }
