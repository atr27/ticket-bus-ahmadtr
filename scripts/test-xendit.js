// Test script for Xendit integration
// Run with: node scripts/test-xendit.js

require('dotenv').config()
const { Invoice } = require('xendit-node')

async function testXendit() {
  console.log('Testing Xendit integration...')
  
  // Check if environment variables are set
  if (!process.env.XENDIT_SECRET_KEY) {
    console.error('❌ XENDIT_SECRET_KEY is not set in environment variables')
    process.exit(1)
  }

  try {
    // Initialize Xendit client
    const invoiceClient = new Invoice({
      secretKey: process.env.XENDIT_SECRET_KEY,
    })

    console.log('✅ Xendit client initialized successfully')

    // Create a test invoice
    console.log('Creating test invoice...')
    
    const invoice = await invoiceClient.createInvoice({
      data: {
        externalId: `test-invoice-${Date.now()}`,
        amount: 100000,
        description: 'Test invoice for RedBus integration',
        customer: {
          givenNames: 'Test User',
          email: 'test@example.com',
        },
        successRedirectUrl: 'http://localhost:3000/payment/success',
        failureRedirectUrl: 'http://localhost:3000/payment/failed',
        currency: 'IDR',
        items: [
          {
            name: 'Test Bus Ticket',
            quantity: 1,
            price: 100000,
            category: 'Transportation'
          }
        ]
      }
    })

    console.log('✅ Test invoice created successfully')
    console.log('Invoice ID:', invoice.id)
    console.log('Invoice URL:', invoice.invoiceUrl)
    console.log('\n🎉 Xendit integration test passed!')
    
  } catch (error) {
    console.error('❌ Xendit integration test failed:', error.message)
    process.exit(1)
  }
}

testXendit()
