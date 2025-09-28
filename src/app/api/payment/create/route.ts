import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { Invoice } from '@/lib/xendit'

const createPaymentSchema = z.object({
  bookingId: z.string(),
  amount: z.number(),
  paymentMethod: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    // Check for required environment variables
    if (!process.env.XENDIT_SECRET_KEY) {
      console.error('XENDIT_SECRET_KEY environment variable is not set')
      return NextResponse.json({ error: 'Payment service not configured' }, { status: 500 })
    }

    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { bookingId, amount, paymentMethod } = createPaymentSchema.parse(body)

    // Check if booking exists and belongs to user
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { 
        schedule: {
          include: {
            route: true,
            bus: true
          }
        },
        user: true
      }
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    if (booking.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Use Xendit Invoice client (already initialized)
    const invoiceClient = Invoice;

    // Map payment method to Xendit payment channels
    const getPaymentChannels = (method?: string) => {
      if (!method) return undefined;
      
      switch (method) {
        case 'credit_card':
          return ['CREDIT_CARD'];
        case 'gopay':
          return ['GOPAY'];
        case 'ovo':
          return ['OVO'];
        case 'dana':
          return ['DANA'];
        case 'bank_transfer':
          return ['BCA', 'MANDIRI', 'BNI', 'BRI'];
        case 'qris':
          return ['QRIS'];
        default:
          return undefined;
      }
    };

    // Create invoice with Xendit
    const invoiceData: any = {
      externalId: `booking-${bookingId}-${Date.now()}`,
      amount: amount,
      description: `Bus ticket from ${booking.schedule.route.origin} to ${booking.schedule.route.destination}`,
      customer: {
        givenNames: booking.user.name || 'Customer',
        email: booking.user.email,
        mobileNumber: booking.user.phone || ''
      },
      successRedirectUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment/success?bookingId=${bookingId}`,
      failureRedirectUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment/failed?bookingId=${bookingId}`,
      currency: 'IDR',
      items: [
        {
          name: `${booking.schedule.route.origin} to ${booking.schedule.route.destination}`,
          quantity: booking.seatIds.length,
          price: amount / booking.seatIds.length,
          category: 'Transportation'
        }
      ],
      metadata: {
        bookingId: bookingId,
        userId: session.user.id,
        scheduleId: booking.scheduleId,
        preferredPaymentMethod: paymentMethod
      }
    };

    // Add payment channels if specific method is selected
    const channels = getPaymentChannels(paymentMethod);
    if (channels) {
      invoiceData.paymentMethods = channels;
    }

    const invoiceResponse = await invoiceClient.createInvoice({
      data: invoiceData
    });

    // Validate that we received a valid invoice ID from Xendit
    if (!invoiceResponse.id) {
      throw new Error('Failed to create Xendit invoice: No invoice ID returned');
    }

    console.log('Creating payment record for booking:', bookingId);
    
    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        bookingId: bookingId,
        xenditId: invoiceResponse.id,
        amount: amount,
        method: paymentMethod || 'XENDIT_INVOICE',
        status: 'PENDING'
      }
    })

    console.log('Payment record created:', payment.id);
    
    // Update booking with paymentId
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        paymentId: invoiceResponse.id,
        paymentStatus: 'PENDING'
      }
    })

    console.log('Booking updated with payment info:', updatedBooking.id);

    return NextResponse.json({
      paymentId: payment.id,
      xenditId: invoiceResponse.id,
      amount: amount,
      status: 'PENDING',
      invoiceUrl: invoiceResponse.invoiceUrl
    })
  } catch (error) {
    console.error('Create payment error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
