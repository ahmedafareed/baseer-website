'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from 'sonner'
import { useAuth } from './auth'

type CartItem = {
  id: number
  productId: number
  quantity: number
  name: string
  price: number
}

type CartContextType = {
  items: CartItem[]
  addItem: (productId: number, name: string, price: number) => Promise<void>
  removeItem: (productId: number) => Promise<void>
  updateQuantity: (productId: number, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | null>(null)


export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([])
  const { user } = useAuth()
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (user) {
      loadCart()
    } else {
      setItems([])
    }
  }, [user])

  const loadCart = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from('cart_items')
      .select('*, products(name, price)')
      .eq('user_id', user.id)

    if (error) {
      toast.error("Failed to load cart items")
      return
    }

    setItems(data.map(item => ({
      id: item.id,
      productId: item.product_id,
      quantity: item.quantity,
      name: item.products.name,
      price: item.products.price
    })))
  }

  const addItem = async (productId: number, name: string, price: number) => {
    if (!user) {
      toast.error("Please sign in to add items to your cart")
      return
    }

    const existingItem = items.find(item => item.productId === productId)
    
    try {
      if (existingItem) {
        await updateQuantity(productId, existingItem.quantity + 1)
      } else {
        const { error } = await supabase
          .from('cart_items')
          .insert([{
            user_id: user.id,
            product_id: productId,
            quantity: 1
          }])
        if (error) throw error
      }
      await loadCart()
      toast.success("Added to cart")
    } catch (error) {
      toast.error("Failed to add item to cart")
    }
  }

  const removeItem = async (productId: number) => {
    if (!user) {
      toast.error("Please sign in to remove items from your cart")
      return
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId)
      if (error) throw error
      await loadCart()
      toast.success("Removed from cart")
    } catch (error) {
      toast.error("Failed to remove item from cart")
    }
  }

  const updateQuantity = async (productId: number, quantity: number) => {
    if (!user) {
      toast.error("Please sign in to update your cart")
      return
    }

    try {
      if (quantity <= 0) {
        await removeItem(productId)
      } else {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity })
          .eq('user_id', user.id)
          .eq('product_id', productId)
        if (error) throw error
        await loadCart()
        toast.success("Cart updated")
      }
    } catch (error) {
      toast.error("Failed to update cart")
    }
  }

  const clearCart = async () => {
    if (!user) {
      toast.error("Please sign in to clear your cart")
      return
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
      if (error) throw error
      setItems([])
      toast.success("Cart cleared")
    } catch (error) {
      toast.error("Failed to clear cart")
    }
  }

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

