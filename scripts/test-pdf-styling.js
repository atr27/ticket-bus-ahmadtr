// Test script to verify PDF styling improvements
// This script can be run in a browser environment to test the improved PDF generation

const testBookingData = {
  id: "test-booking-123",
  status: "CONFIRMED",
  paymentStatus: "PAID",
  totalAmount: 150000,
  seatIds: ["A1", "A2"],
  passengerDetails: [
    {
      name: "John Doe",
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
    departureTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    arrivalTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString(), // Tomorrow + 8 hours
    fare: 70000,
    bus: {
      id: "bus-789",
      operator: "Primajasa Express Travel Company",
      type: "Executive Class with Premium Amenities",
      totalSeats: 40
    },
    route: {
      id: "route-101",
      origin: "Jakarta Terminal Pulogebang",
      destination: "Bandung Terminal Ledeng",
      duration: 480 // 8 hours in minutes
    }
  },
  payment: {
    id: "payment-202",
    amount: 150000,
    method: "Credit Card (Visa ending in 1234)",
    status: "PAID",
    createdAt: new Date().toISOString()
  }
}

console.log('Test booking data with long text values created:', testBookingData)
console.log('To test improved PDF generation, import the generateTicketPDF function and call:')
console.log('const pdf = generateTicketPDF(testBookingData)')
console.log('pdf.save("improved-test-ticket.pdf")')
