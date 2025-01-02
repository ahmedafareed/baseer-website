'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import Header from '@/components/Header'
import { Footer } from '@/components/Footer'

type Order = {
  id: number
  order_number: string
  user_id: string
  total_amount: number
  created_at: string
  shipping_address: string
  items: string
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const { isAdmin } = useAuth()
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (isAdmin) {
      fetchOrders()
    }
  }, [isAdmin])

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Failed to fetch orders')
    } else {
      setOrders(data)
    }
  }

  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedOrder) return

    const { error } = await supabase
      .from('orders')
      .update({
        shipping_address: selectedOrder.shipping_address,
      })
      .eq('id', selectedOrder.id)

    if (error) {
      toast.error('Failed to update order')
    } else {
      toast.success('Order updated successfully')
      fetchOrders()
      setSelectedOrder(null)
    }
  }

  return (
    <>
      <Header onOpenAuth={() => {}}>
        <div className="max-w-4xl mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Order Management</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Order List</h2>
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border p-2 mb-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => setSelectedOrder(order)}
                >
                  <p>Order #{order.order_number}</p>
                  <p>Total: ${order.total_amount.toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Order Details</h2>
              {selectedOrder ? (
                <form onSubmit={handleUpdateOrder} className="space-y-4">
                  <div>
                    <Label htmlFor="orderNumber">Order Number</Label>
                    <Input id="orderNumber" value={selectedOrder.order_number} disabled />
                  </div>
                  <div>
                    <Label htmlFor="shippingAddress">Shipping Address</Label>
                    <Input
                      id="shippingAddress"
                      value={selectedOrder.shipping_address}
                      onChange={(e) => setSelectedOrder({ ...selectedOrder, shipping_address: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="items">Items</Label>
                    <textarea
                      id="items"
                      className="w-full h-32 p-2 border rounded bg-background text-foreground"
                      value={JSON.stringify(JSON.parse(selectedOrder.items), null, 2)}
                      readOnly
                    />
                  </div>
                  <Button type="submit">Update Order</Button>
                </form>
              ) : (
                <p>Select an order to view details</p>
              )}
            </div>
          </div>
        </div>
      </Header>
      <Footer />
    </>
  )
}

