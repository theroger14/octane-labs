"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const tabs = [
  { href: "/account/orders",    label: "Mis pedidos" },
  { href: "/account/addresses", label: "Direcciones" },
  { href: "/account/wishlist",  label: "Favoritos" },
]

export default function AccountTabs() {
  const pathname = usePathname()

  return (
    <div style={{ display: "flex", gap: "0.25rem", marginBottom: "2rem", borderBottom: "1px solid #E2E8F0" }}>
      {tabs.map(({ href, label }) => {
        const active = pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: active ? "700" : "500",
              fontSize: "0.9rem",
              color: active ? "#F97316" : "#64748B",
              textDecoration: "none",
              padding: "0.625rem 1.125rem",
              borderBottom: active ? "2px solid #F97316" : "2px solid transparent",
              marginBottom: "-1px",
              transition: "color 0.2s, border-color 0.2s",
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </Link>
        )
      })}
    </div>
  )
}
