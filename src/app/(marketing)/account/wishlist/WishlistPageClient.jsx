"use client"

import Link from "next/link"
import { useCart } from "@/context/CartContext"
import WishlistButton from "@/components/WishlistButton"

const fmt = price => `$${Number(price).toLocaleString("es-MX")}`

function WishlistCard({ product }) {
  const { addItem } = useCart()
  const { id, name, description, price, image_url } = product

  return (
    <div style={{
      background: "#fff",
      border: "1px solid #E2E8F0",
      borderRadius: "16px",
      padding: "1.25rem",
      display: "flex",
      gap: "1.25rem",
      alignItems: "flex-start",
      transition: "border-color 0.2s, box-shadow 0.2s",
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "#F97316"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(249,115,22,0.08)" }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.boxShadow = "none" }}
    >
      {/* Image */}
      <Link href={`/shop/${id}`} style={{ textDecoration: "none", flexShrink: 0 }}>
        <div style={{
          width: "88px", height: "88px", borderRadius: "12px",
          background: "#F1F5F9", overflow: "hidden",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {image_url ? (
            <img src={image_url} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#CBD5E1" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
            </svg>
          )}
        </div>
      </Link>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <Link href={`/shop/${id}`} style={{ textDecoration: "none" }}>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "700", fontSize: "0.95rem", color: "#0F172A", marginBottom: "0.25rem", lineHeight: "1.3" }}>
            {name}
          </p>
        </Link>
        {description && (
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.8rem", color: "#94A3B8", lineHeight: "1.5", marginBottom: "0.75rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {description}
          </p>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "800", fontSize: "1rem", color: "#0F172A" }}>
            {price ? fmt(price) : "Consultar precio"}
          </span>
          {price && (
            <button
              onClick={() => addItem({ id, name, price, image_url })}
              style={{
                fontFamily: "'Outfit', sans-serif", fontWeight: "600", fontSize: "0.8rem",
                background: "#F97316", color: "#fff", border: "none",
                padding: "0.4rem 0.9rem", borderRadius: "8px", cursor: "pointer",
                transition: "background 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#EA6C0A"}
              onMouseLeave={e => e.currentTarget.style.background = "#F97316"}
            >
              + Agregar al carrito
            </button>
          )}
        </div>
      </div>

      {/* Remove from wishlist */}
      <div style={{ flexShrink: 0 }}>
        <WishlistButton productId={id} size={16} />
      </div>
    </div>
  )
}

export default function WishlistPageClient({ products: initialProducts }) {
  return (
    <div>
      {initialProducts.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "4rem 2rem",
          background: "#fff", borderRadius: "20px", border: "1px solid #E2E8F0",
        }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🤍</div>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "700", fontSize: "1.1rem", color: "#0F172A", marginBottom: "0.5rem" }}>
            Tu lista de favoritos está vacía
          </p>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.875rem", color: "#64748B", marginBottom: "1.75rem" }}>
            Guarda productos que te interesen para encontrarlos fácilmente.
          </p>
          <Link href="/shop" style={{
            background: "#F97316", color: "#fff",
            fontFamily: "'Outfit', sans-serif", fontWeight: "700", fontSize: "0.9rem",
            padding: "0.7rem 1.5rem", borderRadius: "10px",
            textDecoration: "none", boxShadow: "0 4px 12px rgba(249,115,22,0.25)",
          }}>
            Explorar tienda →
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.875rem", color: "#64748B", marginBottom: "0.5rem" }}>
            {initialProducts.length} {initialProducts.length === 1 ? "producto guardado" : "productos guardados"}
          </p>
          {initialProducts.map(product => (
            <WishlistCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
