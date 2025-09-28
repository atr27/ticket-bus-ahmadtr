import jsPDF from 'jspdf'

interface BookingData {
  id: string
  status: string
  paymentStatus: string
  totalAmount: number
  seatIds: string[]
  passengerDetails: Array<{
    name: string
    age: string
    gender: string
    seatNumber: string
  }>
  createdAt: string
  schedule: {
    id: string
    departureTime: string
    arrivalTime: string
    fare: number
    bus: {
      id: string
      operator: string
      type: string
      totalSeats: number
    }
    route: {
      id: string
      origin: string
      destination: string
      duration: number | null
    }
  }
  payment: {
    id: string
    xenditId: string
    amount: number
    method: string
    status: string
    createdAt: string
  } | null
}

export const generateTicketPDF = (bookingData: BookingData): jsPDF => {
  const doc = new jsPDF()
  
  // Helper functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return 'N/A'
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR' 
    }).format(amount)
  }

  // Set up colors to match HTML
  const primaryColor = [220, 38, 38] // #dc2626
  const lightGray = [248, 250, 252] // #f8fafc
  const darkText = [30, 41, 59] // #1e293b
  const labelColor = [100, 116, 139] // #64748b

  let yPosition = 20

  // Header Section - Enhanced styling
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.rect(0, 0, 210, 40, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('Bus Ticket', 105, 22, { align: 'center' })
  
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text('Thank you for choosing our service', 105, 32, { align: 'center' })

  yPosition = 55

  // Two-column layout like HTML
  const leftColumnX = 15
  const rightColumnX = 110
  const columnWidth = 85
  const sectionHeight = 80 // Increased height for better text fitting

  // Left Column - Journey Details
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2])
  doc.rect(leftColumnX, yPosition, columnWidth, sectionHeight, 'F')
  
  // Red left border
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.rect(leftColumnX, yPosition, 2, sectionHeight, 'F')
  
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Journey Details', leftColumnX + 5, yPosition + 8)

  let leftY = yPosition + 18
  doc.setTextColor(labelColor[0], labelColor[1], labelColor[2])
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  
  // Journey details items
  const journeyItems = [
    ['Route:', `${bookingData.schedule.route.origin} - ${bookingData.schedule.route.destination}`],
    ['Date:', formatDate(bookingData.schedule.departureTime)],
    ['Departure:', formatTime(bookingData.schedule.departureTime)],
    ['Arrival:', formatTime(bookingData.schedule.arrivalTime)],
    ['Duration:', formatDuration(bookingData.schedule.route.duration)],
    ['Bus Operator:', bookingData.schedule.bus.operator],
    ['Bus Type:', bookingData.schedule.bus.type]
  ]

  journeyItems.forEach(([label, value]) => {
    // Check if we're running out of space in the column
    if (leftY > yPosition + sectionHeight - 10) {
      return; // Skip if no space
    }
    
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(labelColor[0], labelColor[1], labelColor[2])
    doc.setFontSize(8)
    doc.text(label, leftColumnX + 5, leftY)
    
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(darkText[0], darkText[1], darkText[2])
    doc.setFontSize(8)
    
    // Improved text wrapping with better width calculation
    const maxWidth = columnWidth - 12; // Account for padding
    const valueLines = doc.splitTextToSize(value, maxWidth);
    
    // Limit to 2 lines to prevent overflow
    const displayLines = valueLines.slice(0, 2);
    if (valueLines.length > 2) {
      displayLines[1] = displayLines[1].substring(0, displayLines[1].length - 3) + '...';
    }
    
    doc.text(displayLines, leftColumnX + 5, leftY + 4);
    
    leftY += (displayLines.length * 4) + 6;
  })

  // Right Column - Booking Information
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2])
  doc.rect(rightColumnX, yPosition, columnWidth, sectionHeight, 'F')
  
  // Red left border
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.rect(rightColumnX, yPosition, 2, sectionHeight, 'F')
  
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Booking Information', rightColumnX + 5, yPosition + 8)

  let rightY = yPosition + 18
  
  // Booking details items
  const bookingItems = [
    ['Booking ID:', bookingData.id],
    ['Status:', bookingData.status],
    ['Payment:', bookingData.paymentStatus],
    ['Booked On:', formatDate(bookingData.createdAt)],
    ['Seats:', bookingData.seatIds.join(', ')],
    ['Passengers:', bookingData.passengerDetails.length.toString()]
  ]

  bookingItems.forEach(([label, value]) => {
    // Check if we're running out of space in the column
    if (rightY > yPosition + sectionHeight - 10) {
      return; // Skip if no space
    }
    
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(labelColor[0], labelColor[1], labelColor[2])
    doc.setFontSize(8)
    doc.text(label, rightColumnX + 5, rightY)
    
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(darkText[0], darkText[1], darkText[2])
    doc.setFontSize(8)
    
    // Improved text wrapping with better width calculation
    const maxWidth = columnWidth - 12; // Account for padding
    const valueLines = doc.splitTextToSize(value, maxWidth);
    
    // Limit to 2 lines to prevent overflow
    const displayLines = valueLines.slice(0, 2);
    if (valueLines.length > 2) {
      displayLines[1] = displayLines[1].substring(0, displayLines[1].length - 3) + '...';
    }
    
    doc.text(displayLines, rightColumnX + 5, rightY + 4);
    
    rightY += (displayLines.length * 4) + 6;
  })

  yPosition += sectionHeight + 15

  // Passenger Details Section
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Passenger Details', 15, yPosition)
  
  // Underline
  doc.setLineWidth(1)
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.line(15, yPosition + 2, 60, yPosition + 2)

  yPosition += 12

  bookingData.passengerDetails.forEach((passenger, index) => {
    // Passenger card background
    doc.setFillColor(lightGray[0], lightGray[1], lightGray[2])
    doc.rect(15, yPosition - 2, 180, 18, 'F')
    
    // Passenger name with truncation for long names
    doc.setTextColor(darkText[0], darkText[1], darkText[2])
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    
    const nameLines = doc.splitTextToSize(passenger.name, 130);
    const displayName = nameLines.length > 1 ? nameLines[0] + '...' : passenger.name;
    doc.text(displayName, 20, yPosition + 5)
    
    // Passenger details
    doc.setTextColor(labelColor[0], labelColor[1], labelColor[2])
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text(`${passenger.gender} • Age ${passenger.age}`, 20, yPosition + 11)
    
    // Seat badge
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.roundedRect(160, yPosition, 30, 12, 4, 4, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.text(`Seat ${passenger.seatNumber}`, 175, yPosition + 7, { align: 'center' })
    
    yPosition += 23
  })

  yPosition += 5

  // Payment Summary Section
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2])
  doc.rect(15, yPosition, 180, 40, 'F')
  
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Payment Summary', 20, yPosition + 10)

  yPosition += 18
  doc.setTextColor(darkText[0], darkText[1], darkText[2])
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  
  const baseFare = bookingData.schedule.fare * bookingData.passengerDetails.length
  const serviceFee = 5000
  
  // Payment items
  doc.text(`Base Fare (${bookingData.passengerDetails.length} passenger${bookingData.passengerDetails.length > 1 ? 's' : ''}):`, 20, yPosition)
  doc.text(formatCurrency(baseFare), 185, yPosition, { align: 'right' })
  
  yPosition += 6
  doc.text('Service Fee:', 20, yPosition)
  doc.text(formatCurrency(serviceFee), 185, yPosition, { align: 'right' })
  
  yPosition += 8
  // Total section with border
  doc.setLineWidth(1)
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.line(20, yPosition - 2, 185, yPosition - 2)
  
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.text('Total Paid:', 20, yPosition + 2)
  doc.text(formatCurrency(bookingData.totalAmount), 185, yPosition + 2, { align: 'right' })
  
  if (bookingData.payment) {
    yPosition += 8
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(darkText[0], darkText[1], darkText[2])
    doc.text(`Payment Method: ${bookingData.payment.method}`, 20, yPosition)
  }

  yPosition += 15

  // Footer Section
  doc.setFillColor(darkText[0], darkText[1], darkText[2])
  doc.rect(0, yPosition, 210, 40, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.text('Important: Please arrive at the boarding point 30 minutes before departure.', 105, yPosition + 15, { align: 'center' })
  doc.setFont('helvetica', 'normal')
  doc.text('Show this ticket (printed or digital) to the bus operator for verification.', 105, yPosition + 22, { align: 'center' })
  doc.text('For any queries, contact our support team.', 105, yPosition + 29, { align: 'center' })

  return doc
}

export const generateTicketHTML = (bookingData: BookingData): string => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return 'N/A'
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bus Ticket - ${bookingData.id}</title>
    <style>
        @page {
            size: A4;
            margin: 20mm;
        }

        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
            color: #333;
        }

        .ticket-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }

        .ticket-header {
            background: linear-gradient(135deg, #dc2626, #ef4444);
            color: white;
            padding: 30px;
            text-align: center;
        }

        .ticket-header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
        }

        .ticket-header p {
            margin: 10px 0 0 0;
            font-size: 16px;
            opacity: 0.9;
        }

        .ticket-body {
            padding: 30px;
        }

        .booking-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
        }

        .info-section {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #dc2626;
        }

        .info-section h3 {
            margin: 0 0 15px 0;
            color: #dc2626;
            font-size: 18px;
        }

        .info-grid {
            display: grid;
            gap: 8px;
        }

        .info-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .info-label {
            font-weight: 500;
            color: #64748b;
        }

        .info-value {
            font-weight: 600;
            color: #1e293b;
        }

        .passengers-section {
            margin: 30px 0;
        }

        .passengers-section h3 {
            color: #dc2626;
            font-size: 18px;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 2px solid #dc2626;
        }

        .passenger-card {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px;
            background: #f8fafc;
            border-radius: 8px;
            margin-bottom: 10px;
        }

        .passenger-info {
            flex: 1;
        }

        .passenger-name {
            font-weight: 600;
            font-size: 16px;
            color: #1e293b;
        }

        .passenger-details {
            font-size: 14px;
            color: #64748b;
            margin-top: 4px;
        }

        .seat-badge {
            background: #dc2626;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 14px;
        }

        .payment-section {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
        }

        .payment-section h3 {
            color: #dc2626;
            font-size: 18px;
            margin-bottom: 15px;
        }

        .payment-summary {
            display: grid;
            gap: 10px;
        }

        .payment-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .payment-total {
            border-top: 2px solid #dc2626;
            padding-top: 15px;
            margin-top: 15px;
            font-size: 18px;
            font-weight: bold;
            color: #dc2626;
        }

        .ticket-footer {
            background: #1e293b;
            color: white;
            padding: 20px;
            text-align: center;
        }

        .ticket-footer p {
            margin: 0;
            font-size: 14px;
        }

        .qr-code {
            width: 100px;
            height: 100px;
            background: white;
            margin: 20px auto;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            color: #333;
        }

        .status-badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
        }

        .status-confirmed {
            background: #10b981;
            color: white;
        }

        .status-paid {
            background: #059669;
            color: white;
        }

        @media print {
            body {
                background: white;
            }

            .ticket-container {
                box-shadow: none;
            }
        }
    </style>
</head>
<body>
    <div class="ticket-container">
        <div class="ticket-header">
            <h1>Bus Ticket</h1>
            <p>Thank you for choosing our service</p>
        </div>

        <div class="ticket-body">
            <div class="booking-info">
                <div class="info-section">
                    <h3>Journey Details</h3>
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-label">Route:</span>
                            <span class="info-value">${bookingData.schedule.route.origin} - ${bookingData.schedule.route.destination}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Date:</span>
                            <span class="info-value">${formatDate(bookingData.schedule.departureTime)}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Departure:</span>
                            <span class="info-value">${formatTime(bookingData.schedule.departureTime)}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Arrival:</span>
                            <span class="info-value">${formatTime(bookingData.schedule.arrivalTime)}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Duration:</span>
                            <span class="info-value">${formatDuration(bookingData.schedule.route.duration)}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Bus Operator:</span>
                            <span class="info-value">${bookingData.schedule.bus.operator}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Bus Type:</span>
                            <span class="info-value">${bookingData.schedule.bus.type}</span>
                        </div>
                    </div>
                </div>

                <div class="info-section">
                    <h3>Booking Information</h3>
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-label">Booking ID:</span>
                            <span class="info-value font-mono">${bookingData.id}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Status:</span>
                            <span class="status-badge status-confirmed">${bookingData.status}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Payment:</span>
                            <span class="status-badge status-paid">${bookingData.paymentStatus}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Booked On:</span>
                            <span class="info-value">${formatDate(bookingData.createdAt)}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Seats:</span>
                            <span class="info-value">${bookingData.seatIds.join(', ')}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Passengers:</span>
                            <span class="info-value">${bookingData.passengerDetails.length}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="passengers-section">
                <h3>Passenger Details</h3>
                ${bookingData.passengerDetails.map(passenger => `
                    <div class="passenger-card">
                        <div class="passenger-info">
                            <div class="passenger-name">${passenger.name}</div>
                            <div class="passenger-details">${passenger.gender} • Age ${passenger.age}</div>
                        </div>
                        <div class="seat-badge">Seat ${passenger.seatNumber}</div>
                    </div>
                `).join('')}
            </div>

            <div class="payment-section">
                <h3>Payment Summary</h3>
                <div class="payment-summary">
                    <div class="payment-item">
                        <span>Base Fare (${bookingData.passengerDetails.length} passenger${bookingData.passengerDetails.length > 1 ? 's' : ''}):</span>
                        <span>${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(bookingData.schedule.fare * bookingData.passengerDetails.length)}</span>
                    </div>
                    <div class="payment-item">
                        <span>Service Fee:</span>
                        <span>${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(5000)}</span>
                    </div>
                    <div class="payment-total">
                        <div class="payment-item">
                            <span>Total Paid:</span>
                            <span>${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(bookingData.totalAmount)}</span>
                        </div>
                    </div>
                    ${bookingData.payment ? `
                        <div class="payment-item">
                            <span>Payment Method:</span>
                            <span>${bookingData.payment.method}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>

        <div class="ticket-footer">
            <p><strong>Important:</strong> Please arrive at the boarding point 30 minutes before departure.</p>
            <p>Show this ticket (printed or digital) to the bus operator for verification.</p>
            <p>For any queries, contact our support team.</p>
        </div>
    </div>
</body>
</html>`
}

export const downloadTicket = (bookingData: BookingData) => {
  const ticketPDF = generateTicketPDF(bookingData)

  // Download the PDF
  ticketPDF.save(`bus-ticket-${bookingData.id}.pdf`)
}

export const downloadTicketHTML = (bookingData: BookingData) => {
  const ticketHTML = generateTicketHTML(bookingData)

  // Create blob with HTML content
  const blob = new Blob([ticketHTML], { type: 'text/html' })

  // Create download link
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `bus-ticket-${bookingData.id}.html`

  // Trigger download
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  // Clean up
  URL.revokeObjectURL(url)
}
