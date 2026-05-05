import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { stripe } from '@/lib/stripe'

// App Router does NOT auto-parse the body, so request.text() gives us
// the raw payload needed for Stripe signature verification.

export async function POST(request) {
  const rawBody = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error('[webhook] Signature verification failed:', err.message)
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 })
  }

  // Use service role to bypass RLS for order status updates
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  try {
    switch (event.type) {

      case 'checkout.session.completed': {
        const session = event.data.object
        const orderId = session.metadata?.order_id
        if (!orderId) break

        await admin
          .from('orders')
          .update({
            status: 'paid',
            stripe_session_id: session.id,
            stripe_payment_intent: typeof session.payment_intent === 'string'
              ? session.payment_intent
              : null,
            paid_at: new Date().toISOString(),
          })
          .eq('id', orderId)
        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object
        const orderId = session.metadata?.order_id
        if (!orderId) break

        await admin
          .from('orders')
          .update({
            status: 'cancelled',
            stripe_session_id: session.id,
          })
          .eq('id', orderId)
        break
      }

      case 'payment_intent.payment_failed': {
        // Stripe propagates Checkout Session metadata to the PaymentIntent
        const paymentIntent = event.data.object
        const orderId = paymentIntent.metadata?.order_id
        if (!orderId) break

        await admin
          .from('orders')
          .update({ status: 'payment_failed' })
          .eq('id', orderId)
        break
      }

      default:
        // Unhandled event — acknowledge receipt
        break
    }
  } catch (err) {
    console.error('[webhook] Handler error:', err)
    return NextResponse.json({ error: 'Internal handler error' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
