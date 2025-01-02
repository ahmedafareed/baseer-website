import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function validateCoupon(code: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('is_coupon_valid', { coupon_code: code })
  if (error) {
    console.error('Error validating coupon:', error)
    return false
  }
  return data
}

export async function getCouponDiscount(code: string): Promise<number> {
  const { data, error } = await supabase.rpc('get_coupon_discount', { coupon_code: code })
  if (error) {
    console.error('Error getting coupon discount:', error)
    return 0
  }
  return data
}

export function applyDiscount(price: number, discountPercentage: number): number {
  const discountAmount = price * (discountPercentage / 100)
  return Math.max(0, price - discountAmount)
}

