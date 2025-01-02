'use client'

import React from 'react'
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

type ProductFilterProps = {
  minPrice: number
  maxPrice: number
  priceRange: [number, number]
  setPriceRange: (range: [number, number]) => void
  minRating: number
  maxRating: number
  ratingRange: [number, number]
  setRatingRange: (range: [number, number]) => void
}

export const ProductFilter: React.FC<ProductFilterProps> = ({
  minPrice,
  maxPrice,
  priceRange,
  setPriceRange,
  minRating,
  maxRating,
  ratingRange,
  setRatingRange
}) => {
  return (
    <div className="bg-background border-b py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-8">
          <div className="flex-1 min-w-[200px]">
            <Label htmlFor="price-range">Price Range</Label>
            <Slider
              id="price-range"
              min={minPrice}
              max={maxPrice}
              step={1}
              value={priceRange}
              onValueChange={(value) => setPriceRange(value as [number, number])}
              className="mt-2"
            />
            <div className="flex justify-between mt-1 text-sm">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
          <div className="flex-1 min-w-[200px]">
            <Label htmlFor="rating-range">Rating Range</Label>
            <Slider
              id="rating-range"
              min={minRating}
              max={maxRating}
              step={0.5}
              value={ratingRange}
              onValueChange={(value) => setRatingRange(value as [number, number])}
              className="mt-2"
            />
            <div className="flex justify-between mt-1 text-sm">
              <span>{ratingRange[0]} stars</span>
              <span>{ratingRange[1]} stars</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

