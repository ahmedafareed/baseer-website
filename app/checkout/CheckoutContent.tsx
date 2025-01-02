'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { applyDiscount } from '@/lib/coupons'
import Header from '@/components/Header'

export default function CheckoutContent({ discount }: { discount: string }) {
  const { items, clearCart } = useCart()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const supabase = createClientComponentClient()
  const appliedDiscount = Number(discount) || 0

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      const orderNumber = Math.floor(100000 + Math.random() * 900000).toString()
      const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const totalAmount = applyDiscount(subtotal, appliedDiscount)

      const orderDetails = {
        order_number: orderNumber,
        user_email: formData.email,
        total_amount: totalAmount,
        items: JSON.stringify(items),
        shipping_address: formData.address,
        shipping_city: formData.city,
        shipping_state: formData.state,
        shipping_country: formData.country,
        shipping_postal_code: formData.postalCode,
        payment_method: 'Credit Card',
        status: 'processing',
        applied_discount: appliedDiscount
      }

      const { error } = await supabase.from('orders').insert(orderDetails)

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      await clearCart()
      router.push('/order-confirmation')
    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalPrice = applyDiscount(subtotal, appliedDiscount)

  return (
    <Header>
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
            {items.map((item) => (
              <div key={item.id} className="flex justify-between mb-2">
                <span>{item.name} x {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({appliedDiscount}%)</span>
                  <span>-${(subtotal * appliedDiscount / 100).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold mt-2">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Shipping and Payment Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input id="address" name="address" value={formData.address} onChange={handleInputChange} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" value={formData.city} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input id="state" name="state" value={formData.state} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" name="country" value={formData.country} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleInputChange} required />
                </div>
              </div>
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input id="cardNumber" name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cardExpiry">Card Expiry (MM/YY)</Label>
                  <Input id="cardExpiry" name="cardExpiry" value={formData.cardExpiry} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="cardCVC">CVC</Label>
                  <Input id="cardCVC" name="cardCVC" value={formData.cardCVC} onChange={handleInputChange} required />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isProcessing}>
                {isProcessing ? 'Processing...' : 'Place Order'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Header>
  )
}

