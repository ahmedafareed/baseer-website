'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCart } from '@/lib/cart'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { validateCoupon, getCouponDiscount, applyDiscount } from '@/lib/coupons'
import Header from '@/components/Header'

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [couponCode, setCouponCode] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState(0)

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalPrice = applyDiscount(subtotal, appliedDiscount)

  const handleRemoveItem = (productId: number) => {
    removeItem(productId)
    toast.success('Item removed from cart')
  }

  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    updateQuantity(productId, newQuantity)
    toast.success('Cart updated')
  }

  const handleClearCart = () => {
    clearCart()
    toast.success('Cart cleared')
  }

  const handleApplyCoupon = async () => {
    const isValid = await validateCoupon(couponCode)
    if (isValid) {
      const discount = await getCouponDiscount(couponCode)
      setAppliedDiscount(discount)
      toast.success(`Coupon applied! ${discount}% discount`)
    } else {
      toast.error('Invalid or expired coupon')
    }
  }

  if (!user) {
    return null // or a loading spinner
  }

  return (
    <Header onOpenAuth={() => {}}>
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
        {items.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b py-4">
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-600">${item.price.toFixed(2)} each</p>
                </div>
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="mx-2">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-2"
                    onClick={() => handleRemoveItem(item.productId)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-4">
                <Input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <Button onClick={handleApplyCoupon}>Apply Coupon</Button>
              </div>
              <p className="text-xl font-bold">Subtotal: ${subtotal.toFixed(2)}</p>
              {appliedDiscount > 0 && (
                <p className="text-green-600">Discount: ${(subtotal - totalPrice).toFixed(2)} ({appliedDiscount}%)</p>
              )}
              <p className="text-2xl font-bold mt-2">Total: ${totalPrice.toFixed(2)}</p>
              <div className="mt-4 flex justify-between">
                <Button variant="outline" onClick={handleClearCart}>Clear Cart</Button>
                <Link href={`/checkout?discount=${appliedDiscount}`} passHref>
                  <Button>Proceed to Checkout</Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </Header>
  )
}

