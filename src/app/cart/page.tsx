'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Layout } from '@/components/layout/layout'
import { useCart } from '@/lib/cart-context'
import { useAuth } from '@/lib/auth-context'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
  const { items, loading, updateQuantity, removeFromCart, getTotalItems, getTotalPrice } = useCart()
  const { user } = useAuth()
  const [updating, setUpdating] = useState<string | null>(null)

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    setUpdating(productId)
    try {
      await updateQuantity(productId, newQuantity)
    } catch (error) {
      console.error('Error updating quantity:', error)
    } finally {
      setUpdating(null)
    }
  }

  const handleRemoveItem = async (productId: string) => {
    setUpdating(productId)
    try {
      await removeFromCart(productId)
    } catch (error) {
      console.error('Error removing item:', error)
    } finally {
      setUpdating(null)
    }
  }

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto text-center">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign in required</h2>
            <p className="text-gray-600 mb-6">
              Please sign in to view your cart and continue shopping.
            </p>
            <div className="space-y-3">
              <Link href="/auth/signin">
                <Button className="w-full">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button variant="outline" className="w-full">Create Account</Button>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse space-y-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex space-x-4">
                <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    )
  }

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto text-center">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link href="/products">
              <Button className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600 mt-1">
              {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          <Link href="/products">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    {/* Product Image */}
                    <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.product?.images && item.product.images.length > 0 ? (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          <span className="text-xs">No Image</span>
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {item.product?.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {item.product?.brand} • {item.product?.storage} • {item.product?.color}
                      </p>
                      <p className="text-lg font-bold text-gray-900 mt-1">
                        {formatPrice(item.product?.price || 0)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)}
                        disabled={updating === item.product_id || item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)}
                        disabled={updating === item.product_id}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleRemoveItem(item.product_id)}
                      disabled={updating === item.product_id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({getTotalItems()} items)</span>
                    <span className="font-medium">{formatPrice(getTotalPrice())}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">{formatPrice(getTotalPrice() * 0.15)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>{formatPrice(getTotalPrice() * 1.15)}</span>
                    </div>
                  </div>
                </div>

                <Link href="/checkout" className="block">
                  <Button className="w-full" size="lg">
                    Proceed to Checkout
                  </Button>
                </Link>

                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    Secure checkout with SSL encryption
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}
