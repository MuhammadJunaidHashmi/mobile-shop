'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Package, ArrowRight, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Layout } from '@/components/layout/layout'
import { orderService } from '@/lib/order-service'
import { Order } from '@/lib/supabase'
import { formatPrice, formatDate } from '@/lib/utils'

export default function OrderSuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (orderId) {
      fetchOrder()
    }
  }, [orderId])

  const fetchOrder = async () => {
    try {
      const orderData = await orderService.getOrderById(orderId!)
      setOrder(orderData)
    } catch (error) {
      console.error('Error fetching order:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="animate-pulse">
              <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-96 mx-auto mb-8"></div>
              <div className="h-32 bg-gray-200 rounded-lg"></div>
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
          <div className="max-w-2xl mx-auto text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h1>
            <p className="text-gray-600 mb-6">
              The order you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Link href="/orders">
              <Button>View My Orders</Button>
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Order Confirmed!
            </h1>
            <p className="text-gray-600">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
          </div>

          {/* Order Details */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Order Number</p>
                  <p className="font-semibold">#{order.id.slice(-8).toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="font-semibold">{formatDate(order.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-semibold capitalize">{order.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="font-semibold">{formatPrice(order.total_amount)}</p>
                </div>
              </div>

              {order.tracking_number && (
                <div>
                  <p className="text-sm text-gray-600">Tracking Number</p>
                  <p className="font-mono font-semibold">{order.tracking_number}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Items Ordered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.order_items?.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.product?.images && item.product.images.length > 0 ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {item.product?.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {item.product?.brand} • {item.product?.storage} • {item.product?.color}
                      </p>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatPrice(item.price)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Shipping Information */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-semibold">{order.shipping_address.name}</p>
                <p>{order.shipping_address.address}</p>
                <p>{order.shipping_address.city}, {order.shipping_address.postalCode}</p>
                <p>Phone: {order.shipping_address.phone}</p>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-blue-600">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Order Confirmation</p>
                    <p className="text-sm text-gray-600">
                      You'll receive an email confirmation with your order details.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-blue-600">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Processing</p>
                    <p className="text-sm text-gray-600">
                      We'll prepare your order for shipment within 1-2 business days.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-blue-600">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Shipping</p>
                    <p className="text-sm text-gray-600">
                      Your order will be shipped and you'll receive tracking information.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-blue-600">4</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Delivery</p>
                    <p className="text-sm text-gray-600">
                      Your order will be delivered to your specified address.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/orders">
              <Button variant="outline" className="w-full sm:w-auto">
                <Package className="h-4 w-4 mr-2" />
                Track Order
              </Button>
            </Link>
            <Link href="/products">
              <Button className="w-full sm:w-auto">
                Continue Shopping
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="w-full sm:w-auto">
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}
