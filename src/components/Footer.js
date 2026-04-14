"use client"

import Link from "next/link"

const links = [
  ["Tienda",   "/shop"],
  ["FAQ",      "/faq"],
  ["Contacto", "/contact"],
  ["Cotizar",  "/quote"],
]

export default function Footer() {
  return (
    <footer style={{ background: "#0F172A", padding: "3.5rem 1.5rem 2rem" }}>
      <div style={{
        maxWidth: "1200px", margin: "0 auto",
        display: "flex", justifyContent: "space-between",
        alignItems: "center", flexWrap: "wrap", gap: "1.5rem",
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "28px", height: "28px", background: "#F97316", borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontWeight: "900", fontSize: "0.85rem", fontFamily: "'Outfit', sans-serif" }}>O</span>
          </div>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "700", fontSize: "1rem", color: "#fff" }}>
            Octane<span style={{ color: "#F97316" }}>Lab</span>
          </span>
        </Link>

        {/* Copyright */}
        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.8rem", color: "#475569" }}>
          © {new Date().getFullYear()} Octane Lab · Morelia, Michoacán, México
        </span>

        {/* Nav links */}
        <nav style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
          {links.map(([label, href]) => (
            <Link key={href} href={href}
              style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.8rem", color: "#475569", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.color = "#F97316"}
              onMouseLeave={e => e.currentTarget.style.color = "#475569"}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
