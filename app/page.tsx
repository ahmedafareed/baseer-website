'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import ProductCard from '@/components/ProductCard'
import AuthModal from '@/components/AuthModal'
import { ProductFilter } from '@/components/ProductFilter'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Footer } from '@/components/Footer'

type Product = {
  id: number
  name: string
  price: number
  description: string
  image: string
  average_rating: number
}

export default function Home() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin")
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [ratingRange, setRatingRange] = useState<[number, number]>([0, 5])

  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, priceRange, ratingRange])

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
    
    if (error) {
      console.error('Error fetching products:', error)
    } else {
      setProducts(data || [])
    }
  }

  const filterProducts = () => {
    const filtered = products.filter(product => 
      product.price >= priceRange[0] &&
      product.price <= priceRange[1] &&
      product.average_rating >= ratingRange[0] &&
      product.average_rating <= ratingRange[1]
    )
    setFilteredProducts(filtered)
  }

  const handleOpenAuth = (mode: "signin" | "signup") => {
    setAuthMode(mode)
    setIsAuthModalOpen(true)
  }

  const minPrice = Math.min(...products.map(p => p.price))
  const maxPrice = Math.max(...products.map(p => p.price))
  const minRating = 0
  const maxRating = 5

  return (
    <>
      <Header>
        <ProductFilter
          minPrice={minPrice}
          maxPrice={maxPrice}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          minRating={minRating}
          maxRating={maxRating}
          ratingRange={ratingRange}
          setRatingRange={setRatingRange}
        />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`}>
                <ProductCard product={product} />
              </Link>
            ))}
          </div>
        </main>
      </Header>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
      />
      <Footer />
    </>
  )
}

