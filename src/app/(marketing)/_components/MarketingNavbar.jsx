"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useCart } from "@/context/CartContext"
import { useWishlist } from "@/context/WishlistContext"
import { supabase } from "@/lib/supabase"

const navLinks = [
  ["Tienda",    "/shop"],
  ["Servicios", "/#servicios"],
  ["Proceso",   "/#proceso"],
  ["Portfolio", "/#portfolio"],
  ["FAQ",       "/faq"],
  ["Contacto",  "/contact"],
]

export default function MarketingNavbar() {
  const [scrolled,    setScrolled]    = useState(false)
  const [menuOpen,    setMenuOpen]    = useState(false)
  const [user,        setUser]        = useState(undefined)   // undefined = loading
  const [acctOpen,    setAcctOpen]    = useState(false)
  const acctRef = useRef(null)
  const { totalItems, setDrawerOpen } = useCart()
  const { count: wishlistCount } = useWishlist()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 48)
    window.addEventListener("scroll", fn)
    return () => window.removeEventListener("scroll", fn)
  }, [])

  // Auth state
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Close account dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (acctRef.current && !acctRef.current.contains(e.target)) setAcctOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
    setAcctOpen(false)
    setUser(null)
  }

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .ol-desktop-nav { display: none !important; }
          .ol-mobile-btn  { display: flex !important; }
        }
      `}</style>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0)",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid #E2E8F0" : "1px solid transparent",
        transition: "all 0.35s ease",
        padding: "0 1.5rem",
      }}>
        <div style={{
          maxWidth: "1200px", margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          height: "68px",
        }}>
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>
            <img src="/images/hero/Logo.png" alt="Octane Lab logo" style={{ width: "32px", height: "32px", objectFit: "contain" }} />
            <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "700", fontSize: "1.15rem", color: "#1E293B", letterSpacing: "-0.01em" }}>
              Octane<span style={{ color: "#F97316" }}>Lab</span>
            </span>
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: "2rem" }} className="ol-desktop-nav">
            {navLinks.map(([label, href]) => (
              <Link key={label} href={href}
                style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.9rem", fontWeight: "500", color: "#64748B", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#1E293B"}
                onMouseLeave={(e) => e.currentTarget.style.color = "#64748B"}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="ol-desktop-nav" style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {/* Cart button */}
            <button
              onClick={() => setDrawerOpen(true)}
              style={{ position: "relative", background: "none", border: "none", cursor: "pointer", padding: "6px", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748B" }}
              aria-label="Carrito"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              {totalItems > 0 && (
                <span style={{ position: "absolute", top: "0px", right: "0px", background: "#F97316", color: "#fff", fontFamily: "'Outfit', sans-serif", fontWeight: "700", fontSize: "0.6rem", borderRadius: "999px", minWidth: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 3px" }}>
                  {totalItems}
                </span>
              )}
            </button>

            {/* Account / Login */}
            {user === null && (
              <Link href="/login" style={{
                fontFamily: "'Outfit', sans-serif", fontSize: "0.875rem", fontWeight: "600",
                color: "#475569", background: "transparent", padding: "0.55rem 1rem", borderRadius: "8px",
                textDecoration: "none", border: "1px solid #E2E8F0",
              }}>
                Iniciar sesión
              </Link>
            )}
            {user && (
              <div ref={acctRef} style={{ position: "relative" }}>
                <button
                  onClick={() => setAcctOpen(!acctOpen)}
                  style={{
                    display: "flex", alignItems: "center", gap: "0.375rem",
                    fontFamily: "'Outfit', sans-serif", fontSize: "0.875rem", fontWeight: "600",
                    color: "#475569", background: "#F1F5F9", padding: "0.5rem 0.875rem",
                    borderRadius: "8px", border: "none", cursor: "pointer", position: "relative",
                  }}
                >
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  Mi cuenta
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                  {wishlistCount > 0 && (
                    <span style={{
                      position: "absolute", top: "-4px", right: "-4px",
                      background: "#E11D48", color: "#fff",
                      fontFamily: "'Outfit', sans-serif", fontWeight: "700",
                      fontSize: "0.6rem", borderRadius: "999px",
                      minWidth: "16px", height: "16px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      padding: "0 3px", border: "2px solid #fff",
                    }}>
                      {wishlistCount}
                    </span>
                  )}
                </button>

                {acctOpen && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 8px)", right: 0,
                    background: "#fff", borderRadius: "14px", border: "1px solid #E2E8F0",
                    boxShadow: "0 8px 24px rgba(15,23,42,0.1)", padding: "0.5rem",
                    minWidth: "180px", zIndex: 300,
                  }}>
                    {[
                      { href: "/account/orders",    label: "Mis pedidos" },
                      { href: "/account/addresses", label: "Mis direcciones" },
                      { href: "/account/wishlist",  label: "Favoritos" },
                    ].map(({ href, label }) => (
                      <Link key={href} href={href} onClick={() => setAcctOpen(false)}
                        style={{
                          display: "block", padding: "0.6rem 0.875rem",
                          fontFamily: "'Outfit', sans-serif", fontSize: "0.875rem",
                          fontWeight: "500", color: "#374151", textDecoration: "none",
                          borderRadius: "8px", transition: "background 0.15s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "#F8FAFC"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        {label}
                      </Link>
                    ))}
                    <div style={{ borderTop: "1px solid #F1F5F9", margin: "0.375rem 0" }} />
                    <button
                      onClick={handleSignOut}
                      style={{
                        display: "block", width: "100%", textAlign: "left",
                        padding: "0.6rem 0.875rem",
                        fontFamily: "'Outfit', sans-serif", fontSize: "0.875rem",
                        fontWeight: "500", color: "#BE123C", background: "none",
                        border: "none", cursor: "pointer", borderRadius: "8px",
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = "#FFF1F2"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            )}

            <Link href="/quote" style={{
              fontFamily: "'Outfit', sans-serif", fontSize: "0.875rem", fontWeight: "600",
              color: "#fff", background: "#F97316", padding: "0.55rem 1.25rem", borderRadius: "8px",
              textDecoration: "none", transition: "background 0.2s, transform 0.15s",
              boxShadow: "0 1px 3px rgba(249,115,22,0.35)",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#EA6C0A"; e.currentTarget.style.transform = "translateY(-1px)" }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#F97316"; e.currentTarget.style.transform = "translateY(0)" }}
            >
              Cotizar gratis
            </Link>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="ol-mobile-btn"
            style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: "4px", flexDirection: "column", gap: "5px" }}
            aria-label="Menú">
            {[0, 1, 2].map((i) => (
              <span key={i} style={{ display: "block", width: "22px", height: "2px", background: "#1E293B", borderRadius: "2px" }} />
            ))}
          </button>
        </div>

        {menuOpen && (
          <div style={{ background: "#fff", borderTop: "1px solid #E2E8F0", padding: "1.25rem 1.5rem 1.75rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            {navLinks.map(([label, href]) => (
              <Link key={label} href={href} onClick={() => setMenuOpen(false)}
                style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1rem", fontWeight: "500", color: "#475569", textDecoration: "none" }}>
                {label}
              </Link>
            ))}
            <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: "0.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {user ? (
                <>
                  <Link href="/account/orders" onClick={() => setMenuOpen(false)}
                    style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.95rem", fontWeight: "500", color: "#475569", textDecoration: "none" }}>
                    Mis pedidos
                  </Link>
                  <Link href="/account/addresses" onClick={() => setMenuOpen(false)}
                    style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.95rem", fontWeight: "500", color: "#475569", textDecoration: "none" }}>
                    Mis direcciones
                  </Link>
                  <Link href="/account/wishlist" onClick={() => setMenuOpen(false)}
                    style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.95rem", fontWeight: "500", color: "#475569", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.375rem" }}>
                    Favoritos
                    {wishlistCount > 0 && (
                      <span style={{ background: "#E11D48", color: "#fff", fontFamily: "'Outfit', sans-serif", fontWeight: "700", fontSize: "0.6rem", borderRadius: "999px", minWidth: "16px", height: "16px", display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0 3px" }}>
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                  <button onClick={() => { handleSignOut(); setMenuOpen(false) }}
                    style={{ background: "none", border: "none", padding: 0, fontFamily: "'Outfit', sans-serif", fontSize: "0.95rem", fontWeight: "500", color: "#BE123C", textAlign: "left", cursor: "pointer" }}>
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <Link href="/login" onClick={() => setMenuOpen(false)}
                  style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.95rem", fontWeight: "500", color: "#475569", textDecoration: "none" }}>
                  Iniciar sesión
                </Link>
              )}
            </div>
            <Link href="/quote" onClick={() => setMenuOpen(false)}
              style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "600", fontSize: "0.95rem", background: "#F97316", color: "#fff", padding: "0.8rem 1.2rem", borderRadius: "10px", textAlign: "center", textDecoration: "none" }}>
              Cotizar gratis
            </Link>
          </div>
        )}
      </nav>
    </>
  )
}
