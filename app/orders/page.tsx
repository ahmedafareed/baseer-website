'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import Header from '@/components/Header'

type Order = {
  id: number
  order_number: string
  total_amount: number
  status: string
  created_at: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [reason, setReason] = useState('')
  const [refundAmount, setRefundAmount] = useState('')
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Failed to fetch orders')
    } else {
      setOrders(data)
    }
  }

  const handleReturnRequest = async () => {
    if (!selectedOrder) return

    const response = await fetch('/api/returns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: selectedOrder.id, reason })
    })

    const result = await response.json()

    if (result.success) {
      toast.success('Return request submitted successfully')
      setSelectedOrder(null)
      setReason('')
    } else {
      toast.error(result.error || 'Failed to submit return request')
    }
  }

  const handleRefundRequest = async () => {
    if (!selectedOrder) return

    const response = await fetch('/api/refunds', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: selectedOrder.id, reason, amount: parseFloat(refundAmount) })
    })

    const result = await response.json()

    if (result.success) {
      toast.success('Refund request submitted successfully')
      setSelectedOrder(null)
      setReason('')
      setRefundAmount('')
    } else {
      toast.error(result.error || 'Failed to submit refund request')
    }
  }

  return (
    <Header onOpenAuth={() => {}}>
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
      {orders.map((order) => (
        <div key={order.id} className="border p-4 mb-4 rounded-lg">
          <h2 className="text-xl font-semibold">Order #{order.order_number}</h2>
          <p>Total: ${order.total_amount.toFixed(2)}</p>
          <p>Status: {order.status}</p>
          <p>Date: {new Date(order.created_at).toLocaleDateString()}</p>
          <Button onClick={() => setSelectedOrder(order)} className="mt-2">
            Request Return or Refund
          </Button>
        </div>
      ))}

      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Return or Refund Request</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="reason">Reason</Label>
                <Textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Please provide a reason for your request"
                  required
                />
              </div>
              <div>
                <Label htmlFor="refundAmount">Refund Amount (optional)</Label>
                <Input
                  id="refundAmount"
                  type="number"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  placeholder="Enter refund amount"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                  Cancel
                </Button>
                <Button onClick={handleReturnRequest}>Submit Return Request</Button>
                <Button onClick={handleRefundRequest}>Submit Refund Request</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </Header>
  )
}

