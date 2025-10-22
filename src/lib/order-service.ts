import { supabase, Order } from './supabase'
import { generateTrackingNumber, calculateCancellationFee } from './utils'

export interface CreateOrderRequest {
  userId: string
  items: Array<{
    productId: string
    quantity: number
    price: number
  }>
  shippingAddress: {
    name: string
    phone: string
    address: string
    city: string
    postalCode: string
  }
  paymentMethod: string
  totalAmount: number
}

export interface UpdateOrderStatusRequest {
  orderId: string
  status: Order['status']
  trackingNumber?: string
}

export class OrderService {
  async createOrder(request: CreateOrderRequest): Promise<Order> {
    try {
      // Start a transaction
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: request.userId,
          status: 'pending',
          total_amount: request.totalAmount,
          shipping_address: request.shippingAddress,
          payment_method: request.paymentMethod,
          payment_status: 'pending'
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Create order items
      const orderItems = request.items.map(item => ({
        order_id: order.id,
        product_id: item.productId,
        quantity: item.quantity,
        price: item.price
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      // Update product stock quantities
      for (const item of request.items) {
        // First get current stock
        const { data: product, error: fetchError } = await supabase
          .from('products')
          .select('stock_quantity')
          .eq('id', item.productId)
          .single()

        if (fetchError) throw fetchError

        // Update with new stock quantity
        const { error: stockError } = await supabase
          .from('products')
          .update({
            stock_quantity: product.stock_quantity - item.quantity
          })
          .eq('id', item.productId)

        if (stockError) throw stockError
      }

      return order
    } catch (error) {
      console.error('Error creating order:', error)
      throw error
    }
  }

  async updateOrderStatus(request: UpdateOrderStatusRequest): Promise<Order> {
    try {
      const updateData: Record<string, unknown> = {
        status: request.status,
        updated_at: new Date().toISOString()
      }

      if (request.trackingNumber) {
        updateData.tracking_number = request.trackingNumber
      }

      // If order is being shipped, generate tracking number
      if (request.status === 'shipped' && !request.trackingNumber) {
        updateData.tracking_number = generateTrackingNumber()
      }

      const { data, error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', request.orderId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating order status:', error)
      throw error
    }
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            product:products (*)
          )
        `)
        .eq('id', orderId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching order:', error)
      return null
    }
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            product:products (*)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching user orders:', error)
      return []
    }
  }

  async getAllOrders(): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            product:products (*)
          ),
          user:users (*)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching all orders:', error)
      return []
    }
  }

  async cancelOrder(orderId: string, userId: string): Promise<Order> {
    try {
      // Get order details
      const order = await this.getOrderById(orderId)
      if (!order) {
        throw new Error('Order not found')
      }

      if (order.user_id !== userId) {
        throw new Error('Unauthorized to cancel this order')
      }

      if (order.status === 'cancelled') {
        throw new Error('Order is already cancelled')
      }

      if (order.status === 'shipped' || order.status === 'delivered') {
        throw new Error('Cannot cancel order that has been shipped or delivered')
      }

      // Calculate cancellation fee
      const cancellationFee = calculateCancellationFee(order.total_amount)

      // Update order status
      const { data, error } = await supabase
        .from('orders')
        .update({
          status: 'cancelled',
          cancellation_fee: cancellationFee,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select()
        .single()

      if (error) throw error

      // Restore product stock quantities
      if (order.order_items) {
        for (const item of order.order_items) {
          // First get current stock
          const { data: product, error: fetchError } = await supabase
            .from('products')
            .select('stock_quantity')
            .eq('id', item.product_id)
            .single()

          if (fetchError) throw fetchError

          // Update with restored stock quantity
          const { error: stockError } = await supabase
            .from('products')
            .update({
              stock_quantity: product.stock_quantity + item.quantity
            })
            .eq('id', item.product_id)

          if (stockError) throw stockError
        }
      }

      return data
    } catch (error) {
      console.error('Error cancelling order:', error)
      throw error
    }
  }

  async updatePaymentStatus(orderId: string, paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded'): Promise<Order> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({
          payment_status: paymentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating payment status:', error)
      throw error
    }
  }

  async getOrderStats(): Promise<{
    totalOrders: number
    pendingOrders: number
    completedOrders: number
    totalRevenue: number
  }> {
    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('status, total_amount')

      if (error) throw error

      const stats = {
        totalOrders: orders.length,
        pendingOrders: orders.filter(o => o.status === 'pending').length,
        completedOrders: orders.filter(o => o.status === 'delivered').length,
        totalRevenue: orders
          .filter(o => o.status === 'delivered')
          .reduce((sum, o) => sum + o.total_amount, 0)
      }

      return stats
    } catch (error) {
      console.error('Error fetching order stats:', error)
      return {
        totalOrders: 0,
        pendingOrders: 0,
        completedOrders: 0,
        totalRevenue: 0
      }
    }
  }
}

// Export singleton instance
export const orderService = new OrderService()
