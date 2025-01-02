'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from 'sonner'
import { useAuth } from './auth'

type WishlistItem = {
  id: number
  productId: number
  name: string
  price: number
}

type WishlistContextType = {
  items: WishlistItem[]
  addItem: (productId: number, name: string, price: number) => Promise<void>
  removeItem: (productId: number) => Promise<void>
  clearWishlist: () => Promise<void>
}

const WishlistContext = createContext<WishlistContextType | null>(null)


export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<WishlistItem[]>([])
  const { user } = useAuth()
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (user) {
      loadWishlist()
    } else {
      setItems([])
    }
  }, [user])

  const loadWishlist = async () => {
    if (!user) return
    
    const { data, error } = await supabase
      .from('wishlist_items')
      .select('*, products(name, price)')
      .eq('user_id', user.id)

    if (error) {
      toast.error("Failed to load wishlist items")
      return
    }

    setItems(data.map(item => ({
      id: item.id,
      productId: item.product_id,
      name: item.products.name,
      price: item.products.price
    })))
  }

  const addItem = async (productId: number, name: string, price: number) => {
    if (!user) {
      toast.error("Please sign in to add items to your wishlist")
      return
    }

    const existingItem = items.find(item => item.productId === productId)
    if (existingItem) {
      toast.info("Item is already in your wishlist")
      return
    }

    try {
      const { error } = await supabase
        .from('wishlist_items')
        .insert([{
          user_id: user.id,
          product_id: productId
        }])
      if (error) throw error
      await loadWishlist()
      toast.success("Added to wishlist")
    } catch (error) {
      toast.error("Failed to add item to wishlist")
    }
  }

  const removeItem = async (productId: number) => {
    if (!user) {
      toast.error("Please sign in to remove items from your wishlist")
      return
    }

    try {
      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId)
      if (error) throw error
      await loadWishlist()
      toast.success("Removed from wishlist")
    } catch (error) {
      toast.error("Failed to remove item from wishlist")
    }
  }

  const clearWishlist = async () => {
    if (!user) {
      toast.error("Please sign in to clear your wishlist")
      return
    }

    try {
      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('user_id', user.id)
      if (error) throw error
      setItems([])
      toast.success("Wishlist cleared")
    } catch (error) {
      toast.error("Failed to clear wishlist")
    }
  }

  return (
    <WishlistContext.Provider value={{ items, addItem, removeItem, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}

