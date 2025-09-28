'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, CreditCard, Smartphone, Building2, QrCode, AlertCircle } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { PaymentButton } from '@/components/payment/payment-button'

interface BookingData {
  scheduleId: string
  seatIds: string[]
  passengerDetails: Array<{
    name: string
    age: string
    gender: string
    seatNumber: string
  }>
  totalAmount: number
}

interface ScheduleData {
  id: string
  departureTime: string
  arrivalTime: string
  fare: number
  availableSeats: number
  route: {
    id: string
    origin: string
    destination: string
    duration: string
  }
  bus: {
    id: string
    operator: string
    busType: string
    totalSeats: number
  }
}

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  const [bookingData, setBookingData] = useState<BookingData | null>(null)
  const [schedule, setSchedule] = useState<ScheduleData | null>(null)
  const [bookingId, setBookingId] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth/signin')
      return
    }

    const data = sessionStorage.getItem('bookingData')
    if (data) {
      const parsedData = JSON.parse(data)
      setBookingData(parsedData)
      
      // Fetch schedule data
      const fetchSchedule = async () => {
        try {
          const date = searchParams.get('date')
          const url = `/api/schedule/${parsedData.scheduleId}${date ? `?date=${date}` : ''}`
          const response = await fetch(url)
          if (!response.ok) {
            throw new Error('Schedule not found')
          }
          const scheduleData = await response.json()
          setSchedule(scheduleData)
        } catch (error) {
          console.error('Error fetching schedule:', error)
          setError('Failed to load schedule information')
        } finally {
          setLoading(false)
        }
      }
      
      fetchSchedule()
    } else {
      router.push('/')
    }
  }, [router, session, status, searchParams])

  const paymentMethods = [
    {
      id: 'credit_card',
      name: 'Credit/Debit Card',
      icon: <CreditCard className="h-5 w-5" />,
      description: 'Visa, Mastercard, JCB'
    },
    {
      id: 'gopay',
      name: 'GoPay',
      icon: <Smartphone className="h-5 w-5" />,
      description: 'Pay with GoPay wallet'
    },
    {
      id: 'ovo',
      name: 'OVO',
      icon: <Smartphone className="h-5 w-5" />,
      description: 'Pay with OVO wallet'
    },
    {
      id: 'dana',
      name: 'DANA',
      icon: <Smartphone className="h-5 w-5" />,
      description: 'Pay with DANA wallet'
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      icon: <Building2 className="h-5 w-5" />,
      description: 'BCA, Mandiri, BNI, BRI'
    },
    {
      id: 'qris',
      name: 'QRIS',
      icon: <QrCode className="h-5 w-5" />,
      description: 'Scan QR code to pay'
    }
  ]

  const handleCreateBooking = async () => {
    if (!bookingData || !session) return

    setIsProcessing(true)
    setError(null)

    try {
      // Convert age strings to numbers for API validation
      const processedBookingData = {
        ...bookingData,
        passengerDetails: bookingData.passengerDetails.map(passenger => ({
          ...passenger,
          age: parseInt(passenger.age)
        }))
      }

      // Create booking
      const bookingResponse = await fetch('/api/booking/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(processedBookingData),
      })

      if (!bookingResponse.ok) {
        const errorData = await bookingResponse.json()
        
        // Handle specific error cases with user-friendly messages
        if (errorData.error === 'Some seats are already booked') {
          throw new Error('The selected seats have just been booked by another user. Please go back and select different seats.')
        } else if (errorData.error === 'Not enough seats available') {
          throw new Error('Not enough seats available for this schedule. Please go back and select different seats or try another schedule.')
        } else {
          throw new Error(errorData.error || 'Failed to create booking')
        }
      }

      const booking = await bookingResponse.json()
      setBookingId(booking.id)
      
      return booking.id
    } catch (error) {
      console.error('Booking error:', error)
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
      setIsProcessing(false)
      throw error
    }
  }

  const handlePaymentStart = () => {
    setIsProcessing(true)
    setError(null)
  }

  const handlePaymentComplete = () => {
    setIsProcessing(false)
    // Clear booking data after successful payment initiation
    sessionStorage.removeItem('bookingData')
  }

  if (status === 'loading' || loading || !bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-red-500 border-t-transparent mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null // Will redirect to signin
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Payment</h1>
            <p className="text-gray-600">Complete your booking payment</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Methods */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Select Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600 mb-4">
                  You will be redirected to Xendit payment page to complete your payment securely.
                </p>
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedPaymentMethod === method.id
                        ? 'border-red-500 bg-red-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex-shrink-0 ${
                        selectedPaymentMethod === method.id ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {method.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-medium ${
                          selectedPaymentMethod === method.id ? 'text-red-900' : 'text-gray-900'
                        }`}>
                          {method.name}
                        </h3>
                        <p className={`text-sm ${
                          selectedPaymentMethod === method.id ? 'text-red-700' : 'text-gray-600'
                        }`}>
                          {method.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          Powered by Xendit
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          selectedPaymentMethod === method.id
                            ? 'border-red-500 bg-red-500'
                            : 'border-gray-300'
                        }`}>
                          {selectedPaymentMethod === method.id && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Route:</span>
                    <span className="font-medium">
                      {schedule?.route.origin} → {schedule?.route.destination}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span className="font-medium">
                      {searchParams.get('date') 
                        ? new Date(searchParams.get('date')!).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })
                        : schedule && new Date(schedule.departureTime).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time:</span>
                    <span className="font-medium">
                      {schedule && new Date(schedule.departureTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - {schedule && new Date(schedule.arrivalTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bus:</span>
                    <span className="font-medium">{schedule?.bus.operator}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Passengers:</span>
                    <span className="font-medium">{bookingData.passengerDetails.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Seats:</span>
                    <span className="font-medium">{bookingData.seatIds.join(', ')}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-medium">Passengers:</h4>
                  {bookingData.passengerDetails.map((passenger, index) => (
                    <div key={index} className="text-sm">
                      <div className="flex justify-between">
                        <span>{passenger.name}</span>
                        <span>Seat {passenger.seatNumber}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(bookingData.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service Fee:</span>
                    <span>{formatCurrency(5000)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-red-600">{formatCurrency(bookingData.totalAmount + 5000)}</span>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </div>
                )}

                {bookingId ? (
                  <PaymentButton
                    bookingId={bookingId}
                    amount={bookingData.totalAmount + 5000}
                    paymentMethod={selectedPaymentMethod}
                    onPaymentStart={handlePaymentStart}
                    onPaymentComplete={handlePaymentComplete}
                    disabled={!selectedPaymentMethod}
                  />
                ) : (
                  <Button 
                    onClick={handleCreateBooking}
                    disabled={isProcessing || !selectedPaymentMethod}
                    className="w-full"
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Creating Booking...
                      </div>
                    ) : !selectedPaymentMethod ? (
                      'Select Payment Method'
                    ) : (
                      `Create Booking & Pay ${formatCurrency(bookingData.totalAmount + 5000)}`
                    )}
                  </Button>
                )}

                {!selectedPaymentMethod && (
                  <p className="text-xs text-amber-600 text-center">
                    Please select a payment method to continue
                  </p>
                )}

                <p className="text-xs text-gray-500 text-center">
                  Your payment is secured with 256-bit SSL encryption
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
