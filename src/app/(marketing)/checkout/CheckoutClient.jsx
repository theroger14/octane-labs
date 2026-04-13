"use client"

import { useState } from "react"
import Link from "next/link"
import { useCart } from "@/context/CartContext"
import { createOrder } from "@/app/actions/orders"
import { calculateShipping, SHIPPING_THRESHOLD } from "@/lib/shipping"
import { supabase } from "@/lib/supabase"
import AddressForm, { EMPTY_ADDRESS, validateAddress } from "@/components/AddressForm"

const fmt = n => `$${Number(n).toLocaleString("es-MX")}`

// ─── Address selection card ───────────────────────────────────────────────────
function AddressCard({ addr, selected, onSelect }) {
  return (
    <div
      onClick={() => onSelect(addr.id)}
      style={{
        border: `2px solid ${selected ? "#F97316" : "#E2E8F0"}`,
        borderRadius: "14px",
        padding: "1rem 1.25rem",
        cursor: "pointer",
        background: selected ? "#FFF7ED" : "#F8FAFC",
        transition: "border-color 0.2s, background 0.2s",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem" }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: "700", fontSize: "0.9rem", color: "#0F172A", margin: "0 0 0.3rem", display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            {addr.recipient_name}
            {addr.is_default && (
              <span style={{ background: "#F97316", color: "#fff", fontSize: "0.65rem", fontWeight: "700", padding: "0.1rem 0.5rem", borderRadius: "999px" }}>
                Principal
              </span>
            )}
          </p>
          <p style={{ fontSize: "0.82rem", color: "#64748B", margin: "0 0 0.15rem", lineHeight: "1.5" }}>
            {addr.street} #{addr.exterior_number}{addr.interior_number ? ` Int. ${addr.interior_number}` : ""}
          </p>
          <p style={{ fontSize: "0.82rem", color: "#64748B", margin: 0, lineHeight: "1.5" }}>
            {addr.neighborhood}, {addr.city}, {addr.state} C.P. {addr.postal_code}
          </p>
          {addr.phone && (
            <p style={{ fontSize: "0.8rem", color: "#94A3B8", margin: "0.2rem 0 0" }}>
              Tel: {addr.phone}
            </p>
          )}
        </div>
        {/* Radio indicator */}
        <div style={{
          width: "20px", height: "20px", borderRadius: "50%", flexShrink: 0,
          border: `2px solid ${selected ? "#F97316" : "#CBD5E1"}`,
          background: selected ? "#F97316" : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginTop: "2px",
        }}>
          {selected && <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#fff" }} />}
        </div>
      </div>
    </div>
  )
}

// ─── Main checkout client ──────────────────────────────────────────────────────
export default function CheckoutClient({ user, savedAddresses }) {
  const { items, totalPrice, clearCart } = useCart()

  const subtotal = totalPrice
  const shipping  = calculateShipping(subtotal)
  const total     = subtotal + shipping
  const freeShippingPct = Math.min((subtotal / SHIPPING_THRESHOLD) * 100, 100)

  // Address state
  const defaultAddr = savedAddresses.find(a => a.is_default) || savedAddresses[0]
  const [selectedId,  setSelectedId]  = useState(defaultAddr?.id || null)
  const [showNewForm, setShowNewForm] = useState(savedAddresses.length === 0)
  const [newAddr,     setNewAddr]     = useState(EMPTY_ADDRESS)
  const [formErrors,  setFormErrors]  = useState({})
  const [cpLoading,   setCpLoading]   = useState(false)

  // Submit state
  const [submitting,   setSubmitting]  = useState(false)
  const [submitError,  setSubmitError] = useState("")
  const [orderDone,    setOrderDone]   = useState(null)

  function handleAddrChange(field, value) {
    setNewAddr(prev => ({ ...prev, [field]: value }))
    if (formErrors[field]) setFormErrors(prev => { const n = { ...prev }; delete n[field]; return n })
  }

  function handleCpLookup({ state, city, neighborhood }) {
    setNewAddr(prev => ({
      ...prev,
      state:        state        || prev.state,
      city:         city         || prev.city,
      neighborhood: neighborhood || prev.neighborhood,
    }))
  }

  async function saveNewAddress() {
    const errors = validateAddress(newAddr)
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return null
    }
    setFormErrors({})

    if (newAddr.is_default) {
      await supabase
        .from("shipping_addresses")
        .update({ is_default: false })
        .eq("user_id", user.id)
    }

    const { data, error } = await supabase
      .from("shipping_addresses")
      .insert({ ...newAddr, user_id: user.id })
      .select()
      .single()

    if (error) {
      setFormErrors({ _general: error.message })
      return null
    }
    return data
  }

  async function handleSubmit() {
    if (items.length === 0) return
    setSubmitting(true)
    setSubmitError("")

    let addressId       = selectedId
    let addressSnapshot = null

    if (showNewForm) {
      const saved = await saveNewAddress()
      if (!saved) { setSubmitting(false); return }
      addressId       = saved.id
      addressSnapshot = saved
    } else {
      addressSnapshot = savedAddresses.find(a => a.id === selectedId) || null
    }

    if (!addressId) {
      setSubmitError("Selecciona o agrega una dirección de envío")
      setSubmitting(false)
      return
    }

    const result = await createOrder({ items, addressId, addressSnapshot, notes: null })

    if (result.error) {
      setSubmitError(result.error)
      setSubmitting(false)
      return
    }

    clearCart()
    setOrderDone(result.order)
  }

  // ── Success screen ─────────────────────────────────────────────────────────
  if (orderDone) {
    return (
      <div style={{
        minHeight: "100vh", background: "#F8FAFC",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "2rem 1.5rem", fontFamily: "'Outfit', sans-serif",
      }}>
        <div style={{ maxWidth: "520px", width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: "4rem", marginBottom: "1.25rem" }}>✅</div>
          <h1 style={{ fontWeight: "800", fontSize: "1.75rem", color: "#0F172A", marginBottom: "0.75rem", letterSpacing: "-0.02em" }}>
            ¡Pedido recibido!
          </h1>
          <p style={{ color: "#64748B", fontSize: "1rem", marginBottom: "0.375rem" }}>
            Tu pedido{" "}
            <strong style={{ color: "#0F172A", fontFamily: "'Roboto Mono', monospace" }}>
              {orderDone.order_number}
            </strong>{" "}
            ha sido registrado.
          </p>
          <p style={{ color: "#64748B", fontSize: "0.875rem", marginBottom: "2.5rem" }}>
            Te contactaremos al email <strong style={{ color: "#0F172A" }}>{user.email}</strong> con los detalles del pago.
          </p>
          <div style={{ display: "flex", gap: "0.875rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/account/orders" style={{
              background: "#F97316", color: "#fff", fontWeight: "700",
              padding: "0.875rem 1.75rem", borderRadius: "12px",
              textDecoration: "none", boxShadow: "0 4px 14px rgba(249,115,22,0.3)",
              fontFamily: "'Outfit', sans-serif", fontSize: "0.95rem",
            }}>
              Ver mis pedidos
            </Link>
            <Link href="/shop" style={{
              background: "#fff", color: "#0F172A", fontWeight: "600",
              padding: "0.875rem 1.75rem", borderRadius: "12px",
              textDecoration: "none", border: "1px solid #E2E8F0",
              fontFamily: "'Outfit', sans-serif", fontSize: "0.95rem",
            }}>
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ── Empty cart ─────────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div style={{
        minHeight: "100vh", background: "#F8FAFC",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "2rem 1.5rem", fontFamily: "'Outfit', sans-serif",
      }}>
        <div style={{ maxWidth: "400px", width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: "3.5rem", marginBottom: "1.25rem" }}>🛒</div>
          <h1 style={{ fontWeight: "800", fontSize: "1.5rem", color: "#0F172A", marginBottom: "0.625rem" }}>
            Tu carrito está vacío
          </h1>
          <p style={{ color: "#64748B", marginBottom: "2rem", fontSize: "0.9rem" }}>
            Agrega productos desde la tienda antes de continuar.
          </p>
          <Link href="/shop" style={{
            background: "#F97316", color: "#fff", fontWeight: "700",
            padding: "0.875rem 1.75rem", borderRadius: "12px",
            textDecoration: "none", fontFamily: "'Outfit', sans-serif",
            boxShadow: "0 4px 14px rgba(249,115,22,0.3)",
          }}>
            Ir a la tienda
          </Link>
        </div>
      </div>
    )
  }

  // ── Main checkout ──────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        .checkout-grid { display: grid; grid-template-columns: 1fr 380px; gap: 2rem; align-items: start; }
        .checkout-sticky { position: sticky; top: 88px; }
        @media (max-width: 900px) {
          .checkout-grid { grid-template-columns: 1fr !important; }
          .checkout-sticky { position: static !important; }
        }
      `}</style>

      <section style={{
        minHeight: "100vh",
        background: "#F8FAFC",
        padding: "7rem 1.5rem 5rem",
        fontFamily: "'Outfit', sans-serif",
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

          {/* Header */}
          <div style={{ marginBottom: "2.5rem" }}>
            <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.15em", color: "#F97316", textTransform: "uppercase", marginBottom: "0.5rem" }}>
              // Checkout
            </div>
            <h1 style={{ fontWeight: "800", fontSize: "clamp(1.75rem, 3.5vw, 2.25rem)", color: "#0F172A", letterSpacing: "-0.02em", margin: 0 }}>
              Finalizar compra
            </h1>
          </div>

          <div className="checkout-grid">

            {/* LEFT ── Shipping address */}
            <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid #E2E8F0", padding: "2rem" }}>
              <h2 style={{ fontWeight: "700", fontSize: "1.1rem", color: "#0F172A", margin: "0 0 1.5rem" }}>
                Dirección de envío
              </h2>

              {/* Saved address cards */}
              {savedAddresses.length > 0 && !showNewForm && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem", marginBottom: "1.25rem" }}>
                  {savedAddresses.map(addr => (
                    <AddressCard
                      key={addr.id}
                      addr={addr}
                      selected={selectedId === addr.id}
                      onSelect={setSelectedId}
                    />
                  ))}
                </div>
              )}

              {/* Toggle new form button */}
              {savedAddresses.length > 0 && (
                <button
                  onClick={() => {
                    setShowNewForm(!showNewForm)
                    setFormErrors({})
                    setNewAddr(EMPTY_ADDRESS)
                  }}
                  style={{
                    width: "100%",
                    padding: "0.875rem",
                    border: `2px dashed ${showNewForm ? "#F97316" : "#CBD5E1"}`,
                    borderRadius: "14px",
                    background: "transparent",
                    color: showNewForm ? "#F97316" : "#64748B",
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: "600",
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    marginBottom: showNewForm ? "1.75rem" : 0,
                    transition: "border-color 0.2s, color 0.2s",
                  }}
                >
                  {showNewForm ? "← Usar dirección guardada" : "+ Agregar nueva dirección"}
                </button>
              )}

              {/* New address form */}
              {showNewForm && (
                <AddressForm
                  values={newAddr}
                  errors={formErrors}
                  onChange={handleAddrChange}
                  onCpLookup={handleCpLookup}
                  cpLoading={cpLoading}
                />
              )}
            </div>

            {/* RIGHT ── Order summary */}
            <div className="checkout-sticky">
              <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid #E2E8F0", padding: "2rem" }}>
                <h2 style={{ fontWeight: "700", fontSize: "1.1rem", color: "#0F172A", margin: "0 0 1.5rem" }}>
                  Resumen del pedido
                </h2>

                {/* Items list */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem", marginBottom: "1.5rem" }}>
                  {items.map(item => (
                    <div key={item.id} style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                      <div style={{ width: "48px", height: "48px", borderRadius: "8px", background: "#F1F5F9", flexShrink: 0, overflow: "hidden" }}>
                        {item.image_url
                          ? <img src={item.image_url} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem" }}>📦</div>
                        }
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: "600", fontSize: "0.825rem", color: "#0F172A", margin: "0 0 0.1rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {item.name}
                        </p>
                        <p style={{ fontSize: "0.75rem", color: "#94A3B8", margin: 0 }}>
                          Cant. {item.qty}
                        </p>
                      </div>
                      <span style={{ fontWeight: "700", fontSize: "0.875rem", color: "#0F172A", flexShrink: 0 }}>
                        {fmt((item.price || 0) * item.qty)}
                      </span>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: "1px solid #E2E8F0", paddingTop: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>

                  {/* Subtotal */}
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", color: "#64748B" }}>
                    <span>Subtotal</span>
                    <span>{fmt(subtotal)}</span>
                  </div>

                  {/* Shipping */}
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                    <span style={{ color: "#64748B" }}>Envío</span>
                    <span style={{ fontWeight: "600", color: shipping === 0 ? "#16A34A" : "#0F172A" }}>
                      {shipping === 0 ? "Gratis 🎉" : fmt(shipping)}
                    </span>
                  </div>

                  {/* Free shipping progress */}
                  {shipping > 0 && (
                    <div style={{ background: "#F8FAFC", borderRadius: "12px", padding: "0.875rem" }}>
                      <p style={{ fontSize: "0.75rem", color: "#64748B", margin: "0 0 0.625rem", lineHeight: "1.5" }}>
                        Agrega{" "}
                        <strong style={{ color: "#0F172A" }}>{fmt(SHIPPING_THRESHOLD - subtotal)}</strong>
                        {" "}más y obtén envío gratis
                      </p>
                      <div style={{ height: "6px", background: "#E2E8F0", borderRadius: "999px", overflow: "hidden" }}>
                        <div style={{
                          height: "100%",
                          borderRadius: "999px",
                          background: "linear-gradient(90deg, #F97316, #FB923C)",
                          width: `${freeShippingPct}%`,
                          transition: "width 0.4s ease",
                        }} />
                      </div>
                    </div>
                  )}

                  {/* Total */}
                  <div style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    borderTop: "1px solid #E2E8F0", paddingTop: "0.875rem", marginTop: "0.25rem",
                  }}>
                    <span style={{ fontWeight: "700", fontSize: "1rem", color: "#0F172A" }}>Total</span>
                    <span style={{ fontWeight: "800", fontSize: "1.35rem", color: "#0F172A" }}>{fmt(total)}</span>
                  </div>
                </div>

                {/* Error */}
                {submitError && (
                  <div style={{
                    background: "#FFF1F2", border: "1px solid #FECDD3",
                    borderRadius: "10px", padding: "0.875rem 1rem",
                    fontSize: "0.875rem", color: "#BE123C", marginTop: "1.25rem",
                  }}>
                    {submitError}
                  </div>
                )}

                {/* CTA */}
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  style={{
                    width: "100%",
                    marginTop: "1.5rem",
                    background: submitting ? "#FDA472" : "#F97316",
                    color: "#fff",
                    border: "none",
                    borderRadius: "12px",
                    padding: "1rem",
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: "700",
                    fontSize: "1rem",
                    cursor: submitting ? "not-allowed" : "pointer",
                    boxShadow: "0 4px 14px rgba(249,115,22,0.3)",
                    transition: "background 0.2s",
                  }}
                >
                  {submitting ? "Procesando..." : "Confirmar pedido →"}
                </button>

                <p style={{ fontSize: "0.72rem", color: "#94A3B8", textAlign: "center", marginTop: "0.875rem", lineHeight: "1.5" }}>
                  Al confirmar, nuestro equipo te contactará con los detalles del pago. Solo enviamos dentro de México.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
