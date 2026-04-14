"use server"

import { createSupabaseServer } from "@/lib/supabaseServer"
import { calculateShipping } from "@/lib/shipping"

export async function createOrder({ items, addressId, addressSnapshot, notes }) {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: "No autenticado. Inicia sesión para continuar." }
  }

  const subtotal = items.reduce((s, i) => s + (i.price || 0) * i.qty, 0)
  const shipping_cost = calculateShipping(subtotal)
  const total = subtotal + shipping_cost

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      shipping_address_id: addressId,
      shipping_address_snapshot: addressSnapshot,
      subtotal,
      shipping_cost,
      total,
      customer_email: user.email,
      notes: notes || null,
    })
    .select()
    .single()

  if (orderError) {
    return { error: orderError.message }
  }

  const orderItems = items.map(item => ({
    order_id: order.id,
    product_id: item.id || null,
    name: item.name,
    description: item.description || null,
    unit_price: item.price || 0,
    quantity: item.qty,
    subtotal: (item.price || 0) * item.qty,
  }))

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems)

  if (itemsError) {
    return { error: itemsError.message }
  }

  return { order }
}
