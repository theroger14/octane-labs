"use client"

import { useState } from "react"

export default function PayNowButton({ orderId }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleClick(e) {
    e.preventDefault()
    e.stopPropagation()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/stripe/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Error al procesar el pago")
        setLoading(false)
        return
      }

      window.location.href = data.url
    } catch {
      setError("Error de red. Intenta de nuevo.")
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        style={{
          background: loading ? "#FDA472" : "#F97316",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          padding: "0.4rem 0.9rem",
          fontFamily: "'Outfit', sans-serif",
          fontWeight: "700",
          fontSize: "0.8rem",
          cursor: loading ? "not-allowed" : "pointer",
          transition: "background 0.2s",
          whiteSpace: "nowrap",
        }}
      >
        {loading ? "Procesando..." : "Pagar ahora →"}
      </button>
      {error && (
        <p style={{ fontSize: "0.72rem", color: "#BE123C", margin: "0.25rem 0 0", textAlign: "left" }}>
          {error}
        </p>
      )}
    </div>
  )
}
