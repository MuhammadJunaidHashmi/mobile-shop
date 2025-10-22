'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Package, Users, ShoppingCart, DollarSign, Plus, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Layout } from '@/components/layout/layout'
import { useAuth } from '@/lib/auth-context'
import { supabase, Product, Order, User } from '@/lib/supabase'
import { formatPrice, formatDate } from '@/lib/utils'

type OrderWithUser = Order & {
  user?: User
}

export default function AdminPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0
  })
  const [recentOrders, setRecentOrders] = useState<OrderWithUser[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    if (user) {
      if (user.role !== 'admin') {
        router.push('/')
        return
      }
      fetchAdminData()
    }
  }, [user, router])

  const fetchAdminData = async () => {
    try {
      // Fetch stats
      const [productsResult, ordersResult, usersResult] = await Promise.all([
        supabase.from('products').select('*'),
        supabase.from('orders').select('*'),
        supabase.from('users').select('*')
      ])

      const totalProducts = productsResult.data?.length || 0
      const totalOrders = ordersResult.data?.length || 0
      const totalUsers = usersResult.data?.length || 0
      const totalRevenue = ordersResult.data
        ?.filter(order => order.status === 'delivered')
        .reduce((sum, order) => sum + order.total_amount, 0) || 0

      setStats({ totalProducts, totalOrders, totalUsers, totalRevenue })

      // Fetch recent orders
      const { data: orders } = await supabase
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
        .limit(5)

      setRecentOrders(orders || [])

      // Fetch products
      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)

      setProducts(productsData || [])
    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setShowAddModal(true)
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)

      if (error) throw error

      // Refresh products list
      await fetchAdminData()
      alert('Product deleted successfully')
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Failed to delete product')
    }
  }

  const handleSaveProduct = async (productData: Partial<Product>) => {
    try {
      if (editingProduct) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id)

        if (error) throw error
        alert('Product updated successfully')
      } else {
        // Add new product
        const { error } = await supabase
          .from('products')
          .insert(productData)

        if (error) throw error
        alert('Product added successfully')
      }

      // Refresh data and close modal
      await fetchAdminData()
      setShowAddModal(false)
      setEditingProduct(null)
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Failed to save product')
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

  if (!user || user.role !== 'admin') {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-6">
              You don&apos;t have permission to access the admin panel.
            </p>
            <Button onClick={() => router.push('/')}>
              Go to Home
            </Button>
          </div>
        </div>
      </Layout>
    )
  }

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex space-x-4">
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-semibold">#{order.id.slice(-8).toUpperCase()}</p>
                      <p className="text-sm text-gray-600">
                        {order.user?.name || 'Unknown User'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatPrice(order.total_amount)}</p>
                      <Badge variant={getStatusColor(order.status) as "default" | "destructive" | "outline" | "secondary" | "ghost"}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Products */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.brand}</p>
                      <p className="text-sm text-gray-600">
                        Stock: {product.stock_quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatPrice(product.price)}</p>
                      <div className="flex space-x-2 mt-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEditProduct(product)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add/Edit Product Modal */}
        {showAddModal && (
          <ProductModal
            product={editingProduct}
            onSave={handleSaveProduct}
            onClose={() => {
              setShowAddModal(false)
              setEditingProduct(null)
            }}
          />
        )}
      </div>
    </Layout>
  )
}

// Product Modal Component
function ProductModal({ 
  product, 
  onSave, 
  onClose 
}: { 
  product: Product | null
  onSave: (data: Partial<Product>) => void
  onClose: () => void 
}) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    original_price: product?.original_price || 0,
    brand: product?.brand || '',
    model: product?.model || '',
    storage: product?.storage || '',
    color: product?.color || '',
    condition: product?.condition || 'new',
    stock_quantity: product?.stock_quantity || 0,
    category: product?.category || 'smartphones',
    images: product?.images?.join(',') || '',
    specifications: product?.specifications ? JSON.stringify(product.specifications, null, 2) : '{}'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const productData = {
      ...formData,
      price: Number(formData.price),
      original_price: Number(formData.original_price),
      stock_quantity: Number(formData.stock_quantity),
      images: formData.images.split(',').map(url => url.trim()).filter(Boolean),
      specifications: JSON.parse(formData.specifications)
    }

    onSave(productData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">
          {product ? 'Edit Product' : 'Add New Product'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Brand</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full p-2 border rounded"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Price (PKR)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Original Price (PKR)</label>
              <input
                type="number"
                value={formData.original_price}
                onChange={(e) => setFormData(prev => ({ ...prev, original_price: e.target.value }))}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stock Quantity</label>
              <input
                type="number"
                value={formData.stock_quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, stock_quantity: e.target.value }))}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Model</label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Storage</label>
              <input
                type="text"
                value={formData.storage}
                onChange={(e) => setFormData(prev => ({ ...prev, storage: e.target.value }))}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Color</label>
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Condition</label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData(prev => ({ ...prev, condition: e.target.value }))}
                className="w-full p-2 border rounded"
                required
              >
                <option value="new">New</option>
                <option value="used">Used</option>
                <option value="refurbished">Refurbished</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Images (comma-separated URLs)</label>
            <input
              type="text"
              value={formData.images}
              onChange={(e) => setFormData(prev => ({ ...prev, images: e.target.value }))}
              className="w-full p-2 border rounded"
              placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Specifications (JSON)</label>
            <textarea
              value={formData.specifications}
              onChange={(e) => setFormData(prev => ({ ...prev, specifications: e.target.value }))}
              className="w-full p-2 border rounded font-mono text-sm"
              rows={4}
              placeholder='{"display": "6.1-inch", "camera": "12MP", "battery": "3000mAh"}'
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {product ? 'Update Product' : 'Add Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
