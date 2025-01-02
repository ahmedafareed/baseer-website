import { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Header from '@/components/Header'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Order Confirmation - Baseer Smart Glasses',
  description: 'Thank you for your order of Baseer Smart Glasses.',
}

export default function OrderConfirmationPage() {
  return (
    <>
      <Header onOpenAuth={() => {}}>
        <div className="max-w-4xl mx-auto p-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Thank You for Your Order!</h1>
          <p className="mb-4">Your order has been successfully placed.</p>
          <p className="mb-4">Order Number: #123456</p>
          <p className="mb-8">Estimated delivery: 3-5 business days</p>
          <p className="mb-4">We've sent a confirmation email with the order details to your registered email address.</p>
          <Link href="/" passHref>
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </Header>
      <Footer />
    </>
  )
}

