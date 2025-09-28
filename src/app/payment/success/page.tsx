'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('bookingId')
  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [countdown, setCountdown] = useState(10)
  const [autoRedirect, setAutoRedirect] = useState(true)

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails()
    }
  }, [bookingId])

  // Auto-redirect countdown
  useEffect(() => {
    if (!loading && booking && autoRedirect && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (!loading && booking && autoRedirect && countdown === 0) {
      router.push(`/booking/${bookingId}`)
    }
  }, [countdown, loading, booking, autoRedirect, router, bookingId])

  const fetchBookingDetails = async () => {
    try {
      const response = await fetch(`/api/booking/${bookingId}`)
      if (response.ok) {
        const data = await response.json()
        setBooking(data)
        // Log the booking status for debugging
        console.log('Booking data:', data)
      }
    } catch (error) {
      console.error('Error fetching booking:', error)
    } finally {
      setLoading(false)
    }
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
              <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="mt-4 text-3xl font-bold text-gray-900">Payment Successful!</h1>
            <p className="mt-2 text-lg text-gray-600">
              Your bus ticket booking has been confirmed.
            </p>
            {!loading && booking && autoRedirect && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-blue-800 font-medium">
                  Redirecting to booking details in {countdown} seconds...
                </p>
                <button
                  onClick={() => setAutoRedirect(false)}
                  className="mt-2 text-blue-600 hover:text-blue-800 underline text-sm"
                >
                  Cancel auto-redirect
                </button>
              </div>
            )}
          </div>

          {booking && (
            <div className="mt-8 bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Details</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking ID:</span>
                  <span className="font-medium">{booking.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">From:</span>
                  <span className="font-medium">{booking.schedule?.route?.origin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">To:</span>
                  <span className="font-medium">{booking.schedule?.route?.destination}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Departure:</span>
                  <span className="font-medium">
                    {new Date(booking.schedule?.departureTime).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Seats:</span>
                  <span className="font-medium">{booking.seatIds?.join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-medium text-green-600">
                    Rp {booking.totalAmount?.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-green-600">
                    {booking.status === 'CONFIRMED' ? 'Confirmed' : 
                     booking.status === 'PENDING' ? 'Pending' : 
                     booking.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status:</span>
                  <span className="font-medium text-green-600">
                    {booking.paymentStatus === 'PAID' ? 'Paid' : 
                     booking.paymentStatus === 'PENDING' ? 'Pending' : 
                     booking.paymentStatus}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="px-6 py-3">
              <Link href={`/booking/${bookingId}`}>View Booking Details</Link>
            </Button>
            <Button asChild variant="outline" className="px-6 py-3">
              <Link href="/bookings">My Bookings</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
