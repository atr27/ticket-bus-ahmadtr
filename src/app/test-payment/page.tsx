'use client'

import { useState } from 'react'
import { PaymentButton } from '@/components/payment/payment-button'

export default function TestPaymentPage() {
  const [bookingId, setBookingId] = useState('test-booking-123')
  const [amount, setAmount] = useState(150000)
  const [isSimulating, setIsSimulating] = useState(false)
  const [simulationResult, setSimulationResult] = useState('')

  const simulateWebhook = async () => {
    setIsSimulating(true)
    setSimulationResult('')
    
    try {
      const response = await fetch('/api/payment/simulate-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingId }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setSimulationResult(`Success: ${data.message}`)
      } else {
        setSimulationResult(`Error: ${data.error}`)
      }
    } catch (error: any) {
      setSimulationResult(`Error: ${error.message || error}`)
    } finally {
      setIsSimulating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Integration Test</h1>
            <p className="text-gray-600">Test the Xendit payment integration</p>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Payment Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Booking ID
                  </label>
                  <input
                    type="text"
                    value={bookingId}
                    onChange={(e) => setBookingId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount (IDR)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Button</h2>
              <p className="text-gray-600 mb-4">
                Click the button below to test the Xendit payment integration. You will be redirected to Xendit's payment page.
              </p>
              
              <PaymentButton 
                bookingId={bookingId}
                amount={amount}
                onPaymentStart={() => console.log('Payment started')}
                onPaymentComplete={() => console.log('Payment completed')}
              />
            </div>

            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Webhook Simulation</h2>
              <p className="text-gray-600 mb-4">
                After completing a payment, simulate the webhook that Xendit would send to update the booking status.
              </p>
              <button
                onClick={simulateWebhook}
                disabled={isSimulating}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {isSimulating ? 'Simulating...' : 'Simulate Webhook'}
              </button>
              {simulationResult && (
                <div className="mt-4 p-3 rounded-md bg-white border">
                  <p className="text-sm">{simulationResult}</p>
                </div>
              )}
            </div>

            <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Testing Instructions</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Make sure you have set up your Xendit credentials in the environment variables</li>
                <li>Ensure the webhook URL is configured in your Xendit dashboard</li>
                <li>Use test credentials for payment (no real money will be charged)</li>
                <li>Check the browser console for payment status updates</li>
                <li>For local testing, after payment use the webhook simulation script:</li>
                <li><code>node scripts/simulate-webhook.js [booking-id]</code></li>
                <li>Verify status with: <code>node scripts/check-booking-status.js [booking-id]</code></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
