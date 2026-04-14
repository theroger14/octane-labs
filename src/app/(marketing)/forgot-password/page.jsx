"use client"

import { useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

export default function ForgotPasswordPage() {
  const [email,   setEmail]   = useState("")
  const [loading, setLoading] = useState(false)
  const [sent,    setSent]    = useState(false)
  const [error,   setError]   = useState("")
  const [focused, setFocused] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/account/reset-password`,
    })

    if (error) {
      setError("Ocurrió un error. Verifica tu email e intenta de nuevo.")
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#F8FAFC",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "5rem 1.5rem 2rem", fontFamily: "'Outfit', sans-serif",
    }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <Link href="/" style={{ textDecoration: "none", display: "inline-block", marginBottom: "1rem" }}>
            <span style={{ fontWeight: "800", fontSize: "1.5rem", color: "#1E293B", letterSpacing: "-0.02em" }}>
              Octane<span style={{ color: "#F97316" }}>Lab</span>
            </span>
          </Link>
        </div>

        <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid #E2E8F0", padding: "2rem", boxShadow: "0 4px 24px rgba(15,23,42,0.06)" }}>

          {sent ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ width: "56px", height: "56px", background: "#F0FDF4", border: "2px solid #BBF7D0", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#16A34A" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h1 style={{ fontWeight: "700", fontSize: "1.2rem", color: "#0F172A", marginBottom: "0.75rem" }}>
                Revisa tu correo
              </h1>
              <p style={{ fontSize: "0.9rem", color: "#64748B", lineHeight: "1.7", marginBottom: "1.5rem" }}>
                Enviamos un enlace para restablecer tu contraseña a{" "}
                <strong style={{ color: "#0F172A" }}>{email}</strong>.
              </p>
              <Link href="/login" style={{ color: "#F97316", fontWeight: "600", fontSize: "0.9rem", textDecoration: "none" }}>
                ← Volver a iniciar sesión
              </Link>
            </div>
          ) : (
            <>
              <h1 style={{ fontWeight: "700", fontSize: "1.25rem", color: "#0F172A", margin: "0 0 0.5rem" }}>
                Recuperar contraseña
              </h1>
              <p style={{ fontSize: "0.875rem", color: "#64748B", marginBottom: "1.5rem" }}>
                Ingresa tu email y te enviamos un enlace para crear una nueva contraseña.
              </p>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "#374151", marginBottom: "0.45rem" }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    required
                    style={{
                      width: "100%", boxSizing: "border-box",
                      border: `1.5px solid ${focused ? "#F97316" : "#E2E8F0"}`,
                      borderRadius: "10px", padding: "0.75rem 0.9rem",
                      fontSize: "0.9rem", fontFamily: "'Outfit', sans-serif",
                      color: "#0F172A", outline: "none", background: "#fff", transition: "border-color 0.2s",
                    }}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                  />
                </div>

                {error && (
                  <div style={{ background: "#FFF1F2", border: "1px solid #FECDD3", borderRadius: "10px", padding: "0.875rem 1rem", fontSize: "0.875rem", color: "#BE123C" }}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%", background: loading ? "#FDA472" : "#F97316",
                    color: "#fff", border: "none", borderRadius: "10px",
                    padding: "0.875rem", fontSize: "0.95rem", fontWeight: "700",
                    fontFamily: "'Outfit', sans-serif", cursor: loading ? "not-allowed" : "pointer",
                    boxShadow: "0 4px 14px rgba(249,115,22,0.3)", transition: "background 0.2s",
                  }}
                >
                  {loading ? "Enviando..." : "Enviar enlace de recuperación"}
                </button>
              </form>
            </>
          )}
        </div>

        <p style={{ textAlign: "center", fontSize: "0.875rem", color: "#64748B", marginTop: "1.5rem" }}>
          <Link href="/login" style={{ color: "#F97316", fontWeight: "600", textDecoration: "none" }}>
            ← Volver a iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
