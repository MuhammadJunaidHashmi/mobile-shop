'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Filter, SortAsc, Grid, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ProductGrid } from '@/components/products/product-grid'
import { Layout } from '@/components/layout/layout'
import { supabase, Product } from '@/lib/supabase'
import { useCart } from '@/lib/cart-context'

function ProductsContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    brand: searchParams.get('brand') || '',
    category: searchParams.get('category') || '',
    minPrice: '',
    maxPrice: '',
    condition: '',
    sortBy: 'created_at',
    sortOrder: 'desc'
  })
  const [showFilters, setShowFilters] = useState(false)
  const { addToCart } = useCart()

  useEffect(() => {
    fetchProducts()
  }, [filters])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      let query = supabase.from('products').select('*')

      // Apply filters
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }
      if (filters.brand) {
        query = query.eq('brand', filters.brand)
      }
      if (filters.category) {
        query = query.eq('category', filters.category)
      }
      if (filters.condition) {
        query = query.eq('condition', filters.condition)
      }
      if (filters.minPrice) {
        query = query.gte('price', parseFloat(filters.minPrice))
      }
      if (filters.maxPrice) {
        query = query.lte('price', parseFloat(filters.maxPrice))
      }

      // Apply sorting
      query = query.order(filters.sortBy, { ascending: filters.sortOrder === 'asc' })

      const { data, error } = await query

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      brand: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      condition: '',
      sortBy: 'created_at',
      sortOrder: 'desc'
    })
  }

  const handleAddToCart = async (productId: string) => {
    try {
      await addToCart(productId)
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }

  const brands = ['Apple', 'Samsung', 'OnePlus', 'Google', 'Xiaomi', 'Huawei']
  const conditions = ['new', 'used', 'refurbished']
  const sortOptions = [
    { value: 'created_at', label: 'Newest First' },
    { value: 'price', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'name', label: 'Name: A to Z' }
  ]

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
              </div>

              <div className="space-y-6">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search
                  </label>
                  <Input
                    placeholder="Search products..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                </div>

                {/* Brand */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand
                  </label>
                  <div className="space-y-2">
                    {brands.map((brand) => (
                      <label key={brand} className="flex items-center">
                        <input
                          type="radio"
                          name="brand"
                          value={brand}
                          checked={filters.brand === brand}
                          onChange={(e) => handleFilterChange('brand', e.target.value)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Condition */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condition
                  </label>
                  <div className="space-y-2">
                    {conditions.map((condition) => (
                      <label key={condition} className="flex items-center">
                        <input
                          type="radio"
                          name="condition"
                          value={condition}
                          checked={filters.condition === condition}
                          onChange={(e) => handleFilterChange('condition', e.target.value)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700 capitalize">{condition}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range (PKR)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Min"
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    />
                    <Input
                      placeholder="Max"
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">All Products</h1>
                <p className="text-gray-600">
                  {products.length} products found
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Mobile Filter Toggle */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>

                {/* Sort */}
                <select
                  value={`${filters.sortBy}_${filters.sortOrder}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('_')
                    setFilters(prev => ({ ...prev, sortBy, sortOrder }))
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {(filters.search || filters.brand || filters.condition || filters.minPrice || filters.maxPrice) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {filters.search && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Search: {filters.search}
                    <button
                      onClick={() => handleFilterChange('search', '')}
                      className="ml-1 hover:text-red-600"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {filters.brand && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Brand: {filters.brand}
                    <button
                      onClick={() => handleFilterChange('brand', '')}
                      className="ml-1 hover:text-red-600"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {filters.condition && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Condition: {filters.condition}
                    <button
                      onClick={() => handleFilterChange('condition', '')}
                      className="ml-1 hover:text-red-600"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {(filters.minPrice || filters.maxPrice) && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Price: {filters.minPrice || '0'} - {filters.maxPrice || '∞'}
                    <button
                      onClick={() => {
                        handleFilterChange('minPrice', '')
                        handleFilterChange('maxPrice', '')
                      }}
                      className="ml-1 hover:text-red-600"
                    >
                      ×
                    </button>
                  </Badge>
                )}
              </div>
            )}

            {/* Products Grid */}
            <ProductGrid 
              products={products} 
              onAddToCart={handleAddToCart}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="h-64 bg-gray-200 rounded-lg"></div>
              <div className="lg:col-span-3 space-y-4">
                <div className="h-32 bg-gray-200 rounded-lg"></div>
                <div className="h-32 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    }>
      <ProductsContent />
    </Suspense>
  )
}
