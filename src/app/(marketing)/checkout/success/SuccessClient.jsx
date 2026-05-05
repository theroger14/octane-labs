"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useCart } from "@/context/CartContext"

const fmt = n => `$${Number(n).toLocaleString("es-MX")}`

export default function SuccessClient({ order, userEmail }) {
  const { clearCart } = useCart()

  // Clear cart once — Stripe confirmed the payment
  useEffect(() => {
    clearCart()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const addr = order?.shipping_address_snapshot

  return (
    <section style={{
      minHeight: "80vh",
      background: "#F8FAFC",
      padding: "7rem 1.5rem 5rem",
      fontFamily: "'Outfit', sans-serif",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div style={{ maxWidth: "620px", width: "100%" }}>

        {/* Big checkmark */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            width: "80px", height: "80px",
            background: "linear-gradient(135deg, #22C55E, #16A34A)",
            borderRadius: "50%",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 8px 24px rgba(34,197,94,0.3)",
            marginBottom: "1.5rem",
          }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 style={{ fontWeight: "800", fontSize: "clamp(1.75rem, 4vw, 2.25rem)", color: "#0F172A", letterSpacing: "-0.02em", margin: "0 0 0.5rem" }}>
            ¡Gracias por tu compra!
          </h1>
          <p style={{ color: "#64748B", fontSize: "1rem", margin: 0 }}>
            Tu pago fue procesado exitosamente.
          </p>
        </div>

        {order && (
          <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid #E2E8F0", padding: "1.75rem", marginBottom: "1.5rem" }}>

            {/* Order number + total */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1.25rem", paddingBottom: "1.25rem", borderBottom: "1px solid #F1F5F9" }}>
              <div>
                <p style={{ fontSize: "0.72rem", color: "#94A3B8", margin: "0 0 0.2rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Número de pedido
                </p>
                <p style={{ fontFamily: "'Roboto Mono', monospace", fontWeight: "700", fontSize: "1.05rem", color: "#0F172A", margin: 0 }}>
                  {order.order_number}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: "0.72rem", color: "#94A3B8", margin: "0 0 0.2rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Total pagado
                </p>
                <p style={{ fontWeight: "800", fontSize: "1.35rem", color: "#0F172A", margin: 0 }}>
                  {fmt(order.total)}
                </p>
              </div>
            </div>

            {/* Items */}
            {order.order_items && order.order_items.length > 0 && (
              <div style={{ marginBottom: "1.25rem", paddingBottom: "1.25rem", borderBottom: "1px solid #F1F5F9" }}>
                <p style={{ fontSize: "0.72rem", color: "#94A3B8", margin: "0 0 0.75rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Productos
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {order.order_items.map(item => (
                    <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                      <span style={{ color: "#475569" }}>
                        {item.name}{item.quantity > 1 ? ` ×${item.quantity}` : ""}
                      </span>
                      <span style={{ fontWeight: "600", color: "#0F172A" }}>{fmt(item.subtotal)}</span>
                    </div>
                  ))}
                  {order.shipping_cost > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                      <span style={{ color: "#94A3B8" }}>Envío</span>
                      <span style={{ fontWeight: "600", color: "#0F172A" }}>{fmt(order.shipping_cost)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Shipping address */}
            {addr && (
              <div style={{ marginBottom: "1.25rem", paddingBottom: "1.25rem", borderBottom: "1px solid #F1F5F9" }}>
                <p style={{ fontSize: "0.72rem", color: "#94A3B8", margin: "0 0 0.75rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Dirección de entrega
                </p>
                <p style={{ fontSize: "0.875rem", color: "#475569", margin: 0, lineHeight: "1.75" }}>
                  {addr.recipient_name}<br />
                  {addr.street} #{addr.exterior_number}
                  {addr.interior_number ? ` Int. ${addr.interior_number}` : ""}<br />
                  {addr.neighborhood}, {addr.city}, {addr.state} C.P. {addr.postal_code}
                </p>
              </div>
            )}

            {/* Estimated delivery */}
            <div style={{ background: "#FFF7ED", borderRadius: "12px", padding: "0.875rem 1rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{ fontSize: "1.25rem" }}>🚚</span>
              <div>
                <p style={{ fontWeight: "700", fontSize: "0.875rem", color: "#C2410C", margin: "0 0 0.1rem" }}>
                  Tiempo estimado de entrega
                </p>
                <p style={{ fontSize: "0.8rem", color: "#92400E", margin: 0 }}>
                  5–10 días hábiles a partir de hoy
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation email note */}
        {userEmail && (
          <p style={{ textAlign: "center", fontSize: "0.82rem", color: "#94A3B8", marginBottom: "2rem", lineHeight: "1.6" }}>
            Enviamos una confirmación a{" "}
            <strong style={{ color: "#64748B" }}>{userEmail}</strong>
          </p>
        )}

        {/* CTAs */}
        <div style={{ display: "flex", gap: "0.875rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/account/orders" style={{
            background: "#F97316", color: "#fff",
            fontWeight: "700", padding: "0.875rem 1.75rem",
            borderRadius: "12px", textDecoration: "none",
            boxShadow: "0 4px 14px rgba(249,115,22,0.3)",
            fontFamily: "'Outfit', sans-serif", fontSize: "0.95rem",
          }}>
            Ver mis pedidos
          </Link>
          <Link href="/shop" style={{
            background: "#fff", color: "#0F172A",
            fontWeight: "600", padding: "0.875rem 1.75rem",
            borderRadius: "12px", textDecoration: "none",
            border: "1px solid #E2E8F0",
            fontFamily: "'Outfit', sans-serif", fontSize: "0.95rem",
          }}>
            Seguir comprando
          </Link>
        </div>

      </div>
    </section>
  )
}
