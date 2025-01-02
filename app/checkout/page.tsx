import { Suspense } from 'react'
import CheckoutContent from './CheckoutContent'

export default function CheckoutPage({ 
  searchParams 
}: { 
  searchParams: { [key: string]: string | string[] | undefined } 
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutContent discount={searchParams.discount as string} />
    </Suspense>
  )
}

