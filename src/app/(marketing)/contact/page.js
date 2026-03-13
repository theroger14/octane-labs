"use client"

import { useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

// ─── NAV + FOOTER (shared) ────────────────────────────────────────────────────
function PageNav() {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(16px)", borderBottom: "1px solid #E2E8F0", padding: "0 1.5rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "68px" }}>
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "32px", height: "32px", background: "#F97316", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontWeight: "900", fontSize: "1rem", fontFamily: "'Outfit', sans-serif" }}>O</span>
          </div>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "700", fontSize: "1.15rem", color: "#1E293B" }}>
            Octane<span style={{ color: "#F97316" }}>Lab</span>
          </span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "2.5rem" }} className="ol-desktop-nav">
          {[["Servicios", "/#servicios"], ["Proceso", "/#proceso"], ["Portfolio", "/#portfolio"], ["FAQ", "/faq"]].map(([l, h]) => (
            <Link key={l} href={h} style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.9rem", fontWeight: "500", color: "#64748B", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#1E293B"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#64748B"}
            >{l}</Link>
          ))}
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }} className="ol-desktop-nav">
          <Link href="/contact" style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.875rem", fontWeight: "600", color: "#F97316", textDecoration: "none", padding: "0.5rem 1rem" }}>
            Contacto
          </Link>
          <Link href="/quote" style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.875rem", fontWeight: "600", color: "#fff", background: "#F97316", padding: "0.55rem 1.25rem", borderRadius: "8px", textDecoration: "none", transition: "background 0.2s" }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#EA6C0A"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#F97316"}
          >Cotizar gratis</Link>
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} className="ol-mobile-btn"
          style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: "4px", flexDirection: "column", gap: "5px" }}>
          {[0,1,2].map((i) => <span key={i} style={{ display: "block", width: "22px", height: "2px", background: "#1E293B", borderRadius: "2px" }} />)}
        </button>
      </div>
      {menuOpen && (
        <div style={{ background: "#fff", borderTop: "1px solid #E2E8F0", padding: "1.25rem 1.5rem 1.75rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          {[["Inicio", "/"], ["Servicios", "/#servicios"], ["FAQ", "/faq"], ["Cotizar", "/quote"]].map(([l, h]) => (
            <Link key={l} href={h} onClick={() => setMenuOpen(false)}
              style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1rem", fontWeight: "500", color: "#475569", textDecoration: "none" }}>{l}</Link>
          ))}
        </div>
      )}
    </nav>
  )
}

function PageFooter() {
  return (
    <footer style={{ background: "#0F172A", padding: "3rem 1.5rem 2rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem" }}>
        <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "700", fontSize: "1rem", color: "#fff" }}>
          Octane<span style={{ color: "#F97316" }}>Lab</span>
        </span>
        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.8rem", color: "#334155" }}>
          © {new Date().getFullYear()} Octane Lab · Morelia, Michoacán, México
        </span>
      </div>
    </footer>
  )
}

// ─── CONTACT CHANNELS ─────────────────────────────────────────────────────────
const CHANNELS = [
  {
    icon: "💬",
    title: "WhatsApp",
    desc: "Respuesta en minutos. Ideal para dudas rápidas o enviar fotos de referencia.",
    action: "Abrir WhatsApp",
    // ▼ Reemplaza con tu número real (sin espacios ni guiones)
    href: "https://wa.me/52XXXXXXXXXX?text=Hola%2C+necesito+cotizar+una+pieza+3D",
    badge: "Más rápido",
    badgeColor: "#F0FDF4",
    badgeBorder: "#BBF7D0",
    badgeText: "#15803D",
    bg: "#F0FDF4",
    border: "#BBF7D0",
  },
  {
    icon: "✉️",
    title: "Email",
    desc: "Para proyectos detallados, licitaciones o información de tu empresa.",
    action: "Enviar email",
    // ▼ Reemplaza con tu correo real
    href: "mailto:hola@octanelab.mx",
    badge: "Formal",
    badgeColor: "#EFF6FF",
    badgeBorder: "#BFDBFE",
    badgeText: "#1D4ED8",
    bg: "#EFF6FF",
    border: "#BFDBFE",
  },
  {
    icon: "📍",
    title: "Visítanos",
    desc: "Morelia, Michoacán. Recolección sin costo y asesoría presencial.",
    action: "Ver en mapa",
    // ▼ Reemplaza con tu dirección real en Google Maps
    href: "https://maps.google.com/?q=Morelia,Michoacan",
    badge: "Presencial",
    badgeColor: "#FFF7ED",
    badgeBorder: "#FED7AA",
    badgeText: "#EA580C",
    bg: "#FFF7ED",
    border: "#FED7AA",
  },
]

// ─── CONTACT PAGE ─────────────────────────────────────────────────────────────
export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" })
  const [status, setStatus] = useState("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const [fieldErrors, setFieldErrors] = useState({})

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setFieldErrors((prev) => ({ ...prev, [name]: "" }))
  }

  function validate() {
    const errs = {}
    if (!form.name.trim())    errs.name    = "Requerido"
    if (!form.email.trim())   errs.email   = "Requerido"
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) errs.email = "Email inválido"
    if (!form.message.trim()) errs.message = "Requerido"
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setFieldErrors(errs); return }

    setStatus("loading")
    setErrorMsg("")

    try {
      // Guardamos el contacto en la tabla quotes con notas especiales
      // Si prefieres otra tabla, cámbiala aquí
      const { error } = await supabase.from("quotes").insert([{
        name:     form.name,
        email:    form.email,
        phone:    form.phone || null,
        material: "Consulta general",
        notes:    "[Asunto: " + (form.subject || "Sin asunto") + "]\n" + form.message,
        status:   "pending",
      }])
      if (error) throw new Error(error.message)
      setStatus("success")
    } catch (err) {
      setErrorMsg(err.message)
      setStatus("error")
    }
  }

  const inputStyle = {
    width: "100%",
    fontFamily: "'Outfit', sans-serif",
    fontSize: "0.925rem",
    color: "#1E293B",
    background: "#fff",
    border: "1.5px solid #E2E8F0",
    borderRadius: "10px",
    padding: "0.75rem 1rem",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Roboto+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F8FAFC; -webkit-font-smoothing: antialiased; }
        input:focus, select:focus, textarea:focus { border-color: #F97316 !important; box-shadow: 0 0 0 3px rgba(249,115,22,0.12) !important; }
        .ol-desktop-nav { display: flex; }
        .ol-mobile-btn  { display: none; }
        @media (max-width: 768px) { .ol-desktop-nav { display: none !important; } .ol-mobile-btn { display: flex !important; } }
        @media (max-width: 960px) { .ol-contact-grid { grid-template-columns: 1fr !important; } }
      `}</style>
      <PageNav />

      {/* Header */}
      <div style={{ background: "linear-gradient(160deg, #fff 60%, #FFF7ED 100%)", paddingTop: "68px" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", padding: "5rem 1.5rem 4rem", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#FFF7ED", border: "1px solid #FED7AA", padding: "0.3rem 0.9rem", borderRadius: "100px", marginBottom: "1.5rem" }}>
            <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "0.7rem", color: "#EA580C", letterSpacing: "0.08em" }}>// Contacto</span>
          </div>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "800", fontSize: "clamp(2.2rem, 5vw, 3rem)", color: "#0F172A", letterSpacing: "-0.03em", marginBottom: "1rem", lineHeight: "1.1" }}>
            Hablemos de<br /><span style={{ color: "#F97316" }}>tu proyecto</span>
          </h1>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.05rem", color: "#64748B", lineHeight: "1.75" }}>
            Nuestro equipo está disponible de Lunes a Sábado de 9:00 a 19:00 hrs.
            Respondemos en menos de 2 horas en horario hábil.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem 7rem" }}>

        {/* Channel cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem", marginBottom: "3rem" }} className="ol-channels-grid">
          {CHANNELS.map((ch) => (
            <a key={ch.title} href={ch.href} target={ch.href.startsWith("http") ? "_blank" : "_self"} rel="noopener noreferrer"
              style={{ textDecoration: "none" }}>
              <div
                style={{
                  background: "#fff", border: "1px solid #E2E8F0", borderRadius: "20px",
                  padding: "1.75rem", transition: "all 0.25s", cursor: "pointer",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = ch.border; e.currentTarget.style.background = ch.bg; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.08)" }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.background = "#fff"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none" }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1rem" }}>
                  <div style={{ width: "48px", height: "48px", background: ch.bg, border: "1px solid " + ch.border, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem" }}>
                    {ch.icon}
                  </div>
                  <span style={{
                    fontFamily: "'Outfit', sans-serif", fontSize: "0.72rem", fontWeight: "600",
                    background: ch.badgeColor, border: "1px solid " + ch.badgeBorder, color: ch.badgeText,
                    padding: "0.2rem 0.6rem", borderRadius: "100px",
                  }}>
                    {ch.badge}
                  </span>
                </div>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "700", fontSize: "1rem", color: "#0F172A", marginBottom: "0.4rem" }}>
                  {ch.title}
                </h3>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.82rem", color: "#64748B", lineHeight: "1.65", marginBottom: "1.25rem" }}>
                  {ch.desc}
                </p>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.82rem", fontWeight: "600", color: "#F97316" }}>
                  {ch.action} →
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* Main grid: form + info */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "2rem", alignItems: "start" }} className="ol-contact-grid">

          {/* ── FORM ── */}
          <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "24px", padding: "2.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>

            {status === "success" ? (
              <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
                <div style={{ width: "64px", height: "64px", background: "#F0FDF4", border: "2px solid #BBF7D0", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.75rem", margin: "0 auto 1.25rem" }}>✅</div>
                <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "800", fontSize: "1.5rem", color: "#0F172A", marginBottom: "0.75rem" }}>
                  ¡Mensaje recibido!
                </h2>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.95rem", color: "#64748B", lineHeight: "1.75", marginBottom: "2rem" }}>
                  Gracias <strong style={{ color: "#0F172A" }}>{form.name}</strong>. Te respondemos a{" "}
                  <strong style={{ color: "#F97316" }}>{form.email}</strong> en menos de 2 horas.
                </p>
                <div style={{ display: "flex", gap: "0.875rem", justifyContent: "center", flexWrap: "wrap" }}>
                  <button onClick={() => { setStatus("idle"); setForm({ name: "", email: "", phone: "", subject: "", message: "" }) }}
                    style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "600", fontSize: "0.9rem", background: "#F8FAFC", color: "#64748B", padding: "0.75rem 1.5rem", borderRadius: "10px", border: "1px solid #E2E8F0", cursor: "pointer" }}>
                    Enviar otro mensaje
                  </button>
                  <Link href="/quote" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "700", fontSize: "0.9rem", background: "#F97316", color: "#fff", padding: "0.75rem 1.5rem", borderRadius: "10px", textDecoration: "none" }}>
                    Cotizar proyecto →
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: "2rem" }}>
                  <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "700", fontSize: "1.2rem", color: "#0F172A", marginBottom: "0.4rem" }}>
                    Envíanos un mensaje
                  </h2>
                  <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.875rem", color: "#94A3B8" }}>
                    Para proyectos, presupuestos o cualquier duda técnica.
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                      <div>
                        <label style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.875rem", fontWeight: "600", color: "#374151", display: "block", marginBottom: "0.4rem" }}>
                          Nombre <span style={{ color: "#F97316" }}>*</span>
                        </label>
                        <input name="name" value={form.name} onChange={handleChange} placeholder="Tu nombre"
                          style={{ ...inputStyle, borderColor: fieldErrors.name ? "#EF4444" : "#E2E8F0" }}
                          onFocus={(e) => e.target.style.borderColor = "#F97316"}
                          onBlur={(e) => e.target.style.borderColor = fieldErrors.name ? "#EF4444" : "#E2E8F0"}
                        />
                        {fieldErrors.name && <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.75rem", color: "#EF4444", marginTop: "0.3rem" }}>{fieldErrors.name}</p>}
                      </div>
                      <div>
                        <label style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.875rem", fontWeight: "600", color: "#374151", display: "block", marginBottom: "0.4rem" }}>
                          Email <span style={{ color: "#F97316" }}>*</span>
                        </label>
                        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="tu@email.com"
                          style={{ ...inputStyle, borderColor: fieldErrors.email ? "#EF4444" : "#E2E8F0" }}
                          onFocus={(e) => e.target.style.borderColor = "#F97316"}
                          onBlur={(e) => e.target.style.borderColor = fieldErrors.email ? "#EF4444" : "#E2E8F0"}
                        />
                        {fieldErrors.email && <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.75rem", color: "#EF4444", marginTop: "0.3rem" }}>{fieldErrors.email}</p>}
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                      <div>
                        <label style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.875rem", fontWeight: "600", color: "#374151", display: "block", marginBottom: "0.4rem" }}>
                          Teléfono
                        </label>
                        <input name="phone" value={form.phone} onChange={handleChange} placeholder="+52 443 123 4567"
                          style={inputStyle}
                          onFocus={(e) => e.target.style.borderColor = "#F97316"}
                          onBlur={(e) => e.target.style.borderColor = "#E2E8F0"}
                        />
                      </div>
                      <div>
                        <label style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.875rem", fontWeight: "600", color: "#374151", display: "block", marginBottom: "0.4rem" }}>
                          Asunto
                        </label>
                        <select name="subject" value={form.subject} onChange={handleChange}
                          style={{ ...inputStyle, cursor: "pointer" }}
                          onFocus={(e) => e.target.style.borderColor = "#F97316"}
                          onBlur={(e) => e.target.style.borderColor = "#E2E8F0"}
                        >
                          <option value="">Seleccionar...</option>
                          <option>Cotización de proyecto</option>
                          <option>Duda técnica sobre materiales</option>
                          <option>Pregunta sobre envíos</option>
                          <option>Pedido en curso</option>
                          <option>Colaboración o partnership</option>
                          <option>Otro</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.875rem", fontWeight: "600", color: "#374151", display: "block", marginBottom: "0.4rem" }}>
                        Mensaje <span style={{ color: "#F97316" }}>*</span>
                      </label>
                      <textarea name="message" value={form.message} onChange={handleChange}
                        placeholder="Cuéntanos sobre tu proyecto, las piezas que necesitas, materiales de interés, fechas de entrega o cualquier duda técnica..."
                        rows={6}
                        style={{ ...inputStyle, resize: "vertical", lineHeight: "1.65", borderColor: fieldErrors.message ? "#EF4444" : "#E2E8F0" }}
                        onFocus={(e) => e.target.style.borderColor = "#F97316"}
                        onBlur={(e) => e.target.style.borderColor = fieldErrors.message ? "#EF4444" : "#E2E8F0"}
                      />
                      {fieldErrors.message && <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.75rem", color: "#EF4444", marginTop: "0.3rem" }}>{fieldErrors.message}</p>}
                    </div>

                    {(errorMsg || status === "error") && (
                      <div style={{ background: "#FFF1F2", border: "1px solid #FECDD3", borderRadius: "12px", padding: "1rem 1.25rem" }}>
                        <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.875rem", color: "#E11D48" }}>
                          ⚠️ {errorMsg || "Ocurrió un error. Intenta de nuevo."}
                        </p>
                      </div>
                    )}

                    <button type="submit" disabled={status === "loading"} style={{
                      fontFamily: "'Outfit', sans-serif", fontWeight: "700", fontSize: "1rem",
                      background: status === "loading" ? "#FDBA74" : "#F97316",
                      color: "#fff", padding: "1rem", borderRadius: "12px", border: "none",
                      cursor: status === "loading" ? "not-allowed" : "pointer",
                      boxShadow: "0 4px 14px rgba(249,115,22,0.3)", transition: "all 0.2s",
                    }}
                      onMouseEnter={(e) => { if (status !== "loading") e.currentTarget.style.background = "#EA6C0A" }}
                      onMouseLeave={(e) => { if (status !== "loading") e.currentTarget.style.background = "#F97316" }}
                    >
                      {status === "loading" ? "Enviando..." : "Enviar mensaje →"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>

          {/* ── SIDEBAR INFO ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

            {/* Hours */}
            <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "20px", padding: "1.75rem" }}>
              <p style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.12em", color: "#94A3B8", marginBottom: "1.25rem" }}>// HORARIO DE ATENCIÓN</p>
              {[
                ["Lunes – Viernes", "9:00 – 19:00 hrs", true],
                ["Sábado", "10:00 – 15:00 hrs", true],
                ["Domingo", "Cerrado", false],
              ].map(([day, time, open]) => (
                <div key={day} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.6rem 0", borderBottom: "1px solid #F8FAFC" }}>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.85rem", color: "#475569" }}>{day}</span>
                  <span style={{
                    fontFamily: "'Outfit', sans-serif", fontSize: "0.82rem",
                    fontWeight: open ? "600" : "400",
                    color: open ? "#0F172A" : "#CBD5E1",
                  }}>{time}</span>
                </div>
              ))}
              <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: "10px", padding: "0.75rem 1rem", marginTop: "1rem", display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                <span style={{ fontSize: "0.9rem", flexShrink: 0 }}>💡</span>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.78rem", color: "#15803D", lineHeight: "1.6" }}>
                  WhatsApp disponible hasta las 20:00 hrs en días hábiles.
                </p>
              </div>
            </div>

            {/* Location */}
            <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "20px", padding: "1.75rem" }}>
              <p style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.12em", color: "#94A3B8", marginBottom: "1.25rem" }}>// UBICACIÓN</p>
              {/* ▼ REEMPLAZA con un iframe de Google Maps real:
                  <iframe src="https://www.google.com/maps/embed?pb=..." width="100%" height="160" style={{ border: 0, borderRadius: "12px" }} allowFullScreen loading="lazy" />
              */}
              <div style={{ width: "100%", height: "160px", background: "linear-gradient(135deg, #F1F5F9, #E2E8F0)", borderRadius: "12px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                <span style={{ fontSize: "2rem" }}>📍</span>
                <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "0.65rem", color: "#94A3B8", letterSpacing: "0.1em" }}>// INSERTA TU MAPA AQUÍ</span>
              </div>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "600", fontSize: "0.875rem", color: "#0F172A", marginBottom: "0.25rem" }}>
                Morelia, Michoacán
              </p>
              {/* ▼ Reemplaza con tu dirección real */}
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.82rem", color: "#64748B", lineHeight: "1.6", marginBottom: "0.875rem" }}>
                Calle Ejemplo #123, Col. Centro<br />
                CP 58000, Morelia, Michoacán
              </p>
              <a href="https://maps.google.com/?q=Morelia,Michoacan" target="_blank" rel="noopener noreferrer"
                style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.82rem", fontWeight: "600", color: "#F97316", textDecoration: "none" }}>
                Abrir en Google Maps →
              </a>
            </div>

            {/* CTA quote */}
            <div style={{ background: "linear-gradient(135deg, #FFF7ED, #FFEDD5)", border: "1px solid #FED7AA", borderRadius: "20px", padding: "1.75rem", textAlign: "center" }}>
              <div style={{ fontSize: "1.75rem", marginBottom: "0.75rem" }}>🖨️</div>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "700", fontSize: "0.95rem", color: "#0F172A", marginBottom: "0.5rem" }}>
                ¿Ya tienes tu archivo 3D?
              </p>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.82rem", color: "#78716C", lineHeight: "1.6", marginBottom: "1.25rem" }}>
                Salta directo al formulario de cotización y recibe tu precio en 4 horas.
              </p>
              <Link href="/quote" style={{
                fontFamily: "'Outfit', sans-serif", fontWeight: "700", fontSize: "0.875rem",
                background: "#F97316", color: "#fff", padding: "0.75rem 1.5rem",
                borderRadius: "10px", textDecoration: "none", display: "inline-block",
                boxShadow: "0 4px 12px rgba(249,115,22,0.3)", transition: "all 0.2s",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#EA6C0A"; e.currentTarget.style.transform = "translateY(-1px)" }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#F97316"; e.currentTarget.style.transform = "translateY(0)" }}
              >
                Cotizar gratis →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <PageFooter />
    </>
  )
}