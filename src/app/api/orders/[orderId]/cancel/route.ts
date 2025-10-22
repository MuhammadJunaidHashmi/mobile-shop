import { NextRequest, NextResponse } from 'next/server'
import { orderService } from '@/lib/order-service'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const cancelledOrder = await orderService.cancelOrder(orderId, userId)

    return NextResponse.json({
      success: true,
      order: cancelledOrder,
      message: 'Order cancelled successfully'
    })

  } catch (error: unknown) {
    console.error('Order cancellation error:', error)
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to cancel order',
        success: false 
      },
      { status: 400 }
    )
  }
}
