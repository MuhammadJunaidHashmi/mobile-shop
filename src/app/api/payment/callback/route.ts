import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Check if it's PayFast or JazzCash callback
    const paymentGateway = formData.get('payment_gateway') as string || 'payfast'
    
    if (paymentGateway === 'payfast') {
      return await handlePayFastCallback(formData, request)
    } else {
      return await handleJazzCashCallback(formData, request)
    }
  } catch (error) {
    console.error('Payment callback error:', error)
    return NextResponse.json({ error: 'Callback processing failed' }, { status: 500 })
  }
}

async function handlePayFastCallback(formData: FormData, request: NextRequest) {
  // Extract PayFast response data
  const paymentStatus = formData.get('payment_status') as string
  const transactionId = formData.get('pf_payment_id') as string
  const amount = formData.get('amount_gross') as string
  const orderId = formData.get('m_payment_id') as string
  const signature = formData.get('signature') as string

  console.log('PayFast callback received:', {
    paymentStatus,
    transactionId,
    amount,
    orderId,
    signature
  })

  // Verify the signature (in production, implement proper signature verification)
  // const expectedSignature = generatePayFastSignature(formData)
  // if (signature !== expectedSignature) {
  //   return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  // }

  // Update order status based on response
  if (paymentStatus === 'COMPLETE') {
    // Payment successful
    const { error } = await supabase
      .from('orders')
      .update({
        status: 'confirmed',
        payment_status: 'paid',
        payment_id: transactionId,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)

    if (error) {
      console.error('Error updating order:', error)
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
    }

    // Redirect to success page
    return NextResponse.redirect(new URL(`/orders/success?orderId=${orderId}`, request.url))
  } else {
    // Payment failed
    const { error } = await supabase
      .from('orders')
      .update({
        status: 'cancelled',
        payment_status: 'failed',
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)

    if (error) {
      console.error('Error updating order:', error)
    }

    // Redirect to failure page
    return NextResponse.redirect(new URL(`/checkout?error=${encodeURIComponent('Payment failed')}`, request.url))
  }
}

async function handleJazzCashCallback(formData: FormData, request: NextRequest) {
  // Extract JazzCash response data
  const responseCode = formData.get('pp_ResponseCode') as string
  const responseMessage = formData.get('pp_ResponseMessage') as string
  const transactionId = formData.get('pp_TxnRefNo') as string
  const amount = formData.get('pp_Amount') as string
  const orderId = formData.get('pp_BillReference') as string
  const secureHash = formData.get('pp_SecureHash') as string

  console.log('JazzCash callback received:', {
    responseCode,
    responseMessage,
    transactionId,
    amount,
    orderId
  })

  // Verify the secure hash (in production, implement proper hash verification)
  // const expectedHash = generateHash(formData)
  // if (secureHash !== expectedHash) {
  //   return NextResponse.json({ error: 'Invalid hash' }, { status: 400 })
  // }

  // Update order status based on response
  if (responseCode === '000') {
    // Payment successful
    const { error } = await supabase
      .from('orders')
      .update({
        status: 'confirmed',
        payment_status: 'paid',
        payment_id: transactionId,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)

    if (error) {
      console.error('Error updating order:', error)
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
    }

    // Redirect to success page
    return NextResponse.redirect(new URL(`/orders/success?orderId=${orderId}`, request.url))
  } else {
    // Payment failed
    const { error } = await supabase
      .from('orders')
      .update({
        status: 'cancelled',
        payment_status: 'failed',
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)

    if (error) {
      console.error('Error updating order:', error)
    }

    // Redirect to failure page
    return NextResponse.redirect(new URL(`/checkout?error=${encodeURIComponent(responseMessage)}`, request.url))
  }
}

export async function GET(request: NextRequest) {
  // Handle GET requests (some payment gateways use GET for callbacks)
  const searchParams = request.nextUrl.searchParams
  
  const responseCode = searchParams.get('pp_ResponseCode')
  const responseMessage = searchParams.get('pp_ResponseMessage')
  const transactionId = searchParams.get('pp_TxnRefNo')
  const orderId = searchParams.get('pp_BillReference')

  console.log('Payment callback (GET) received:', {
    responseCode,
    responseMessage,
    transactionId,
    orderId
  })

  if (responseCode === '000') {
    return NextResponse.redirect(new URL(`/orders/success?orderId=${orderId}`, request.url))
  } else {
    return NextResponse.redirect(new URL(`/checkout?error=${encodeURIComponent(responseMessage || 'Payment failed')}`, request.url))
  }
}
