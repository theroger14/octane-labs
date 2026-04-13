import { createSupabaseServer } from "@/lib/supabaseServer"
import { redirect } from "next/navigation"
import AccountTabs from "./AccountTabs"

export default async function AccountLayout({ children }) {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?redirect=/account/orders")
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#F8FAFC",
      padding: "7rem 1.5rem 5rem",
      fontFamily: "'Outfit', sans-serif",
    }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.15em", color: "#F97316", textTransform: "uppercase", marginBottom: "0.5rem" }}>
            // Mi cuenta
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h1 style={{ fontWeight: "800", fontSize: "clamp(1.75rem, 3.5vw, 2.25rem)", color: "#0F172A", letterSpacing: "-0.02em", margin: 0 }}>
                Mi cuenta
              </h1>
              <p style={{ color: "#64748B", fontSize: "0.875rem", margin: "0.375rem 0 0" }}>
                {user.email}
              </p>
            </div>
          </div>
        </div>

        {/* Tab nav */}
        <AccountTabs />

        {children}
      </div>
    </div>
  )
}
