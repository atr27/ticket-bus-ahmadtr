import { formatCurrency } from './utils'

// Dynamic import to avoid TypeScript issues
let jsPDF: any = null

const loadJsPDF = async () => {
  if (!jsPDF) {
    jsPDF = (await import('jspdf')).default
  }
  return jsPDF
}

interface Booking {
  id: string
  status: string
  paymentStatus: string
  totalAmount: number
  passengerDetails: Array<{
    name: string
    age: string
    gender: string
    seatNumber: string
  }>
  createdAt: string
  schedule: {
    departureTime: string
    arrivalTime: string
    bus: {
      operator: string
      type: string
    }
    route: {
      origin: string
      destination: string
    }
  }
}

export const generateTicketPDF = async (booking: Booking) => {
  const jsPDFLib = await loadJsPDF()
  const doc = new jsPDFLib()

  // Set up colors
  const primaryColor = [220, 38, 38] // Red-600
  const secondaryColor = [249, 115, 22] // Orange-500
  const grayColor = [75, 85, 99] // Gray-600

  // Header
  doc.setFillColor(...primaryColor)
  doc.rect(0, 0, 210, 40, 'F')

  // Company logo/text
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('RED BUS', 20, 25)

  // Ticket title
  doc.setFontSize(16)
  doc.text('BUS TICKET', 150, 25)

  // Ticket border
  doc.setDrawColor(...primaryColor)
  doc.setLineWidth(2)
  doc.rect(10, 50, 190, 200)

  // Journey Information
  doc.setTextColor(...grayColor)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('JOURNEY DETAILS', 20, 70)

  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')

  // Route
  doc.setFont('helvetica', 'bold')
  doc.text('Route:', 20, 85)
  doc.setFont('helvetica', 'normal')
  doc.text(`${booking.schedule.route.origin} → ${booking.schedule.route.destination}`, 60, 85)

  // Date and Time
  doc.setFont('helvetica', 'bold')
  doc.text('Departure:', 20, 100)
  doc.setFont('helvetica', 'normal')
  const departureDate = new Date(booking.schedule.departureTime).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  const departureTime = new Date(booking.schedule.departureTime).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
  doc.text(`${departureDate} at ${departureTime}`, 60, 100)

  // Bus Information
  doc.setFont('helvetica', 'bold')
  doc.text('Bus Operator:', 20, 115)
  doc.setFont('helvetica', 'normal')
  doc.text(`${booking.schedule.bus.operator} (${booking.schedule.bus.type})`, 60, 115)

  // Passenger Information
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text('PASSENGER DETAILS', 20, 135)

  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')

  booking.passengerDetails.forEach((passenger, index) => {
    const yPos = 150 + (index * 20)
    doc.text(`${passenger.name} (${passenger.gender}, Age ${passenger.age})`, 20, yPos)
    doc.text(`Seat: ${passenger.seatNumber}`, 160, yPos)
  })

  // Payment Information
  const paymentYPos = 150 + (booking.passengerDetails.length * 20) + 20
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text('PAYMENT DETAILS', 20, paymentYPos)

  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')

  doc.setFont('helvetica', 'bold')
  doc.text('Total Amount:', 20, paymentYPos + 15)
  doc.setFont('helvetica', 'normal')
  doc.text(formatCurrency(booking.totalAmount), 60, paymentYPos + 15)

  doc.setFont('helvetica', 'bold')
  doc.text('Payment Status:', 20, paymentYPos + 25)
  doc.setFont('helvetica', 'normal')
  doc.text(booking.paymentStatus, 60, paymentYPos + 25)

  // Booking Information
  doc.setFont('helvetica', 'bold')
  doc.text('Booking ID:', 20, paymentYPos + 40)
  doc.setFont('helvetica', 'normal')
  doc.text(booking.id, 60, paymentYPos + 40)

  doc.setFont('helvetica', 'bold')
  doc.text('Booking Date:', 20, paymentYPos + 50)
  doc.setFont('helvetica', 'normal')
  doc.text(new Date(booking.createdAt).toLocaleDateString('en-US'), 60, paymentYPos + 50)

  // Footer
  doc.setFontSize(10)
  doc.setFont('helvetica', 'italic')
  doc.setTextColor(128, 128, 128)
  doc.text('Please arrive at the boarding point 30 minutes before departure.', 20, 270)
  doc.text('Carry a valid ID proof for verification.', 20, 280)

  // Generate filename
  const fileName = `ticket_${booking.id}_${booking.schedule.route.origin}_${booking.schedule.route.destination}.pdf`

  // Save the PDF
  doc.save(fileName)
}
