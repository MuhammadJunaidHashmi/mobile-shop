'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User, Mail, Phone, MapPin, Package, Settings, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Layout } from '@/components/layout/layout'
import { useAuth } from '@/lib/auth-context'
import { supabase, Order } from '@/lib/supabase'
import { formatPrice, formatDate } from '@/lib/utils'

export default function ProfilePage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  })

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin')
      return
    }

    fetchUserData()
  }, [user, router])

  const fetchUserData = async () => {
    if (!user) return

    try {
      // Fetch recent orders
      const { data: orders, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            product:products (*)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) throw error
      setRecentOrders(orders || [])

      // Set profile data
      setProfileData({
        name: user.name,
        email: user.email,
        phone: user.phone || ''
      })
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: profileData.name,
          phone: profileData.phone
        })
        .eq('id', user.id)

      if (error) throw error

      alert('Profile updated successfully')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (!user) {
    return null
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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Information */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <Input
                          value={profileData.name}
                          onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <Input
                          value={profileData.phone}
                          onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <Input
                        value={profileData.email}
                        disabled
                        className="bg-gray-50"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Email cannot be changed
                      </p>
                    </div>

                    <Button type="submit" disabled={saving}>
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="h-5 w-5 mr-2" />
                    Recent Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {recentOrders.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No orders yet</p>
                      <Button 
                        className="mt-4" 
                        onClick={() => router.push('/products')}
                      >
                        Start Shopping
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentOrders.map((order) => (
                        <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-semibold">
                                Order #{order.id.slice(-8).toUpperCase()}
                              </p>
                              <p className="text-sm text-gray-600">
                                {formatDate(order.created_at)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">{formatPrice(order.total_amount)}</p>
                              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {order.status}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                              {order.order_items?.length} item(s)
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => router.push(`/orders/${order.id}`)}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      <div className="text-center pt-4">
                        <Button 
                          variant="outline"
                          onClick={() => router.push('/orders')}
                        >
                          View All Orders
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Account Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Account Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Member since</span>
                      <span className="font-medium">
                        {new Date().toLocaleDateString('en-PK', { 
                          year: 'numeric', 
                          month: 'long' 
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total orders</span>
                      <span className="font-medium">{recentOrders.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Account type</span>
                      <span className="font-medium capitalize">{user.role}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => router.push('/orders')}
                  >
                    <Package className="h-4 w-4 mr-2" />
                    View All Orders
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => router.push('/products')}
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Continue Shopping
                  </Button>
                  {user.role === 'admin' && (
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => router.push('/admin')}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Admin Panel
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
