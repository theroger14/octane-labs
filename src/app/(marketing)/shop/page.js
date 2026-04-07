import { supabase } from "@/lib/supabase"
import ShopGrid from "@/components/ShopGrid"
import Link from "next/link"

export const revalidate = 60

export const metadata = { title: "Tienda | Octane Labs" }

export default async function ShopPage() {
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("available", true)
    .order("created_at", { ascending: false })

  return (
    <section style={{ background: "#F8FAFC", padding: "8rem 1.5rem 7rem", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3.5rem", flexWrap: "wrap", gap: "1.5rem" }}>
          <div>
            <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.15em", color: "#F97316", textTransform: "uppercase", marginBottom: "0.75rem" }}>
              // Tienda
            </div>
            <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "800", fontSize: "clamp(2rem, 4vw, 2.75rem)", color: "#0F172A", letterSpacing: "-0.02em", marginBottom: "0.5rem" }}>
              Piezas listas para encargar
            </h1>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1rem", color: "#64748B" }}>
              También puedes traer tu propio diseño.
            </p>
          </div>
          <Link href="/quote" style={{
            fontFamily: "'Outfit', sans-serif", fontWeight: "600", fontSize: "0.875rem",
            color: "#fff", background: "#F97316", padding: "0.7rem 1.5rem", borderRadius: "10px",
            textDecoration: "none", boxShadow: "0 2px 8px rgba(249,115,22,0.3)", whiteSpace: "nowrap",
          }}>
            Subir mi STL →
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: "#FFF1F2", border: "1px solid #FECDD3", borderRadius: "12px", padding: "0.875rem 1.25rem", marginBottom: "2rem", fontFamily: "'Outfit', sans-serif", fontSize: "0.875rem", color: "#BE123C" }}>
            Error al cargar productos: {error.message}
          </div>
        )}

        {/* Empty state */}
        {!error && (!products || products.length === 0) && (
          <div style={{
            textAlign: "center", padding: "5rem 2rem",
            background: "#fff", border: "1px solid #E2E8F0", borderRadius: "24px",
            boxShadow: "0 4px 24px rgba(15,23,42,0.04)",
          }}>
            <div style={{ fontSize: "3.5rem", marginBottom: "1.25rem" }}>🖨️</div>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "700", fontSize: "1.2rem", color: "#0F172A", marginBottom: "0.5rem" }}>
              Próximamente
            </p>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.9rem", color: "#64748B", maxWidth: "380px", margin: "0 auto 1.75rem", lineHeight: "1.7" }}>
              Estamos preparando el catálogo. Mientras tanto, sube tu propio archivo y recibe un presupuesto en horas.
            </p>
            <Link href="/quote" style={{
              display: "inline-block",
              fontFamily: "'Outfit', sans-serif", fontWeight: "700", fontSize: "0.95rem",
              background: "#F97316", color: "#fff", padding: "0.85rem 2rem",
              borderRadius: "12px", textDecoration: "none",
              boxShadow: "0 4px 14px rgba(249,115,22,0.35)",
            }}>
              Cotizar mi proyecto →
            </Link>
          </div>
        )}

        {/* Product grid */}
        {products && products.length > 0 && (
          <div style={{ background: "#fff", borderRadius: "20px", padding: "2rem", border: "1px solid #E2E8F0" }}>
            <ShopGrid products={products} />
          </div>
        )}
      </div>
    </section>
  )
}
