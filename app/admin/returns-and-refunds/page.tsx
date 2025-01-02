'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

type Request = {
  id: number
  order_id: number
  reason: string
  status: string
  created_at: string
  amount?: number
}

export default function AdminReturnsAndRefundsPage() {
  const [returnRequests, setReturnRequests] = useState<Request[]>([])
  const [refundRequests, setRefundRequests] = useState<Request[]>([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      // Redirect to login or show unauthorized message
      return
    }

    // Fetch return requests
    const { data: returns, error: returnsError } = await supabase
      .from('return_requests')
      .select('*')
      .order('created_at', { ascending: false })

    if (returnsError) {
      toast.error('Failed to fetch return requests')
    } else {
      setReturnRequests(returns)
    }

    // Fetch refund requests
    const { data: refunds, error: refundsError } = await supabase
      .from('refund_requests')
      .select('*')
      .order('created_at', { ascending: false })

    if (refundsError) {
      toast.error('Failed to fetch refund requests')
    } else {
      setRefundRequests(refunds)
    }
  }

  const handleUpdateStatus = async (table: string, id: number, newStatus: string) => {
    const { error } = await supabase
      .from(table)
      .update({ status: newStatus })
      .eq('id', id)

    if (error) {
      toast.error(`Failed to update ${table} status`)
    } else {
      toast.success(`${table} status updated successfully`)
      fetchRequests()
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Returns and Refunds</h1>
      
      <h2 className="text-xl font-semibold mt-6 mb-2">Return Requests</h2>
      {returnRequests.map((request) => (
        <div key={request.id} className="border p-4 mb-4 rounded-lg">
          <p>Order ID: {request.order_id}</p>
          <p>Reason: {request.reason}</p>
          <p>Status: {request.status}</p>
          <p>Date: {new Date(request.created_at).toLocaleDateString()}</p>
          <div className="mt-2 space-x-2">
            <Button onClick={() => handleUpdateStatus('return_requests', request.id, 'approved')}>
              Approve
            </Button>
            <Button onClick={() => handleUpdateStatus('return_requests', request.id, 'rejected')}>
              Reject
            </Button>
          </div>
        </div>
      ))}

      <h2 className="text-xl font-semibold mt-6 mb-2">Refund Requests</h2>
      {refundRequests.map((request) => (
        <div key={request.id} className="border p-4 mb-4 rounded-lg">
          <p>Order ID: {request.order_id}</p>
          <p>Reason: {request.reason}</p>
          <p>Amount: ${request.amount?.toFixed(2)}</p>
          <p>Status: {request.status}</p>
          <p>Date: {new Date(request.created_at).toLocaleDateString()}</p>
          <div className="mt-2 space-x-2">
            <Button onClick={() => handleUpdateStatus('refund_requests', request.id, 'approved')}>
              Approve
            </Button>
            <Button onClick={() => handleUpdateStatus('refund_requests', request.id, 'rejected')}>
              Reject
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

