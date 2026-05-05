import Link from "next/link"

export const metadata = { title: "Pago cancelado | Octane Labs" }

export default async function CancelledPage({ searchParams }) {
  const { order_id } = await searchParams

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
      <div style={{ maxWidth: "480px", width: "100%", textAlign: "center" }}>

        {/* Icon */}
        <div style={{
          width: "72px", height: "72px",
          background: "#FFF1F2",
          borderRadius: "50%",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          marginBottom: "1.5rem",
          border: "1px solid #FECDD3",
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="#BE123C" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </div>

        <h1 style={{ fontWeight: "800", fontSize: "clamp(1.5rem, 3.5vw, 2rem)", color: "#0F172A", letterSpacing: "-0.02em", margin: "0 0 1rem" }}>
          Pago cancelado
        </h1>

        <p style={{ color: "#64748B", fontSize: "1rem", lineHeight: "1.7", margin: "0 0 0.75rem" }}>
          Tu pago fue cancelado. Tu pedido sigue guardado, puedes intentar de nuevo.
        </p>

        {order_id && (
          <p style={{ color: "#94A3B8", fontSize: "0.78rem", marginBottom: "2.5rem", fontFamily: "'Roboto Mono', monospace" }}>
            Pedido: {order_id.slice(0, 8).toUpperCase()}...
          </p>
        )}

        {!order_id && <div style={{ marginBottom: "2.5rem" }} />}

        <div style={{ display: "flex", gap: "0.875rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/checkout" style={{
            background: "#F97316", color: "#fff",
            fontWeight: "700", padding: "0.875rem 1.75rem",
            borderRadius: "12px", textDecoration: "none",
            boxShadow: "0 4px 14px rgba(249,115,22,0.3)",
            fontFamily: "'Outfit', sans-serif", fontSize: "0.95rem",
          }}>
            Reintentar pago
          </Link>
          <Link href="/account/orders" style={{
            background: "#fff", color: "#0F172A",
            fontWeight: "600", padding: "0.875rem 1.75rem",
            borderRadius: "12px", textDecoration: "none",
            border: "1px solid #E2E8F0",
            fontFamily: "'Outfit', sans-serif", fontSize: "0.95rem",
          }}>
            Ver mis pedidos
          </Link>
        </div>

      </div>
    </section>
  )
}
