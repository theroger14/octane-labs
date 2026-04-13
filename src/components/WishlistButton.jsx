"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useWishlist } from "@/context/WishlistContext"

export default function WishlistButton({ productId, size = 20 }) {
  const { isInWishlist, toggle, isLoggedIn } = useWishlist()
  const [toast, setToast]   = useState("")
  const [busy,  setBusy]    = useState(false)
  const router = useRouter()

  const active = isInWishlist(productId)

  async function handleClick(e) {
    e.preventDefault()
    e.stopPropagation()

    if (!isLoggedIn) {
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`)
      return
    }

    if (busy) return
    setBusy(true)
    const added = await toggle(productId)
    setBusy(false)

    const msg = added ? "Agregado a favoritos" : "Eliminado de favoritos"
    setToast(msg)
    setTimeout(() => setToast(""), 2200)
  }

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={handleClick}
        aria-label={active ? "Quitar de favoritos" : "Agregar a favoritos"}
        title={active ? "Quitar de favoritos" : "Agregar a favoritos"}
        style={{
          background: active ? "#FFF1F2" : "rgba(255,255,255,0.9)",
          border: `1.5px solid ${active ? "#FECDD3" : "#E2E8F0"}`,
          borderRadius: "50%",
          width: `${size + 16}px`,
          height: `${size + 16}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: busy ? "wait" : "pointer",
          transition: "all 0.2s",
          padding: 0,
          flexShrink: 0,
        }}
        onMouseEnter={e => {
          if (!active) e.currentTarget.style.borderColor = "#FECDD3"
        }}
        onMouseLeave={e => {
          if (!active) e.currentTarget.style.borderColor = "#E2E8F0"
        }}
      >
        {active ? (
          // Filled heart
          <svg width={size} height={size} viewBox="0 0 24 24" fill="#E11D48">
            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
          </svg>
        ) : (
          // Outline heart
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        )}
      </button>

      {/* Toast notification */}
      {toast && (
        <div style={{
          position: "absolute",
          bottom: "calc(100% + 8px)",
          left: "50%",
          transform: "translateX(-50%)",
          background: "#0F172A",
          color: "#fff",
          fontFamily: "'Outfit', sans-serif",
          fontSize: "0.75rem",
          fontWeight: "600",
          padding: "0.375rem 0.75rem",
          borderRadius: "8px",
          whiteSpace: "nowrap",
          pointerEvents: "none",
          zIndex: 50,
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        }}>
          {toast}
        </div>
      )}
    </div>
  )
}
