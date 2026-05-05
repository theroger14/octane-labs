import { NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabaseServer'
import { stripe } from '@/lib/stripe'
import { calculateShipping } from '@/lib/shipping'

export async function POST(request) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const { items, shipping_address_id } = await request.json()

    if (!items?.length) {
      return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 })
    }
    if (!shipping_address_id) {
      return NextResponse.json({ error: 'Se requiere dirección de envío' }, { status: 400 })
    }

    // ── Verify real prices from DB — never trust client ──────────────
    const productIds = items.map(i => i.id).filter(Boolean)
    const { data: products, error: prodError } = await supabase
      .from('products')
      .select('id, name, description, price, image_url')
      .in('id', productIds)

    if (prodError) {
      return NextResponse.json({ error: 'Error al verificar productos' }, { status: 500 })
    }

    const productMap = Object.fromEntries((products || []).map(p => [p.id, p]))

    const verifiedItems = []
    for (const item of items) {
      const product = productMap[item.id]
      if (!product) {
        return NextResponse.json(
          { error: `Producto no encontrado: ${item.id}` },
          { status: 400 }
        )
      }
      verifiedItems.push({
        id: product.id,
        name: product.name,
        description: product.description || null,
        price: Number(product.price),
        image_url: product.image_url || null,
        qty: Number(item.qty),
      })
    }

    // ── Verify shipping address belongs to user ───────────────────────
    const { data: address } = await supabase
      .from('shipping_addresses')
      .select('*')
      .eq('id', shipping_address_id)
      .eq('user_id', user.id)
      .single()

    if (!address) {
      return NextResponse.json({ error: 'Dirección no encontrada' }, { status: 400 })
    }

    // ── Compute totals ────────────────────────────────────────────────
    const subtotal = verifiedItems.reduce((s, i) => s + i.price * i.qty, 0)
    const shippingCost = calculateShipping(subtotal)
    const total = subtotal + shippingCost

    // ── Create pending order in Supabase BEFORE Stripe session ────────
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        shipping_address_id: shipping_address_id,
        shipping_address_snapshot: address,
        subtotal,
        shipping_cost: shippingCost,
        total,
        status: 'pending',
        customer_email: user.email,
      })
      .select()
      .single()

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 500 })
    }

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(
        verifiedItems.map(item => ({
          order_id: order.id,
          product_id: item.id,
          name: item.name,
          description: item.description,
          unit_price: item.price,
          quantity: item.qty,
          subtotal: item.price * item.qty,
        }))
      )

    if (itemsError) {
      return NextResponse.json({ error: itemsError.message }, { status: 500 })
    }

    // ── Build Stripe line items ────────────────────────────────────────
    const host = request.headers.get('host') || 'localhost:3000'
    const proto = host.includes('localhost') ? 'http' : 'https'
    const origin = `${proto}://${host}`

    const lineItems = verifiedItems.map(item => ({
      price_data: {
        currency: 'mxn',
        product_data: {
          name: item.name,
          ...(item.description && { description: item.description }),
          ...(item.image_url && { images: [item.image_url] }),
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.qty,
    }))

    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: 'mxn',
          product_data: { name: 'Envío estándar' },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      })
    }

    // ── Create Stripe Checkout Session ────────────────────────────────
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
      cancel_url: `${origin}/checkout/cancelled?order_id=${order.id}`,
      customer_email: user.email,
      locale: 'es',
      allow_promotion_codes: false,
      payment_method_options: {
        card: {
          request_three_d_secure: 'automatic',
        },
      },
      metadata: {
        order_id: order.id,
        user_id: user.id,
      },
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (err) {
    console.error('[api/stripe/checkout]', err)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
