'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, CartItem, Product } from './supabase'
import { useAuth } from './auth-context'

interface CartContextType {
  items: (CartItem & { product?: Product })[]
  loading: boolean
  addToCart: (productId: string, quantity?: number) => Promise<void>
  removeFromCart: (productId: string) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  getTotalItems: () => number
  getTotalPrice: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<(CartItem & { product?: Product })[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchCartItems()
    } else {
      setItems([])
      setLoading(false)
    }
  }, [user])

  const fetchCartItems = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          product:products(*)
        `)
        .eq('user_id', user.id)

      if (error) throw error
      setItems(data || [])
    } catch (error) {
      console.error('Error fetching cart items:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (productId: string, quantity: number = 1) => {
    if (!user) {
      // Redirect to login or show login modal
      return
    }

    try {
      // Check if item already exists in cart
      const existingItem = items.find(item => item.product_id === productId)
      
      if (existingItem) {
        // Update quantity
        await updateQuantity(productId, existingItem.quantity + quantity)
      } else {
        // Add new item
        const { data, error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: productId,
            quantity
          })
          .select(`
            *,
            product:products(*)
          `)
          .single()

        if (error) throw error
        setItems(prev => [...prev, data])
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      throw error
    }
  }

  const removeFromCart = async (productId: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId)

      if (error) throw error
      setItems(prev => prev.filter(item => item.product_id !== productId))
    } catch (error) {
      console.error('Error removing from cart:', error)
      throw error
    }
  }

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user) return

    if (quantity <= 0) {
      await removeFromCart(productId)
      return
    }

    try {
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .select(`
          *,
          product:products(*)
        `)
        .single()

      if (error) throw error
      setItems(prev => 
        prev.map(item => 
          item.product_id === productId ? data : item
        )
      )
    } catch (error) {
      console.error('Error updating quantity:', error)
      throw error
    }
  }

  const clearCart = async () => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)

      if (error) throw error
      setItems([])
    } catch (error) {
      console.error('Error clearing cart:', error)
      throw error
    }
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      const price = item.product?.price || 0
      return total + (price * item.quantity)
    }, 0)
  }

  return (
    <CartContext.Provider value={{
      items,
      loading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
