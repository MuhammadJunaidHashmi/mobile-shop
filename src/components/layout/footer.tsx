import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">MS</span>
              </div>
              <span className="text-xl font-bold text-gray-900">MobileShop</span>
            </div>
            <p className="text-gray-600 text-sm">
              Your trusted destination for premium mobile phones in Pakistan. 
              We offer the latest smartphones with genuine warranties and fast delivery.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="text-gray-600 hover:text-blue-600 transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products?category=smartphones" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Smartphones
                </Link>
              </li>
              <li>
                <Link href="/products?category=accessories" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Accessories
                </Link>
              </li>
              <li>
                <Link href="/deals" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Special Deals
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/orders" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Support
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/warranty" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Warranty
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-600">
              © 2024 MobileShop. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Secure Payment</span>
              <span>•</span>
              <span>Fast Delivery</span>
              <span>•</span>
              <span>Genuine Products</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
