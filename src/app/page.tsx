'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Star, Shield, Truck, Headphones } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ProductGrid } from '@/components/products/product-grid'
import { Layout } from '@/components/layout/layout'
import { supabase, Product } from '@/lib/supabase'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/lib/cart-context'

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .limit(8)
          .order('created_at', { ascending: false })

        if (error) throw error
        setFeaturedProducts(data || [])
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  const handleAddToCart = async (productId: string) => {
    try {
      await addToCart(productId)
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Premium Mobile Phones
              <span className="block text-blue-600">in Pakistan</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover the latest smartphones from top brands with genuine warranties, 
              fast delivery, and competitive prices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button size="lg" className="text-lg px-8 py-4">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/products?category=smartphones">
                <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                  View All Phones
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Genuine Products</h3>
              <p className="text-gray-600">100% authentic mobile phones with official warranties</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Truck className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Quick and secure delivery across Pakistan</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Best Prices</h3>
              <p className="text-gray-600">Competitive prices with regular discounts and offers</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <Headphones className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600">Round-the-clock customer support for all your needs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Products</h2>
              <p className="text-gray-600">Discover our most popular mobile phones</p>
            </div>
            <Link href="/products">
              <Button variant="outline">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <ProductGrid 
            products={featuredProducts} 
            onAddToCart={handleAddToCart}
            loading={loading}
          />
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-gray-600">Find the perfect phone for your needs</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/products?brand=Apple">
              <Card className="group hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <span className="text-2xl">📱</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">iPhone</h3>
                  <p className="text-gray-600">Latest iPhone models with iOS</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/products?brand=Samsung">
              <Card className="group hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <span className="text-2xl">📱</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Samsung Galaxy</h3>
                  <p className="text-gray-600">Premium Android smartphones</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/products?brand=OnePlus">
              <Card className="group hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <span className="text-2xl">📱</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">OnePlus</h3>
                  <p className="text-gray-600">Flagship killer smartphones</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Find Your Perfect Phone?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Browse our extensive collection of mobile phones and find the perfect device for your needs.
          </p>
          <Link href="/products">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
              Start Shopping
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  )
}
