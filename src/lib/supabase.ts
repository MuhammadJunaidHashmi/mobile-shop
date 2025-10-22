import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const createClientComponentClient = () => {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// Database types
export interface Product {
  id: string
  name: string
  description: string
  price: number
  original_price?: number
  brand: string
  model: string
  storage: string
  color: string
  condition: 'new' | 'used' | 'refurbished'
  images: string[]
  specifications: Record<string, unknown>
  stock_quantity: number
  category: string
  created_at: string
  updated_at: string
}

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  quantity: number
  created_at: string
  updated_at: string
  product?: Product
}

export interface Order {
  id: string
  user_id: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total_amount: number
  shipping_address: {
    name: string
    phone: string
    address: string
    city: string
    postal_code: string
  }
  payment_method: string
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
  order_items: OrderItem[]
  tracking_number?: string
  cancellation_fee?: number
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price: number
  product?: Product
}

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  role: 'user' | 'admin'
  created_at: string
  updated_at: string
}
