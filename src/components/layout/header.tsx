'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Search, Menu, User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/auth-context'
import { useCart } from '@/lib/cart-context'

export function Header() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  const { user, signOut } = useAuth()
  const { getTotalItems } = useCart()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">MS</span>
            </div>
            <span className="text-xl font-bold text-gray-900">MobileShop</span>
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Search for phones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4"
              />
            </div>
          </form>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/products" className="text-gray-700 hover:text-blue-600 transition-colors">
              Products
            </Link>
            <Link href="/orders" className="text-gray-700 hover:text-blue-600 transition-colors">
              Orders
            </Link>
            {user?.role === 'admin' && (
              <Link href="/admin" className="text-gray-700 hover:text-blue-600 transition-colors">
                Admin
              </Link>
            )}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors">
              <ShoppingCart className="h-5 w-5" />
              {getTotalItems() > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {getTotalItems()}
                </Badge>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative group">
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                  <User className="h-4 w-4" />
                </Button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="p-2">
                    <div className="px-3 py-2 text-sm font-medium text-gray-900 border-b border-gray-100">
                      {user.name}
                    </div>
                    <Link href="/profile" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                      Profile
                    </Link>
                    <Link href="/orders" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                      My Orders
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/signin">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Search for phones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4"
              />
            </div>
          </form>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-2">
              <Link href="/products" className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">
                Products
              </Link>
              <Link href="/orders" className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">
                Orders
              </Link>
              <Link href="/profile" className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">
                Profile
              </Link>
              {user?.role === 'admin' && (
                <Link href="/admin" className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">
                  Admin
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
