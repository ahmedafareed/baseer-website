'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAuth } from '@/lib/auth'
import { useCart } from '@/lib/cart'
import { useWishlist } from '@/lib/wishlist'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Star, Heart, ShoppingCart } from 'lucide-react'
import { toast } from 'sonner'
import Header from '@/components/Header'

const supabase = createClientComponentClient()

type Product = {
  id: number
  name: string
  description: string
  price: number
  image_url: string
  average_rating: number
}

type Review = {
  id: number
  user_id: string
  rating: number
  comment: string
  created_at: string
}

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [userRating, setUserRating] = useState(0)
  const [userReview, setUserReview] = useState('')
  const { user } = useAuth()
  const { addItem: addToCart } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, items: wishlistItems } = useWishlist()
  const [isInWishlist, setIsInWishlist] = useState(false)

  useEffect(() => {
    fetchProductAndReviews()
  }, [id])

  useEffect(() => {
    setIsInWishlist(wishlistItems.some(item => item.productId === Number(id)))
  }, [wishlistItems, id])

  const fetchProductAndReviews = async () => {
    const { data: productData, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (productError) {
      toast.error('Failed to fetch product')
      return
    }

    setProduct(productData)

    const { data: reviewsData, error: reviewsError } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', id)
      .order('created_at', { ascending: false })

    if (reviewsError) {
      toast.error('Failed to fetch reviews')
      return
    }

    setReviews(reviewsData)
  }

  const handleAddToCart = async () => {
    if (!product) return
    await addToCart(product.id, product.name, product.price)
    toast.success('Added to cart')
  }

  const handleWishlist = async () => {
    if (!product) return
    if (isInWishlist) {
      await removeFromWishlist(product.id)
      toast.success('Removed from wishlist')
    } else {
      await addToWishlist(product.id, product.name, product.price)
      toast.success('Added to wishlist')
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !product) return

    const { error } = await supabase
      .from('reviews')
      .upsert({
        user_id: user.id,
        product_id: product.id,
        rating: userRating,
        comment: userReview
      })

    if (error) {
      toast.error('Failed to submit review')
      return
    }

    toast.success('Review submitted successfully')
    setUserRating(0)
    setUserReview('')
    fetchProductAndReviews()
  }

  if (!product) return <div>Loading...</div>

  return (
    <Header onOpenAuth={() => {}}>
    <div className="max-w-4xl mx-auto p-4">
      <div className="grid md:grid-cols-2 gap-8">
        <img 
          src={product.image_url || '/placeholder.svg'} 
          alt={product.name} 
          className="w-full h-auto object-cover rounded-lg"
        />
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center mb-4">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="ml-1 text-lg">{product.average_rating?.toFixed(1) || 'No ratings yet'}</span>
          </div>
          <p className="text-xl font-semibold mb-4">${product.price.toFixed(2)}</p>
          <p className="mb-4">{product.description}</p>
          <div className="flex gap-4">
            <Button onClick={handleAddToCart}>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
            <Button variant="outline" onClick={handleWishlist}>
              <Heart className={`w-4 h-4 mr-2 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} />
              {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>
        {user && (
          <form onSubmit={handleSubmitReview} className="mb-8">
            <div className="flex items-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-6 h-6 cursor-pointer ${star <= userRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                  onClick={() => setUserRating(star)}
                />
              ))}
            </div>
            <Textarea
              value={userReview}
              onChange={(e) => setUserReview(e.target.value)}
              placeholder="Write your review here..."
              className="mb-2"
            />
            <Button type="submit">Submit Review</Button>
          </form>
        )}
        {reviews.map((review) => (
          <div key={review.id} className="border-b py-4">
            <div className="flex items-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <p className="mb-2">{review.comment}</p>
            <p className="text-sm text-gray-500">
              {new Date(review.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
    </Header>
  )
}

