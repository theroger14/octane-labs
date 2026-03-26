"use client"

import { useCart } from "@/context/CartContext"
import Link from "next/link"

export default function CartDrawer() {
  const { items, totalItems, totalPrice, removeItem, setQty, clearCart, drawerOpen, setDrawerOpen } = useCart()

  const fmt = (n) => `$${Number(n).toLocaleString("es-MX")}`

  return (
    <>
      {/* Backdrop */}
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200 }}
        />
      )}

      {/* Drawer */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 201,
        width: "min(420px, 100vw)",
        background: "#fff",
        boxShadow: "-4px 0 32px rgba(0,0,0,0.12)",
        display: "flex", flexDirection: "column",
        transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.3s ease",
      }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 1.5rem", borderBottom: "1px solid #E2E8F0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "700", fontSize: "1.1rem", color: "#0F172A" }}>
              Carrito
            </span>
            {totalItems > 0 && (
              <span style={{ background: "#F97316", color: "#fff", fontFamily: "'Outfit', sans-serif", fontWeight: "700", fontSize: "0.7rem", borderRadius: "999px", padding: "0.15rem 0.5rem" }}>
                {totalItems}
              </span>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {items.length > 0 && (
              <button
                onClick={clearCart}
                style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.75rem", color: "#94A3B8", background: "none", border: "none", cursor: "pointer" }}
              >
                Vaciar
              </button>
            )}
            <button
              onClick={() => setDrawerOpen(false)}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.25rem", color: "#64748B", lineHeight: 1 }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1rem 1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          {items.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "1rem", color: "#94A3B8" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.9rem", textAlign: "center" }}>
                Tu carrito está vacío.<br />Agrega productos desde la tienda.
              </p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} style={{ display: "flex", gap: "0.875rem", alignItems: "flex-start", padding: "0.875rem", background: "#F8FAFC", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
                {/* Image */}
                <div style={{ width: "60px", height: "60px", borderRadius: "8px", overflow: "hidden", background: "#E2E8F0", flexShrink: 0 }}>
                  {item.image_url
                    ? <img src={item.image_url} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>📦</div>
                  }
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "600", fontSize: "0.875rem", color: "#0F172A", marginBottom: "0.25rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {item.name}
                  </p>
                  <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.8rem", color: "#F97316", fontWeight: "600", marginBottom: "0.5rem" }}>
                    {item.price ? fmt(item.price) : "Consultar"}
                  </p>

                  {/* Qty controls */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <button
                      onClick={() => item.qty === 1 ? removeItem(item.id) : setQty(item.id, item.qty - 1)}
                      style={{ width: "24px", height: "24px", borderRadius: "6px", border: "1px solid #E2E8F0", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", color: "#64748B" }}
                    >
                      −
                    </button>
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "600", fontSize: "0.875rem", color: "#0F172A", minWidth: "20px", textAlign: "center" }}>
                      {item.qty}
                    </span>
                    <button
                      onClick={() => setQty(item.id, item.qty + 1)}
                      style={{ width: "24px", height: "24px", borderRadius: "6px", border: "1px solid #E2E8F0", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", color: "#64748B" }}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Subtotal + remove */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem", flexShrink: 0 }}>
                  {item.price && (
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "700", fontSize: "0.875rem", color: "#0F172A" }}>
                      {fmt(item.price * item.qty)}
                    </span>
                  )}
                  <button
                    onClick={() => removeItem(item.id)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#CBD5E1", fontSize: "0.8rem" }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: "1.25rem 1.5rem", borderTop: "1px solid #E2E8F0", display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.875rem", color: "#64748B" }}>Total ({totalItems} {totalItems === 1 ? "pieza" : "piezas"})</span>
              <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "800", fontSize: "1.15rem", color: "#0F172A" }}>
                {totalPrice > 0 ? fmt(totalPrice) : "A consultar"}
              </span>
            </div>
            <Link
              href="/quote"
              onClick={() => setDrawerOpen(false)}
              style={{
                display: "block", textAlign: "center",
                fontFamily: "'Outfit', sans-serif", fontWeight: "700", fontSize: "0.95rem",
                background: "#F97316", color: "#fff", padding: "0.875rem",
                borderRadius: "12px", textDecoration: "none",
                boxShadow: "0 4px 14px rgba(249,115,22,0.3)",
              }}
            >
              Cotizar pedido →
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
