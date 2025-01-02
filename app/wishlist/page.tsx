'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, ShoppingCart } from 'lucide-react'
import { useWishlist } from '@/lib/wishlist'
import { useCart } from '@/lib/cart'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import Header from '@/components/Header'

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlist()
  const { addItem: addToCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  if (!user) {
    return null // or a loading spinner
  }

  const handleAddToCart = async (item: any) => {
    await addToCart(item.productId, item.name, item.price)
    await removeItem(item.productId)
  }

  return (
    <Header onOpenAuth={() => {}}>
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Your Wishlist</h1>
        {items.length === 0 ? (
          <p>Your wishlist is empty.</p>
        ) : (
          <>
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b py-4"
              >
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-600">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2"
                    onClick={() => handleAddToCart(item)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.productId)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            <div className="mt-4">
              <Button variant="outline" onClick={clearWishlist}>Clear Wishlist</Button>
            </div>
          </>
        )}
      </div>
    </Header>
  )
}

