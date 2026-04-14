import { createSupabaseServer } from "@/lib/supabaseServer"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"

export async function generateMetadata({ params }) {
  return { title: `Pedido | Octane Labs` }
}

const STATUS_LABELS = {
  pending:   { label: "Pendiente",   bg: "#FFF7ED", color: "#C2410C" },
  paid:      { label: "Pagado",      bg: "#F0FDF4", color: "#15803D" },
  printing:  { label: "Imprimiendo", bg: "#EFF6FF", color: "#1D4ED8" },
  shipped:   { label: "Enviado",     bg: "#F5F3FF", color: "#6D28D9" },
  delivered: { label: "Entregado",   bg: "#F0FDF4", color: "#15803D" },
  cancelled: { label: "Cancelado",   bg: "#FFF1F2", color: "#BE123C" },
}

function StatusBadge({ status }) {
  const s = STATUS_LABELS[status] || { label: status, bg: "#F1F5F9", color: "#64748B" }
  return (
    <span style={{
      background: s.bg, color: s.color,
      fontFamily: "'Outfit', sans-serif", fontWeight: "700",
      fontSize: "0.8rem", padding: "0.25rem 0.875rem",
      borderRadius: "999px",
    }}>
      {s.label}
    </span>
  )
}

const fmt     = n  => `$${Number(n).toLocaleString("es-MX")}`
const fmtDate = ts => new Date(ts).toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })

export default async function OrderDetailPage({ params }) {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login?redirect=/account/orders")

  const { data: order } = await supabase
    .from("orders")
    .select(`*, order_items (*)`)
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single()

  if (!order) notFound()

  const addr = order.shipping_address_snapshot

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif" }}>

      {/* Back link */}
      <Link href="/account/orders" style={{
        display: "inline-flex", alignItems: "center", gap: "0.375rem",
        fontSize: "0.875rem", color: "#64748B", textDecoration: "none",
        marginBottom: "1.75rem",
        fontWeight: "500",
      }}>
        ← Volver a mis pedidos
      </Link>

      <div style={{ display: "grid", gridTemplateColumns: "1fr min(360px, 100%)", gap: "1.5rem", alignItems: "start" }} className="order-detail-grid">

        {/* LEFT: Items + address */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          {/* Order items */}
          <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid #E2E8F0", padding: "1.75rem" }}>
            <h2 style={{ fontWeight: "700", fontSize: "1rem", color: "#0F172A", margin: "0 0 1.25rem" }}>
              Productos
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {order.order_items.map((item, i) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "0.875rem 0",
                    borderTop: i > 0 ? "1px solid #F1F5F9" : "none",
                    gap: "1rem",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: "600", fontSize: "0.9rem", color: "#0F172A", margin: "0 0 0.15rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {item.name}
                    </p>
                    {item.description && (
                      <p style={{ fontSize: "0.78rem", color: "#94A3B8", margin: 0 }}>{item.description}</p>
                    )}
                    <p style={{ fontSize: "0.8rem", color: "#64748B", margin: "0.1rem 0 0" }}>
                      {fmt(item.unit_price)} × {item.quantity}
                    </p>
                  </div>
                  <span style={{ fontWeight: "700", fontSize: "0.9rem", color: "#0F172A", flexShrink: 0 }}>
                    {fmt(item.subtotal)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping address */}
          {addr && (
            <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid #E2E8F0", padding: "1.75rem" }}>
              <h2 style={{ fontWeight: "700", fontSize: "1rem", color: "#0F172A", margin: "0 0 1rem" }}>
                Dirección de entrega
              </h2>
              <p style={{ fontWeight: "600", fontSize: "0.9rem", color: "#0F172A", margin: "0 0 0.25rem" }}>
                {addr.recipient_name}
              </p>
              <p style={{ fontSize: "0.85rem", color: "#64748B", margin: "0 0 0.15rem", lineHeight: "1.6" }}>
                {addr.street} #{addr.exterior_number}
                {addr.interior_number ? ` Int. ${addr.interior_number}` : ""}
              </p>
              <p style={{ fontSize: "0.85rem", color: "#64748B", margin: "0 0 0.15rem", lineHeight: "1.6" }}>
                {addr.neighborhood}, {addr.city}, {addr.state}
              </p>
              <p style={{ fontSize: "0.85rem", color: "#64748B", margin: 0 }}>
                C.P. {addr.postal_code}
              </p>
              {addr.phone && (
                <p style={{ fontSize: "0.82rem", color: "#94A3B8", margin: "0.375rem 0 0" }}>
                  Tel: {addr.phone}
                </p>
              )}
              {addr.references && (
                <p style={{ fontSize: "0.8rem", color: "#94A3B8", margin: "0.375rem 0 0", fontStyle: "italic" }}>
                  Ref: {addr.references}
                </p>
              )}
            </div>
          )}
        </div>

        {/* RIGHT: Order summary */}
        <div className="order-detail-sticky" style={{ position: "sticky", top: "88px" }}>
          <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid #E2E8F0", padding: "1.75rem" }}>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
              <div>
                <p style={{ fontFamily: "'Roboto Mono', monospace", fontWeight: "700", fontSize: "0.95rem", color: "#0F172A", margin: "0 0 0.25rem" }}>
                  {order.order_number}
                </p>
                <p style={{ fontSize: "0.78rem", color: "#94A3B8", margin: 0 }}>
                  {fmtDate(order.created_at)}
                </p>
              </div>
              <StatusBadge status={order.status} />
            </div>

            <div style={{ borderTop: "1px solid #E2E8F0", paddingTop: "1.25rem", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              <Row label="Subtotal" value={fmt(order.subtotal)} />
              <Row
                label="Envío"
                value={order.shipping_cost === 0 ? "Gratis" : fmt(order.shipping_cost)}
                valueColor={order.shipping_cost === 0 ? "#16A34A" : undefined}
              />
              <div style={{ borderTop: "1px solid #E2E8F0", paddingTop: "0.75rem", marginTop: "0.25rem" }}>
                <Row label="Total" value={fmt(order.total)} bold />
              </div>
            </div>

            {order.notes && (
              <div style={{ marginTop: "1.25rem", background: "#F8FAFC", borderRadius: "10px", padding: "0.875rem" }}>
                <p style={{ fontSize: "0.78rem", fontWeight: "600", color: "#64748B", margin: "0 0 0.25rem" }}>
                  Notas
                </p>
                <p style={{ fontSize: "0.85rem", color: "#475569", margin: 0, lineHeight: "1.6" }}>
                  {order.notes}
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .order-detail-grid { grid-template-columns: 1fr !important; }
          .order-detail-sticky { position: static !important; }
        }
      `}</style>
    </div>
  )
}

function Row({ label, value, bold, valueColor }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
      <span style={{ color: "#64748B", fontWeight: bold ? "700" : "400" }}>{label}</span>
      <span style={{ fontWeight: bold ? "800" : "600", fontSize: bold ? "1.1rem" : "0.875rem", color: valueColor || "#0F172A" }}>
        {value}
      </span>
    </div>
  )
}
