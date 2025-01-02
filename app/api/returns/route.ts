import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { orderId, reason } = await req.json()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check if the order is eligible for return
  const { data: isEligible, error: eligibilityError } = await supabase
    .rpc('is_order_eligible_for_return_or_refund', { order_id: orderId })

  if (eligibilityError) {
    return NextResponse.json({ error: 'Failed to check eligibility' }, { status: 500 })
  }

  if (!isEligible) {
    return NextResponse.json({ error: 'Order is not eligible for return' }, { status: 400 })
  }

  // Create return request
  const { data, error } = await supabase
    .from('return_requests')
    .insert({
      order_id: orderId,
      user_id: user.id,
      reason: reason
    })
    .select()

  if (error) {
    return NextResponse.json({ error: 'Failed to create return request' }, { status: 500 })
  }

  return NextResponse.json({ success: true, data })
}

