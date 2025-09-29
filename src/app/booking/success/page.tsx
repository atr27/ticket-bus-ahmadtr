'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CheckCircle, Download, Share2, Calendar, MapPin, Clock, Users, Ticket } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { downloadTicket } from '@/lib/ticket-generator'

interface Booking {
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
      duration?: number
    }
  }
  payment?: {
    id: string
    amount: number
    method: string
    status: string
    createdAt: string
  }
}

function BookingSuccessPageContent() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('bookingId')
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId) {
        setError('No booking ID provided')
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/booking/${bookingId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch booking details')
        }

        const data = await response.json()
        setBooking(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load booking')
      } finally {
        setLoading(false)
      }
    }

    fetchBooking()
  }, [bookingId])

  const handleDownloadTicket = () => {
    if (!booking) return
    
    // Transform booking data to match the ticket generator interface
    const ticketData = {
      ...booking,
      schedule: {
        ...booking.schedule,
        route: {
          ...booking.schedule.route,
          duration: booking.schedule.route.duration ?? null
        }
      },
      payment: booking.payment ? {
        ...booking.payment,
        xenditId: 'N/A' // Default value since this field might not exist in all payment objects
      } : null
    }
    
    downloadTicket(ticketData)
  }

  const handleShareBooking = () => {
    if (!booking) return
    
    if (navigator.share) {
      navigator.share({
        title: 'Bus Booking Confirmation',
        text: `Booking confirmed! ${booking.schedule.route.origin} to ${booking.schedule.route.destination} on ${new Date(booking.schedule.departureTime).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}`,
        url: window.location.href
      })
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href)
      alert('Booking link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-red-600 border-t-transparent mx-auto mb-4" />
          <p>Loading your booking details...</p>
        </div>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold mb-2">Booking Not Found</h2>
            <p className="text-gray-600 mb-4">{error || 'Booking details could not be loaded.'}</p>
            <Button onClick={() => window.location.href = '/'}>
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-lg text-gray-600">
            Your bus ticket has been successfully booked
          </p>
        </div>

        {/* Booking Details */}
        <Card className="mb-6">
          <CardHeader className="bg-green-50 border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Booking Details</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Booking ID: <span className="font-mono font-semibold">{booking.id}</span>
                </p>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {booking.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Journey Details */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Ticket className="h-5 w-5" />
                  Journey Details
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{booking.schedule.route.origin} → {booking.schedule.route.destination}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>{new Date(booking.schedule.departureTime).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{new Date(booking.schedule.departureTime).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false
                    })} - {new Date(booking.schedule.arrivalTime).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false
                    })}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span>{booking.schedule.bus.operator} • {booking.schedule.bus.type}</span>
                  </div>
                </div>
              </div>

              {/* Passenger Details */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Passengers ({booking.passengerDetails.length})
                </h3>
                <div className="space-y-3">
                  {booking.passengerDetails.map((passenger, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{passenger.name}</p>
                        <p className="text-sm text-gray-600">
                          {passenger.gender} • Age {passenger.age}
                        </p>
                      </div>
                      <Badge variant="outline">
                        Seat {passenger.seatNumber}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Payment Summary */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Payment Summary</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span>Base Fare ({booking.passengerDetails.length}x):</span>
                  <span>{formatCurrency(booking.schedule.fare * booking.passengerDetails.length)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span>Service Fee:</span>
                  <span>{formatCurrency(5000)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total Paid:</span>
                  <span className="text-green-600">{formatCurrency(booking.totalAmount)}</span>
                </div>
                <div className="mt-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Payment {booking.paymentStatus}
                  </Badge>
                </div>
                {booking.payment && (
                  <div className="mt-2 text-sm text-gray-600">
                    <span>Payment Method: {booking.payment.method}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={handleDownloadTicket} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download Ticket
          </Button>
          <Button variant="outline" onClick={handleShareBooking} className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Share Booking
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            Book Another Trip
          </Button>
        </div>

        {/* Important Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Important Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Before Travel:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Arrive at the boarding point 30 minutes early</li>
                  <li>• Carry a valid ID proof</li>
                  <li>• Keep your ticket ready for verification</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Cancellation Policy:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Free cancellation up to 24 hours before departure</li>
                  <li>• 50% refund for cancellations within 24 hours</li>
                  <li>• No refund for no-shows</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <BookingSuccessPageContent />
    </Suspense>
  )
}
