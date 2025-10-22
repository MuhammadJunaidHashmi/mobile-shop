'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, Package, Truck, MapPin, CreditCard, Phone, Mail, Calendar, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Layout } from '@/components/layout/layout'
import { useAuth } from '@/lib/auth-context'
import { supabase, Order, Product } from '@/lib/supabase'
import { formatPrice, formatDate } from '@/lib/utils'

interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price: number
  product: Product
}

interface OrderWithItems extends Order {
  order_items: OrderItem[]
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [order, setOrder] = useState<OrderWithItems | null>(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    if (params.orderId && user) {
      fetchOrder()
    }
  }, [params.orderId, user])

  const fetchOrder = async () => {
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
        .eq('id', params.orderId)
        .eq('user_id', user?.id)
        .single()

      if (error) throw error
      setOrder(data)
    } catch (error) {
      console.error('Error fetching order:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelOrder = async () => {
    if (!order) return

    const confirmed = confirm(
      `Are you sure you want to cancel this order? A cancellation fee may apply.`
    )
    
    if (!confirmed) return

    setCancelling(true)
    try {
      const response = await fetch(`/api/orders/${order.id}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to cancel order')
      }

      const result = await response.json()
      alert(`Order cancelled successfully. Cancellation fee: ${formatPrice(result.cancellationFee)}`)
      
      // Refresh order data
      await fetchOrder()
    } catch (error) {
      console.error('Error cancelling order:', error)
      alert(error instanceof Error ? error.message : 'Failed to cancel order')
    } finally {
      setCancelling(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning'
      case 'confirmed':
        return 'default'
      case 'processing':
        return 'default'
      case 'shipped':
        return 'default'
      case 'delivered':
        return 'success'
      case 'cancelled':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending Confirmation'
      case 'confirmed':
        return 'Order Confirmed'
      case 'processing':
        return 'Processing'
      case 'shipped':
        return 'Shipped'
      case 'delivered':
        return 'Delivered'
      case 'cancelled':
        return 'Cancelled'
      default:
        return status
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-64 bg-gray-200 rounded-lg"></div>
                <div className="h-32 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="h-64 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  if (!order) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto text-center">
            <div className="text-6xl mb-4">📦</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
            <p className="text-gray-600 mb-6">
              The order you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Button onClick={() => router.push('/orders')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => router.push('/orders')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Order #{order.id.slice(-8).toUpperCase()}
              </h1>
              <p className="text-gray-600">
                Placed on {formatDate(order.created_at)}
              </p>
            </div>
          </div>
          <Badge variant={getStatusColor(order.status)} className="text-sm">
            {getStatusText(order.status)}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.order_items?.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      <div className="relative w-16 h-16 overflow-hidden bg-gray-50 rounded-lg">
                        {item.product.images && item.product.images.length > 0 ? (
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                            No Image
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {item.product.brand} • {item.product.storage} • {item.product.color}
                        </p>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatPrice(item.price)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatPrice(item.price * item.quantity)} total
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="h-5 w-5 mr-2" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {order.shipping_address.name}
                      </p>
                      <p className="text-gray-600">
                        {order.shipping_address.address}
                      </p>
                      <p className="text-gray-600">
                        {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                      </p>
                      <p className="text-gray-600">
                        {order.shipping_address.country}
                      </p>
                    </div>
                  </div>
                  
                  {order.shipping_address.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-600">{order.shipping_address.phone}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    {formatPrice(order.order_items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {order.shipping_cost > 0 ? formatPrice(order.shipping_cost) : 'Free'}
                  </span>
                </div>
                
                {order.discount_amount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">-{formatPrice(order.discount_amount)}</span>
                  </div>
                )}
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(order.total_amount)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-medium">
                    {order.payment_method === 'credit_card' ? 'Credit Card' : order.payment_method}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status</span>
                  <Badge variant={order.payment_status === 'paid' ? 'success' : 'warning'}>
                    {order.payment_status}
                  </Badge>
                </div>
                
                {order.payment_id && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID</span>
                    <span className="font-mono text-sm">{order.payment_id}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Actions */}
            {order.status === 'pending' && (
              <Card>
                <CardHeader>
                  <CardTitle>Order Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="destructive" 
                    onClick={handleCancelOrder}
                    disabled={cancelling}
                    className="w-full"
                  >
                    <X className="h-4 w-4 mr-2" />
                    {cancelling ? 'Cancelling...' : 'Cancel Order'}
                  </Button>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    A cancellation fee may apply
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Order Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Order Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Order Placed</p>
                      <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                    </div>
                  </div>
                  
                  {order.status !== 'pending' && (
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">Order Confirmed</p>
                        <p className="text-xs text-gray-500">{formatDate(order.updated_at)}</p>
                      </div>
                    </div>
                  )}
                  
                  {order.status === 'shipped' && (
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">Shipped</p>
                        <p className="text-xs text-gray-500">In transit</p>
                      </div>
                    </div>
                  )}
                  
                  {order.status === 'delivered' && (
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">Delivered</p>
                        <p className="text-xs text-gray-500">Order completed</p>
                      </div>
                    </div>
                  )}
                  
                  {order.status === 'cancelled' && (
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">Cancelled</p>
                        <p className="text-xs text-gray-500">Order cancelled</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}
