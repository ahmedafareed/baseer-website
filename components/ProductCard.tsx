'use client'

import { useState, useEffect } from 'react'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { toast } from 'sonner'
import { useCart } from '@/lib/cart'
import { useWishlist } from '@/lib/wishlist'
import { Button } from '@/components/ui/button'

type Product = {
  id: number
  name: string
  price: number
  description: string
  image: string
  image_url?: string
  average_rating?: number
  stock: number
}

export default function ProductCard({ product }: { product: Product }) {
  const { addItem: addToCart } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, items: wishlistItems } = useWishlist()
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isUpdatingWishlist, setIsUpdatingWishlist] = useState(false)

  useEffect(() => {
    setIsInWishlist(wishlistItems.some(item => item.productId === product.id))
  }, [wishlistItems, product.id])

  const handleAddToCart = async () => {
    if (product.stock === 0) {
      toast.error("This product is out of stock")
      return
    }
    setIsAddingToCart(true)
    try {
      await addToCart(product.id, product.name, product.price)
      toast.success("Added to cart")
    } catch (error) {
      toast.error("Failed to add item to cart")
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleWishlist = async () => {
    setIsUpdatingWishlist(true)
    try {
      if (isInWishlist) {
        await removeFromWishlist(product.id)
        toast.success("Removed from wishlist")
      } else {
        await addToWishlist(product.id, product.name, product.price)
        toast.success("Added to wishlist")
      }
    } catch (error) {
      toast.error("Failed to update wishlist")
    } finally {
      setIsUpdatingWishlist(false)
    }
  }

  return (
    <div className="bg-card text-card-foreground rounded-lg shadow-md overflow-hidden">
      <img
        src={product.image_url || '/placeholder.svg'}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        {product.average_rating && (
          <div className="flex items-center mt-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="ml-1 text-sm text-muted-foreground">
              {product.average_rating.toFixed(1)}
            </span>
          </div>
        )}
        <p className="text-muted-foreground mt-2">{product.description}</p>
        <p className="text-xl font-bold mt-2">${product.price.toFixed(2)}</p>
        <p className="text-sm text-muted-foreground mt-1">
          {product.stock > 0 ? `${product.stock} left in stock` : "Out of stock"}
        </p>
        <div className="mt-4 flex gap-2">
          <Button
            onClick={handleAddToCart}
            className="flex-1"
            disabled={isAddingToCart || product.stock === 0}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {isAddingToCart ? 'Adding...' : (product.stock === 0 ? 'Out of Stock' : 'Add to Cart')}
          </Button>
          <Button
            onClick={handleWishlist}
            variant="outline"
            size="icon"
            className={isInWishlist ? "bg-pink-50" : ""}
            disabled={isUpdatingWishlist}
          >
            <Heart
              className={`h-5 w-5 ${
                isInWishlist ? "fill-pink-500 text-pink-500" : "text-muted-foreground"
              }`}
            />
          </Button>
        </div>
      </div>
    </div>
  )
}

