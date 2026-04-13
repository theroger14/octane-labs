"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

const inputStyle = (focused) => ({
  width: "100%",
  boxSizing: "border-box",
  border: `1.5px solid ${focused ? "#F97316" : "#E2E8F0"}`,
  borderRadius: "10px",
  padding: "0.75rem 0.9rem",
  fontSize: "0.9rem",
  fontFamily: "'Outfit', sans-serif",
  color: "#0F172A",
  outline: "none",
  background: "#fff",
  transition: "border-color 0.2s",
})

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

export default function LoginClient() {
  const [email,    setEmail]    = useState("")
  const [password, setPassword] = useState("")
  const [error,    setError]    = useState("")
  const [loading,  setLoading]  = useState(false)
  const [oauthLoading, setOauthLoading] = useState(false)
  const [focused,  setFocused]  = useState("")
  const router       = useRouter()
  const searchParams = useSearchParams()

  const redirectTo = searchParams.get("redirect") || "/"
  const oauthError = searchParams.get("error") === "oauth_error"

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError("Email o contraseña incorrectos")
      setLoading(false)
      return
    }

    router.push(redirectTo)
    router.refresh()
  }

  async function handleGoogle() {
    setOauthLoading(true)
    setError("")
    const callbackUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: callbackUrl },
    })
    if (error) {
      setError("No se pudo iniciar sesión con Google. Intenta de nuevo.")
      setOauthLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#F8FAFC",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "5rem 1.5rem 2rem",
      fontFamily: "'Outfit', sans-serif",
    }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <Link href="/" style={{ textDecoration: "none", display: "inline-block", marginBottom: "1rem" }}>
            <span style={{ fontWeight: "800", fontSize: "1.5rem", color: "#1E293B", letterSpacing: "-0.02em" }}>
              Octane<span style={{ color: "#F97316" }}>Lab</span>
            </span>
          </Link>
          <p style={{ fontSize: "0.875rem", color: "#64748B", margin: 0 }}>
            Inicia sesión para continuar
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "#fff",
          borderRadius: "20px",
          border: "1px solid #E2E8F0",
          padding: "2rem",
          boxShadow: "0 4px 24px rgba(15,23,42,0.06)",
        }}>
          <h1 style={{ fontWeight: "700", fontSize: "1.25rem", color: "#0F172A", margin: "0 0 1.5rem" }}>
            Iniciar sesión
          </h1>

          {oauthError && (
            <div style={{ background: "#FFF1F2", border: "1px solid #FECDD3", borderRadius: "10px", padding: "0.875rem 1rem", fontSize: "0.875rem", color: "#BE123C", marginBottom: "1.25rem" }}>
              No se pudo iniciar sesión con Google. Intenta de nuevo.
            </div>
          )}

          {/* Google button */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={oauthLoading || loading}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.625rem",
              background: "#fff", border: "1.5px solid #E2E8F0", borderRadius: "10px",
              padding: "0.75rem", fontFamily: "'Outfit', sans-serif", fontWeight: "600",
              fontSize: "0.9rem", color: "#374151", cursor: oauthLoading ? "not-allowed" : "pointer",
              transition: "border-color 0.2s, background 0.2s", marginBottom: "1.25rem",
            }}
            onMouseEnter={e => { if (!oauthLoading) e.currentTarget.style.borderColor = "#CBD5E1" }}
            onMouseLeave={e => e.currentTarget.style.borderColor = "#E2E8F0"}
          >
            <GoogleIcon />
            {oauthLoading ? "Redirigiendo..." : "Continuar con Google"}
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
            <div style={{ flex: 1, height: "1px", background: "#E2E8F0" }} />
            <span style={{ fontSize: "0.75rem", color: "#94A3B8", fontWeight: "500" }}>o con email</span>
            <div style={{ flex: 1, height: "1px", background: "#E2E8F0" }} />
          </div>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
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
                style={inputStyle(focused === "email")}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused("")}
              />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.45rem" }}>
                <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "#374151" }}>
                  Contraseña
                </label>
                <Link href="/forgot-password" style={{ fontSize: "0.75rem", color: "#F97316", textDecoration: "none", fontWeight: "500" }}>
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={inputStyle(focused === "password")}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused("")}
              />
            </div>

            {error && (
              <div style={{ background: "#FFF1F2", border: "1px solid #FECDD3", borderRadius: "10px", padding: "0.875rem 1rem", fontSize: "0.875rem", color: "#BE123C" }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || oauthLoading}
              style={{
                width: "100%", background: loading ? "#FDA472" : "#F97316",
                color: "#fff", border: "none", borderRadius: "10px",
                padding: "0.875rem", fontSize: "0.95rem", fontWeight: "700",
                fontFamily: "'Outfit', sans-serif",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 4px 14px rgba(249,115,22,0.3)", transition: "background 0.2s",
                marginTop: "0.25rem",
              }}
            >
              {loading ? "Entrando..." : "Iniciar sesión"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", fontSize: "0.875rem", color: "#64748B", marginTop: "1.5rem" }}>
          ¿No tienes cuenta?{" "}
          <Link href={`/signup${redirectTo !== "/" ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}
            style={{ color: "#F97316", fontWeight: "600", textDecoration: "none" }}>
            Crear cuenta
          </Link>
        </p>

      </div>
    </div>
  )
}
