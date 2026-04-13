import { createSupabaseServer } from "@/lib/supabaseServer"
import { redirect } from "next/navigation"
import Link from "next/link"

export const metadata = { title: "Mis pedidos | Octane Labs" }

const STATUS_LABELS = {
  pending:   { label: "Pendiente",  bg: "#FFF7ED", color: "#C2410C" },
  paid:      { label: "Pagado",     bg: "#F0FDF4", color: "#15803D" },
  printing:  { label: "Imprimiendo",bg: "#EFF6FF", color: "#1D4ED8" },
  shipped:   { label: "Enviado",    bg: "#F5F3FF", color: "#6D28D9" },
  delivered: { label: "Entregado",  bg: "#F0FDF4", color: "#15803D" },
  cancelled: { label: "Cancelado",  bg: "#FFF1F2", color: "#BE123C" },
}

function StatusBadge({ status }) {
  const s = STATUS_LABELS[status] || { label: status, bg: "#F1F5F9", color: "#64748B" }
  return (
    <span style={{
      background: s.bg,
      color: s.color,
      fontFamily: "'Outfit', sans-serif",
      fontWeight: "700",
      fontSize: "0.72rem",
      padding: "0.2rem 0.625rem",
      borderRadius: "999px",
      letterSpacing: "0.01em",
      textTransform: "capitalize",
      whiteSpace: "nowrap",
    }}>
      {s.label}
    </span>
  )
}

const fmt     = n  => `$${Number(n).toLocaleString("es-MX")}`
const fmtDate = ts => new Date(ts).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" })

export default async function OrdersPage() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login?redirect=/account/orders")

  const { data: orders } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        id, name, quantity, unit_price, subtotal
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div>
      {/* Empty state */}
      {(!orders || orders.length === 0) && (
        <div style={{
          textAlign: "center",
          padding: "4rem 2rem",
          background: "#fff",
          borderRadius: "20px",
          border: "1px solid #E2E8F0",
        }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📦</div>
          <p style={{ fontWeight: "700", fontSize: "1.1rem", color: "#0F172A", marginBottom: "0.5rem" }}>
            Sin pedidos todavía
          </p>
          <p style={{ fontSize: "0.875rem", color: "#64748B", marginBottom: "1.75rem" }}>
            Cuando hagas un pedido aparecerá aquí.
          </p>
          <Link href="/shop" style={{
            background: "#F97316", color: "#fff",
            fontFamily: "'Outfit', sans-serif", fontWeight: "700", fontSize: "0.9rem",
            padding: "0.7rem 1.5rem", borderRadius: "10px",
            textDecoration: "none", boxShadow: "0 4px 12px rgba(249,115,22,0.25)",
          }}>
            Ir a la tienda
          </Link>
        </div>
      )}

      {/* Orders list */}
      {orders && orders.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {orders.map(order => (
            <Link
              key={order.id}
              href={`/account/orders/${order.id}`}
              style={{ textDecoration: "none" }}
            >
              <div style={{
                background: "#fff",
                border: "1px solid #E2E8F0",
                borderRadius: "16px",
                padding: "1.25rem 1.5rem",
                transition: "border-color 0.2s, box-shadow 0.2s",
                cursor: "pointer",
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "#F97316"
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(249,115,22,0.1)"
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "#E2E8F0"
                  e.currentTarget.style.boxShadow = "none"
                }}
              >
                {/* Order header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                  <div>
                    <p style={{ fontFamily: "'Roboto Mono', monospace", fontWeight: "700", fontSize: "0.875rem", color: "#0F172A", margin: "0 0 0.25rem" }}>
                      {order.order_number}
                    </p>
                    <p style={{ fontSize: "0.8rem", color: "#94A3B8", margin: 0 }}>
                      {fmtDate(order.created_at)}
                    </p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <StatusBadge status={order.status} />
                    <span style={{ fontWeight: "800", fontSize: "1.05rem", color: "#0F172A" }}>
                      {fmt(order.total)}
                    </span>
                  </div>
                </div>

                {/* Items preview */}
                {order.order_items && order.order_items.length > 0 && (
                  <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: "0.875rem" }}>
                    <p style={{ fontSize: "0.8rem", color: "#64748B", margin: "0 0 0.375rem" }}>
                      {order.order_items.length} {order.order_items.length === 1 ? "producto" : "productos"}:
                    </p>
                    <p style={{ fontSize: "0.82rem", color: "#475569", margin: 0, lineHeight: "1.6" }}>
                      {order.order_items.map(item =>
                        `${item.name}${item.quantity > 1 ? ` ×${item.quantity}` : ""}`
                      ).join(" · ")}
                    </p>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
