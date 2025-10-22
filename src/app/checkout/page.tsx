'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CreditCard, MapPin, User, Phone, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Layout } from '@/components/layout/layout'
import { useCart } from '@/lib/cart-context'
import { useAuth } from '@/lib/auth-context'
import { formatPrice, validateCardNumber, validateExpiryDate, validateCVV } from '@/lib/utils'

export default function CheckoutPage() {
  const { items, getTotalItems, getTotalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    postalCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate form data
      if (!validateCardNumber(formData.cardNumber)) {
        alert('Invalid card number')
        return
      }

      if (!validateExpiryDate(formData.expiryDate)) {
        alert('Invalid expiry date')
        return
      }

      if (!validateCVV(formData.cvv)) {
        alert('Invalid CVV')
        return
      }

      // Prepare order data
      const orderData = {
        items: items.map(item => ({
          productId: item.product_id,
          quantity: item.quantity,
          price: item.product?.price || 0
        })),
        shippingAddress: {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode
        },
        paymentMethod: 'credit_card',
        cardInfo: {
          number: formData.cardNumber.replace(/\s/g, ''),
          expiryMonth: formData.expiryDate.split('/')[0],
          expiryYear: '20' + formData.expiryDate.split('/')[1],
          cvv: formData.cvv,
          name: formData.cardName
        },
        userId: user!.id
      }

      // Create order
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      const result = await response.json()

      if (result.success) {
        // Clear cart
        await clearCart()
        
        // Redirect to success page
        router.push(`/orders/success?orderId=${result.order.id}`)
      } else {
        alert(result.message || 'Payment failed. Please try again.')
      }
    } catch (error) {
      console.error('Payment failed:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    router.push('/auth/signin')
    return null
  }

  if (items.length === 0) {
    router.push('/cart')
    return null
  }

  const subtotal = getTotalPrice()
  const tax = subtotal * 0.15
  const total = subtotal + tax

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Forms */}
            <div className="space-y-6">
              {/* Shipping Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Address *
                    </label>
                    <Input
                      id="address"
                      name="address"
                      type="text"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Street address, apartment, suite, etc."
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <Input
                        id="city"
                        name="city"
                        type="text"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code *
                      </label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        type="text"
                        required
                        value={formData.postalCode}
                        onChange={handleInputChange}
                      />
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
                <CardContent className="space-y-4">
                  <div>
                    <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                      Name on Card *
                    </label>
                    <Input
                      id="cardName"
                      name="cardName"
                      type="text"
                      required
                      value={formData.cardName}
                      onChange={handleInputChange}
                      placeholder="Full name as shown on card"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number *
                    </label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      type="text"
                      required
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date *
                      </label>
                      <Input
                        id="expiryDate"
                        name="expiryDate"
                        type="text"
                        required
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                        CVV *
                      </label>
                      <Input
                        id="cvv"
                        name="cvv"
                        type="text"
                        required
                        value={formData.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        maxLength={4}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div className="space-y-6">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
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
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.product?.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          {formatPrice((item.product?.price || 0) * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Order Totals */}
                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal ({getTotalItems()} items)</span>
                      <span className="font-medium">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium text-green-600">Free</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax (15%)</span>
                      <span className="font-medium">{formatPrice(tax)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>{formatPrice(total)}</span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? 'Processing Payment...' : `Pay ${formatPrice(total)}`}
                  </Button>

                  <div className="text-center">
                    <p className="text-xs text-gray-500">
                      🔒 Secure payment with SSL encryption
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}
