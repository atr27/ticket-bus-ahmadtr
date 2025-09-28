'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface PaymentButtonProps {
  bookingId: string
  amount: number
  paymentMethod?: string | null
  disabled?: boolean
  onPaymentStart?: () => void
  onPaymentComplete?: () => void
}

export function PaymentButton({
  bookingId,
  amount,
  paymentMethod,
  disabled = false,
  onPaymentStart,
  onPaymentComplete
}: PaymentButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handlePayment = async () => {
    try {
      setLoading(true)
      onPaymentStart?.()

      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          amount,
          paymentMethod,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Redirect to Xendit payment page
        if (data.invoiceUrl) {
          window.location.href = data.invoiceUrl
        } else {
          throw new Error('Payment URL not found')
        }
      } else {
        const errorMessage = data.error || 'Failed to create payment'
        if (response.status === 500 && errorMessage.includes('not configured')) {
          throw new Error('Payment service is not properly configured. Please contact support.')
        }
        throw new Error(errorMessage)
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('Failed to process payment. Please try again.')
    } finally {
      setLoading(false)
      onPaymentComplete?.()
    }
  }

  return (
    <Button
      onClick={handlePayment}
      disabled={loading || disabled}
      className="w-full py-3 text-lg"
    >
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </>
      ) : (
        `Pay Rp ${amount.toLocaleString('id-ID')}`
      )}
    </Button>
  )
}
