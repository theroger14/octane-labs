import { NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabaseServer'
import { stripe } from '@/lib/stripe'

export async function POST(request) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const { order_id } = await request.json()

    if (!order_id) {
      return NextResponse.json({ error: 'order_id requerido' }, { status: 400 })
    }

    // Fetch order with items — must belong to this user
    const { data: order } = await supabase
      .from('orders')
      .select('*, order_items (*)')
      .eq('id', order_id)
      .eq('user_id', user.id)
      .single()

    if (!order) {
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })
    }

    if (order.status !== 'pending' && order.status !== 'payment_failed') {
      return NextResponse.json(
        { error: 'Este pedido no está pendiente de pago' },
        { status: 400 }
      )
    }

    const host = request.headers.get('host') || 'localhost:3000'
    const proto = host.includes('localhost') ? 'http' : 'https'
    const origin = `${proto}://${host}`

    const lineItems = order.order_items.map(item => ({
      price_data: {
        currency: 'mxn',
        product_data: {
          name: item.name,
          ...(item.description && { description: item.description }),
        },
        unit_amount: Math.round(Number(item.unit_price) * 100),
      },
      quantity: item.quantity,
    }))

    if (Number(order.shipping_cost) > 0) {
      lineItems.push({
        price_data: {
          currency: 'mxn',
          product_data: { name: 'Envío estándar' },
          unit_amount: Math.round(Number(order.shipping_cost) * 100),
        },
        quantity: 1,
      })
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
      cancel_url: `${origin}/checkout/cancelled?order_id=${order.id}`,
      customer_email: user.email,
      locale: 'es',
      metadata: {
        order_id: order.id,
        user_id: user.id,
      },
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (err) {
    console.error('[api/stripe/resume]', err)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
