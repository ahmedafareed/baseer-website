import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  
  try {
    const { formData, items } = await req.json()

    if (!formData || !items) {
      return NextResponse.json(
        { success: false, message: 'Missing required data' },
        { status: 400 }
      )
    }

    // Generate a random order number
    const orderNumber = Math.floor(100000 + Math.random() * 900000)

    // Calculate total price
    const totalPrice = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)

    // Store order in database
    const { error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        total_price: totalPrice,
        status: 'processing',
        shipping_address: `${formData.address}, ${formData.city}, ${formData.country}, ${formData.zipCode}`,
      })

    if (orderError) {
      console.error('Order insertion error:', orderError)
      return NextResponse.json(
        { success: false, message: 'Failed to create order' },
        { status: 500 }
      )
    }

    // Generate invoice email content
    const invoiceContent = `
      Order Confirmation #${orderNumber}
      
      Dear ${formData.name},

      Thank you for your order. Your order details are as follows:

      Order Number: ${orderNumber}
      Total: $${totalPrice.toFixed(2)}

      Items:
      ${items.map((item: any) => `${item.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`).join('\n')}

      Shipping Address:
      ${formData.address}
      ${formData.city}, ${formData.country} ${formData.zipCode}

      Estimated Delivery: 3-5 business days

      Thank you for shopping with us!
    `

    // Instead of sending an email, we'll log it to the console
    console.log('Order confirmation email:')
    console.log(invoiceContent)

    // In a real-world scenario, you would send an actual email here
    console.log(`Email sent to: ${formData.email}`)

    return NextResponse.json({ 
      success: true, 
      orderId: orderNumber,
      message: 'Order placed successfully' 
    })

  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred', error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

