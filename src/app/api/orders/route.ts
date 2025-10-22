import { NextRequest, NextResponse } from 'next/server'
import { orderService } from '@/lib/order-service'
import { paymentService } from '@/lib/payment'
// import { supabase } from '@/lib/supabase' // Unused for now

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      items, 
      shippingAddress, 
      paymentMethod, 
      cardInfo,
      userId 
    } = body

    // Validate required fields
    if (!items || !shippingAddress || !paymentMethod || !cardInfo || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Calculate total amount
    let totalAmount = 0
    for (const item of items) {
      totalAmount += item.price * item.quantity
    }

    // Add tax (15% in Pakistan)
    const tax = totalAmount * 0.15
    const finalAmount = totalAmount + tax

    // Create order
    const order = await orderService.createOrder({
      userId,
      items,
      shippingAddress,
      paymentMethod,
      totalAmount: finalAmount
    })

    // Process payment
    const paymentResult = await paymentService.processPayment({
      amount: finalAmount,
      currency: 'PKR',
      orderId: order.id,
      customerInfo: {
        name: shippingAddress.name,
        email: shippingAddress.email || '',
        phone: shippingAddress.phone
      },
      cardInfo,
      billingAddress: {
        address: shippingAddress.address,
        city: shippingAddress.city,
        postalCode: shippingAddress.postalCode,
        country: 'Pakistan'
      }
    })

    if (paymentResult.success) {
      // Update order with payment success
      await orderService.updatePaymentStatus(order.id, 'completed')
      await orderService.updateOrderStatus({
        orderId: order.id,
        status: 'confirmed'
      })

      return NextResponse.json({
        success: true,
        order,
        transactionId: paymentResult.transactionId,
        message: 'Order created and payment processed successfully'
      })
    } else {
      // Update order with payment failure
      await orderService.updatePaymentStatus(order.id, 'failed')
      
      return NextResponse.json({
        success: false,
        error: paymentResult.error,
        message: paymentResult.message
      }, { status: 400 })
    }

  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const orders = await orderService.getOrdersByUserId(userId)
    
    return NextResponse.json({
      success: true,
      orders
    })

  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
