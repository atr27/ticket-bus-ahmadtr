'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function PaymentFailedPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('bookingId')

  useEffect(() => {
    // Optionally, you can cancel the booking or mark it as failed
    if (bookingId) {
      updateBookingStatus()
    }
  }, [bookingId])

  const updateBookingStatus = async () => {
    try {
      // This is optional - you might want to let the webhook handle this
      // Or you might want to mark it as failed immediately
      await fetch(`/api/booking/${bookingId}/cancel`, {
        method: 'POST',
      })
    } catch (error) {
      console.error('Error updating booking status:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
              <svg className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="mt-4 text-3xl font-bold text-gray-900">Payment Failed</h1>
            <p className="mt-2 text-lg text-gray-600">
              Your payment could not be processed. Please try again.
            </p>
          </div>

          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">What would you like to do?</h2>
            <div className="space-y-4">
              <p className="text-gray-600">
                Your booking has been saved and is waiting for payment. You can try paying again or cancel the booking.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            {bookingId && (
              <Button asChild className="px-6 py-3">
                <Link href={`/booking/${bookingId}`}>Retry Payment</Link>
              </Button>
            )}
            <Button asChild variant="outline" className="px-6 py-3">
              <Link href="/bookings">My Bookings</Link>
            </Button>
            <Button asChild variant="destructive" className="px-6 py-3">
              <Link href="/search">Book Another Trip</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
