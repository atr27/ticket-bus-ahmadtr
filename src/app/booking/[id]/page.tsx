'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { downloadTicket } from '@/lib/ticket-generator'

interface BookingDetails {
  id: string
  userId: string
  scheduleId: string
  seatIds: string[]
  passengerDetails: any
  totalAmount: number
  status: string
  paymentStatus: string
  paymentId: string | null
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
      amenities: string[]
    }
    route: {
      id: string
      origin: string
      destination: string
      distance: number | null
      duration: number | null
      baseFare: number
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

export default function BookingDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const bookingId = params.id as string
  const [booking, setBooking] = useState<BookingDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails()
    }
  }, [bookingId])

  const fetchBookingDetails = async (showLoading = true) => {
    if (showLoading) setLoading(true)
    try {
      const response = await fetch(`/api/booking/${bookingId}`)
      if (response.ok) {
        const data = await response.json()
        setBooking(data)
        setError(null)
      } else {
        setError('Booking not found')
      }
    } catch (error: any) {
      console.error('Error fetching booking:', error)
      setError('Failed to load booking details')
    } finally {
      if (showLoading) setLoading(false)
    }
  }

  const handleRefresh = () => {
    fetchBookingDetails(false)
  }

  const handleSimulatePayment = async () => {
    try {
      const response = await fetch('/api/payment/simulate-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingId }),
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Payment simulation result:', result)
        // Refresh the booking details to show updated status
        fetchBookingDetails(false)
      } else {
        console.error('Failed to simulate payment')
      }
    } catch (error) {
      console.error('Error simulating payment:', error)
    }
  }

  const handleDownloadTicket = () => {
    if (!booking) return
    
    // Transform booking data to match the ticket generator interface
    const ticketData = {
      id: booking.id,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      totalAmount: booking.totalAmount,
      seatIds: booking.seatIds,
      passengerDetails: Array.isArray(booking.passengerDetails) 
        ? booking.passengerDetails.map((passenger: any, index: number) => ({
            name: passenger.name,
            age: passenger.age.toString(),
            gender: passenger.gender,
            seatNumber: booking.seatIds[index]
          }))
        : [],
      createdAt: booking.createdAt,
      schedule: booking.schedule,
      payment: booking.payment
    }
    
    downloadTicket(ticketData)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
      case 'paid':
        return 'text-green-600 bg-green-100'
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'cancelled':
      case 'failed':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return 'N/A'
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">Loading booking details...</p>
        </div>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
              <svg className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="mt-4 text-3xl font-bold text-gray-900">Booking Not Found</h1>
            <p className="mt-2 text-lg text-gray-600">{error}</p>
            <div className="mt-8">
              <Button asChild>
                <Link href="/bookings">View All Bookings</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold">Booking Details</h1>
                <p className="text-blue-100 mt-2">Booking ID: {booking.id}</p>
              </div>
              <div className="text-right space-y-2">
                <div>
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>
                <div>
                  <button
                    onClick={handleRefresh}
                    className="text-blue-100 hover:text-white text-sm underline"
                  >
                    Refresh Status
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Journey Details */}
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Journey Details</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-900">{booking.schedule.route.origin}</p>
                    <p className="text-sm text-gray-600">
                      {formatDateTime(booking.schedule.departureTime)}
                    </p>
                  </div>
                </div>
                <div className="ml-2 border-l-2 border-gray-300 h-8"></div>
                <div className="flex items-center space-x-4">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-900">{booking.schedule.route.destination}</p>
                    <p className="text-sm text-gray-600">
                      {formatDateTime(booking.schedule.arrivalTime)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Travel Date:</span>
                  <span className="font-medium">
                    {new Date(booking.schedule.departureTime).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{formatDuration(booking.schedule.route.duration)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Distance:</span>
                  <span className="font-medium">{booking.schedule.route.distance ? `${booking.schedule.route.distance} km` : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Seats:</span>
                  <span className="font-medium">{booking.seatIds.join(', ')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bus Details */}
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Bus Details</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Operator:</span>
                  <span className="font-medium">{booking.schedule.bus.operator}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bus Type:</span>
                  <span className="font-medium">{booking.schedule.bus.type}</span>
                </div>
              </div>
              <div>
                <p className="text-gray-600 mb-2">Amenities:</p>
                <div className="flex flex-wrap gap-2">
                  {booking.schedule.bus.amenities.map((amenity, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Details</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-bold text-lg text-green-600">
                    Rp {booking.totalAmount.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status:</span>
                  <span className={`inline-flex px-2 py-1 rounded text-sm font-medium ${getStatusColor(booking.paymentStatus)}`}>
                    {booking.paymentStatus}
                  </span>
                </div>
              </div>
              {booking.payment && (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium">{booking.payment.method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment ID:</span>
                    <span className="font-medium text-sm">{booking.payment.xenditId}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Passenger Details */}
          {booking.passengerDetails && (
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Passenger Details</h2>
              <div className="space-y-3">
                {Array.isArray(booking.passengerDetails) ? (
                  booking.passengerDetails.map((passenger: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium">{passenger.name}</p>
                        <p className="text-sm text-gray-600">
                          {passenger.age} years old • {passenger.gender}
                        </p>
                      </div>
                      <span className="text-sm text-gray-500">Seat {booking.seatIds[index]}</span>
                    </div>
                  ))
                ) : (
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-gray-600">Passenger details not available</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {booking.paymentStatus === 'PENDING' && (
                <>
                  <Button className="px-6 py-3">
                    Complete Payment
                  </Button>
                  <Button 
                    onClick={handleSimulatePayment}
                    variant="secondary" 
                    className="px-6 py-3"
                  >
                    Simulate Payment Success (Test)
                  </Button>
                </>
              )}
              {(booking.status === 'CONFIRMED' && booking.paymentStatus === 'PAID') && (
                <Button 
                  onClick={handleDownloadTicket}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700"
                >
                  📄 Download Ticket
                </Button>
              )}
              <Button asChild variant="outline" className="px-6 py-3">
                <Link href="/bookings">View All Bookings</Link>
              </Button>
              <Button asChild variant="outline" className="px-6 py-3">
                <Link href="/">Book Another Trip</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
