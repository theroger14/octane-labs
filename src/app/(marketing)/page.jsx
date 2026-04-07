"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"

function useReveal(threshold = 0.12) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible]
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => { setTimeout(() => setLoaded(true), 80) }, [])

  const badges = ["Entrega en 24-72h", "Sin cantidad mínima", "Presupuesto gratis"]

  return (
    <section style={{
      background: "linear-gradient(160deg, #FFFFFF 60%, #FFF7ED 100%)",
      paddingTop: "68px", minHeight: "100vh",
      display: "flex", alignItems: "center",
      overflow: "hidden", position: "relative",
    }}>
      <div style={{ position: "absolute", top: "-120px", right: "-180px", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(249,115,22,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-80px", left: "-100px", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(249,115,22,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{
        maxWidth: "1200px", margin: "0 auto", padding: "4rem 1.5rem 5rem",
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center",
      }} className="ol-hero-grid">

        {/* LEFT */}
        <div style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(24px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#FFF7ED", border: "1px solid #FED7AA", padding: "0.3rem 0.9rem", borderRadius: "100px", marginBottom: "1.5rem" }}>
            <span style={{ width: "7px", height: "7px", background: "#F97316", borderRadius: "50%", display: "inline-block" }} />
            <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "0.7rem", color: "#EA580C", letterSpacing: "0.08em", fontWeight: "500" }}>
              MANUFACTURA ADITIVA — MORELIA, MX
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Outfit', sans-serif", fontSize: "clamp(2.6rem, 5vw, 4rem)",
            fontWeight: "800", color: "#0F172A", lineHeight: "1.1", letterSpacing: "-0.03em", marginBottom: "1.25rem",
          }}>
            Tu pieza 3D,<br />
            <span style={{ color: "#F97316" }}>impresa y entregada</span><br />
            en 24 horas.
          </h1>

          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.05rem", color: "#475569", lineHeight: "1.75", marginBottom: "2rem", maxWidth: "460px" }}>
            Sube tu archivo STL, STEP o DXF y recibe un presupuesto en menos de 4 horas.
            Prototipos, piezas funcionales y series cortas en PLA, PETG, ABS, Nylon, Resina y más.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "2rem" }}>
            {badges.map((b) => (
              <span key={b} style={{
                fontFamily: "'Outfit', sans-serif", fontSize: "0.8rem", fontWeight: "500",
                color: "#15803D", background: "#F0FDF4", border: "1px solid #BBF7D0",
                padding: "0.3rem 0.75rem", borderRadius: "100px",
              }}>
                {"✓ " + b}
              </span>
            ))}
          </div>

          <div style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap", alignItems: "center" }}>
            <Link href="/quote" style={{
              fontFamily: "'Outfit', sans-serif", fontWeight: "700", fontSize: "1rem",
              background: "#F97316", color: "#fff", padding: "0.875rem 2rem", borderRadius: "12px",
              textDecoration: "none", boxShadow: "0 4px 14px rgba(249,115,22,0.35)",
              transition: "all 0.2s", display: "inline-block",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#EA6C0A"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(249,115,22,0.4)" }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#F97316"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(249,115,22,0.35)" }}
            >
              Subir mi STL gratis
            </Link>
            <a href="#portfolio" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "600", fontSize: "0.95rem", color: "#475569", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#0F172A"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#475569"}
            >
              Ver trabajos →
            </a>
          </div>

        </div>

        {/* RIGHT — Image */}
        <div style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(32px)", transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s", position: "relative" }}>
          <div style={{
            aspectRatio: "4/3",
            borderRadius: "24px", boxShadow: "0 24px 64px rgba(15,23,42,0.1)",
            position: "relative", overflow: "hidden",
          }}>
            <Image
              src="/images/hero/Mechanical printing.png"
              alt="Pieza impresa en 3D por OctaneLab"
              fill
              priority
              style={{ objectFit: "cover" }}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div style={{ position: "absolute", bottom: "1.5rem", left: "1.5rem", background: "#fff", borderRadius: "12px", padding: "0.75rem 1rem", boxShadow: "0 4px 20px rgba(0,0,0,0.12)", display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <div style={{ width: "36px", height: "36px", background: "#FFF7ED", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem" }}>⚡</div>
              <div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "700", fontSize: "0.85rem", color: "#0F172A" }}>Entrega express</div>
                <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "0.65rem", color: "#F97316" }}>24-72h garantizado</div>
              </div>
            </div>
            <div style={{ position: "absolute", top: "1.5rem", right: "1.5rem", background: "#fff", borderRadius: "12px", padding: "0.6rem 0.9rem", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "700", fontSize: "0.78rem", color: "#0F172A" }}>⭐ 4.9 / 5</div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.68rem", color: "#94A3B8" }}>+500 reseñas</div>
            </div>
          </div>
          <div style={{ position: "absolute", bottom: "-24px", right: "-24px", width: "120px", height: "120px", backgroundImage: "radial-gradient(circle, #E2E8F0 1.5px, transparent 1.5px)", backgroundSize: "12px 12px", zIndex: -1 }} />
        </div>
      </div>
    </section>
  )
}

// ─── HOW IT WORKS ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const [ref, visible] = useReveal()

  const steps = [
    { n: "01", icon: "📎", title: "Sube tu archivo", desc: "STL, STEP, OBJ o DXF. Si no tienes archivo, cuéntanos tu idea y te ayudamos.", bg: "#EFF6FF", border: "#BFDBFE", img: "/images/hero/Upload.png" },
    { n: "02", icon: "💬", title: "Recibe presupuesto", desc: "En menos de 4 horas: precio, material sugerido y tiempo de entrega.", bg: "#FFF7ED", border: "#FED7AA", img: "/images/hero/Quoatation.png" },
    { n: "03", icon: "🖨️", title: "Imprimimos tu pieza", desc: "Control de calidad en cada capa. PLA, PETG, Nylon, ABS, Resina y más.", bg: "#F0FDF4", border: "#BBF7D0", img: "/images/hero/extrusion wallpaper.png" },
    { n: "04", icon: "📦", title: "Recíbela en casa", desc: "Envío a todo México en 24-72h o recolección en Morelia, Michoacán.", bg: "#FDF4FF", border: "#E9D5FF", img: "/images/hero/Unboxin 3d print.png" },
  ]

  return (
    <section id="proceso" style={{ background: "#fff", padding: "7rem 1.5rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div ref={ref} style={{ textAlign: "center", marginBottom: "4rem", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.6s, transform 0.6s" }}>
          <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.15em", color: "#F97316", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            // Proceso
          </div>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "800", fontSize: "clamp(2rem, 4vw, 2.75rem)", color: "#0F172A", letterSpacing: "-0.02em", marginBottom: "1rem" }}>
            De archivo a pieza en <span style={{ color: "#F97316" }}>4 pasos</span>
          </h2>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1rem", color: "#64748B", maxWidth: "480px", margin: "0 auto", lineHeight: "1.7" }}>
            Sin complicaciones. Sin formularios eternos. Sin sorpresas en el precio.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.25rem" }} className="ol-steps-grid">
          {steps.map((s, i) => (
            <div key={s.n}
              style={{
                background: s.bg, border: "1px solid " + s.border, borderRadius: "20px", padding: "2rem 1.5rem",
                opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)",
                transition: "opacity 0.5s ease " + i * 0.1 + "s, transform 0.5s ease " + i * 0.1 + "s, box-shadow 0.25s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.08)" }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none" }}
            >
              <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "0.65rem", color: "#94A3B8", letterSpacing: "0.12em", marginBottom: "1rem" }}>{s.n}</div>
              <img src={s.img} alt={s.title} style={{ width: "100%", height: "140px", objectFit: "cover", borderRadius: "12px", marginBottom: "1rem" }} />
              <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "700", fontSize: "1.05rem", color: "#0F172A", marginBottom: "0.6rem" }}>{s.title}</h3>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.85rem", color: "#64748B", lineHeight: "1.7" }}>{s.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "3.5rem" }}>
          <Link href="/quote" style={{
            fontFamily: "'Outfit', sans-serif", fontWeight: "700", fontSize: "1rem",
            background: "#F97316", color: "#fff", padding: "0.9rem 2.25rem", borderRadius: "12px",
            textDecoration: "none", boxShadow: "0 4px 14px rgba(249,115,22,0.3)", display: "inline-block", transition: "all 0.2s",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#EA6C0A"; e.currentTarget.style.transform = "translateY(-2px)" }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#F97316"; e.currentTarget.style.transform = "translateY(0)" }}
          >
            Cotizar mi proyecto →
          </Link>
        </div>
      </div>
    </section>
  )
}

// ─── SERVICES ─────────────────────────────────────────────────────────────────
function Services() {
  const [ref, visible] = useReveal()

  const services = [
    { icon: "🔩", title: "Prototipado de Ingeniería", desc: "Itera rápido. Valida tu diseño antes de invertir en moldes o producción. Tolerancias de ±0.1mm.", tags: ["FDM", "SLA", "±0.1mm tolerancia"], href: "/services" },
    { icon: "⚙️", title: "Piezas Funcionales", desc: "Componentes mecatrónicos listos para ensamblar. Materiales de alta resistencia, temperatura y flexibilidad.", tags: ["PETG", "Nylon PA12", "ABS", "TPU"], href: "/services" },
    { icon: "🎨", title: "Multicolor & Multimaterial", desc: "Impresión simultánea de hasta 4 materiales o colores en la misma pieza, sin pintura ni postproceso extra.", tags: ["Hasta 4 mat.", "Pantone match", "Sin postproceso"], href: "/services" },
    { icon: "🏭", title: "Series Cortas", desc: "De 1 hasta 500 piezas idénticas con control de calidad individual. Perfecto para lanzamiento de producto.", tags: ["1-500 piezas", "Control QC", "Embalaje incluido"], href: "/services" },
  ]

  return (
    <section id="servicios" style={{ background: "#F8FAFC", padding: "7rem 1.5rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div ref={ref} style={{
          display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3.5rem", flexWrap: "wrap", gap: "1.5rem",
          opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.6s, transform 0.6s",
        }}>
          <div>
            <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.15em", color: "#F97316", textTransform: "uppercase", marginBottom: "0.75rem" }}>
              // Servicios
            </div>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "800", fontSize: "clamp(2rem, 4vw, 2.75rem)", color: "#0F172A", letterSpacing: "-0.02em" }}>
              Todo lo que necesitas<br />para fabricar en 3D
            </h2>
          </div>
          <Link href="/services" style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.875rem", fontWeight: "600", color: "#F97316", textDecoration: "none" }}>
            Ver todos los servicios →
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.25rem" }} className="ol-services-grid">
          {services.map((s, i) => (
            <Link key={s.title} href={s.href} style={{ textDecoration: "none" }}>
              <div
                style={{
                  background: "#fff", border: "1px solid #E2E8F0", borderRadius: "20px", padding: "2rem",
                  cursor: "pointer", transition: "all 0.25s",
                  opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)",
                  transitionDelay: i * 0.08 + "s", height: "100%",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 12px 40px rgba(15,23,42,0.1)"; e.currentTarget.style.borderColor = "#FED7AA"; e.currentTarget.style.transform = "translateY(-4px)" }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.transform = "translateY(0)" }}
              >
                <div style={{ width: "52px", height: "52px", background: "#FFF7ED", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", marginBottom: "1.25rem" }}>
                  {s.icon}
                </div>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "700", fontSize: "1.1rem", color: "#0F172A", marginBottom: "0.6rem" }}>{s.title}</h3>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.875rem", color: "#64748B", lineHeight: "1.7", marginBottom: "1.25rem" }}>{s.desc}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                  {s.tags.map((t) => (
                    <span key={t} style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.06em", background: "#F8FAFC", border: "1px solid #E2E8F0", color: "#64748B", padding: "0.25rem 0.6rem", borderRadius: "6px" }}>{t}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── PORTFOLIO ────────────────────────────────────────────────────────────────
function Portfolio() {
  const [ref, visible] = useReveal()
  const [active, setActive] = useState("Todos")
  const cats = ["Todos", "Ingeniería", "Hogar", "Medicina", "Industrial"]

  const items = [
    { id: 1, label: "Brazo robótico articulado", cat: "Ingeniería", mat: "ABS", src: "/images/hero/Gemini_Generated_Image_41nzxw41nzxw41nz.png", span: 2 },
    { id: 2, label: "Modelo anatómico dental", cat: "Medicina", mat: "Resina biocompatible", src: "/images/hero/Gemini_Generated_Image_810pt8810pt8810p.png", span: 1 },
    { id: 3, label: "Carcasa electrónica IP67", cat: "Industrial", mat: "PETG", src: "/images/hero/Gemini_Generated_Image_d9eaamd9eaamd9ea.png", span: 1 },
    { id: 4, label: "Soporte de pared modular", cat: "Hogar", mat: "PLA multicolor", src: "/images/hero/Gemini_Generated_Image_hfyqsnhfyqsnhfyq.png", span: 1 },
    { id: 5, label: "Engranaje planetario", cat: "Ingeniería", mat: "Nylon PA12", src: "/images/hero/Gemini_Generated_Image_ic1bphic1bphic1b.png", span: 1 },
    { id: 6, label: "Prototipo aeronáutico", cat: "Ingeniería", mat: "ABS + fibra de carbono", src: "/images/hero/Gemini_Generated_Image_j4cqc4j4cqc4j4cq.png", span: 2 },
  ]

  const filtered = active === "Todos" ? items : items.filter((i) => i.cat === active)

  return (
    <section id="portfolio" style={{ background: "#fff", padding: "7rem 1.5rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div ref={ref} style={{ textAlign: "center", marginBottom: "3rem", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.6s, transform 0.6s" }}>
          <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.15em", color: "#F97316", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            // Portfolio
          </div>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "800", fontSize: "clamp(2rem, 4vw, 2.75rem)", color: "#0F172A", letterSpacing: "-0.02em", marginBottom: "0.75rem" }}>
            Piezas que ya fabricamos
          </h2>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1rem", color: "#64748B" }}>Cada pieza es única. La tuya también puede serlo.</p>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginBottom: "2.5rem", flexWrap: "wrap" }}>
          {cats.map((c) => (
            <button key={c} onClick={() => setActive(c)} style={{
              fontFamily: "'Outfit', sans-serif", fontSize: "0.85rem", fontWeight: "500",
              padding: "0.45rem 1.1rem", borderRadius: "100px",
              border: active === c ? "1.5px solid #F97316" : "1.5px solid #E2E8F0",
              background: active === c ? "#FFF7ED" : "#fff",
              color: active === c ? "#F97316" : "#64748B",
              cursor: "pointer", transition: "all 0.2s",
            }}>
              {c}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", gridAutoRows: "220px" }} className="ol-portfolio-grid">
          {filtered.map((item, i) => (
            <PortfolioCard key={item.id} item={item} index={i} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  )
}

function PortfolioCard({ item, index, visible }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: item.bg, borderRadius: "16px",
        gridColumn: item.span === 2 ? "span 2" : "span 1",
        position: "relative", overflow: "hidden",
        cursor: "pointer", border: "1px solid #E2E8F0",
        transition: "all 0.3s",
        opacity: visible ? 1 : 0,
        transform: visible ? (hov ? "scale(1.02)" : "scale(1)") : "scale(0.96)",
        transitionDelay: index * 0.06 + "s",
        boxShadow: hov ? "0 16px 48px rgba(0,0,0,0.1)" : "none",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <Image
        src={item.src}
        alt={item.label}
        fill
        loading="lazy"
        style={{ objectFit: "cover", transition: "transform 0.3s", transform: hov ? "scale(1.05)" : "scale(1)" }}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />

      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(15,23,42,0.75) 0%, transparent 55%)",
        opacity: hov ? 1 : 0, transition: "opacity 0.3s",
        padding: "1.25rem", display: "flex", flexDirection: "column", justifyContent: "flex-end",
      }}>
        <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "0.62rem", color: "#F97316", letterSpacing: "0.1em", marginBottom: "0.25rem" }}>{item.mat}</div>
        <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "700", fontSize: "0.95rem", color: "#fff" }}>{item.label}</div>
      </div>
    </div>
  )
}

// ─── CTA FINAL ────────────────────────────────────────────────────────────────
function CTAFinal() {
  const [ref, visible] = useReveal()
  return (
    <section style={{ background: "#fff", padding: "7rem 1.5rem" }}>
      <div ref={ref} style={{
        maxWidth: "760px", margin: "0 auto", textAlign: "center",
        background: "linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)",
        border: "1px solid #FED7AA", borderRadius: "28px", padding: "4.5rem 3rem",
        opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: "opacity 0.7s, transform 0.7s",
      }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🚀</div>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "800", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", color: "#0F172A", letterSpacing: "-0.02em", marginBottom: "1rem", lineHeight: "1.2" }}>
          ¿Tienes un archivo 3D listo?<br />Cotiza en 30 segundos.
        </h2>
        <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1rem", color: "#78716C", lineHeight: "1.7", marginBottom: "2.5rem" }}>
          Sin crear cuenta. Sin esperar días. Sin costos ocultos.<br />
          Solo sube tu archivo y nosotros hacemos el resto.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/quote" style={{
            fontFamily: "'Outfit', sans-serif", fontWeight: "700", fontSize: "1rem",
            background: "#F97316", color: "#fff", padding: "0.9rem 2.25rem", borderRadius: "12px",
            textDecoration: "none", boxShadow: "0 4px 16px rgba(249,115,22,0.35)", display: "inline-block", transition: "all 0.2s",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#EA6C0A"; e.currentTarget.style.transform = "translateY(-2px)" }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#F97316"; e.currentTarget.style.transform = "translateY(0)" }}
          >
            Subir mi STL gratis
          </Link>
          <Link href="/contact" style={{
            fontFamily: "'Outfit', sans-serif", fontWeight: "600", fontSize: "0.95rem",
            background: "#fff", color: "#64748B", padding: "0.9rem 1.75rem", borderRadius: "12px",
            textDecoration: "none", border: "1px solid #E2E8F0", transition: "all 0.2s",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#CBD5E1"; e.currentTarget.style.color = "#0F172A" }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.color = "#64748B" }}
          >
            Hablar con un experto
          </Link>
        </div>
        <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.75rem", color: "#A8A29E", marginTop: "1.5rem" }}>
          Respuesta en menos de 4 horas hábiles · Sin compromiso de compra
        </p>
      </div>
    </section>
  )
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: "#0F172A", padding: "5rem 1.5rem 2.5rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "3rem", marginBottom: "4rem" }} className="ol-footer-grid">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1rem" }}>
              <img src="/images/hero/Logo.png" alt="Octane Lab logo" style={{ width: "28px", height: "28px", objectFit: "contain" }} />
              <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "700", fontSize: "1rem", color: "#fff" }}>
                Octane<span style={{ color: "#F97316" }}>Lab</span>
              </span>
            </div>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.85rem", color: "#475569", lineHeight: "1.8", maxWidth: "260px" }}>
              Manufactura aditiva de precisión en Morelia, Michoacán.
              Prototipos y piezas funcionales para ingenieros, diseñadores y empresas.
            </p>
          </div>

          {[
            { title: "Empresa", links: [["Portfolio", "#portfolio"], ["FAQ", "/faq"], ["Contacto", "/contact"]] },
          ].map((col) => (
            <div key={col.title}>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "700", fontSize: "0.8rem", color: "#94A3B8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "1.25rem" }}>
                {col.title}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
                {col.links.map(([label, href]) => (
                  <Link key={label} href={href} style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.875rem", color: "#475569", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "#F97316"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "#475569"}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px solid #1E293B", paddingTop: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.8rem", color: "#334155" }}>
            © {new Date().getFullYear()} Octane Lab · Morelia, Michoacán, México
          </span>
          <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "0.65rem", color: "#334155", letterSpacing: "0.08em" }}>
            Hecho con ❤️ en México
          </span>
        </div>
      </div>
    </footer>
  )
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      <style>{`
        @media (max-width: 1024px) {
          .ol-hero-grid      { grid-template-columns: 1fr !important; }
          .ol-steps-grid     { grid-template-columns: repeat(2, 1fr) !important; }
          .ol-services-grid  { grid-template-columns: 1fr !important; }
          .ol-footer-grid    { grid-template-columns: 1fr !important; }
          .ol-portfolio-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 768px) {
          .ol-steps-grid     { grid-template-columns: 1fr !important; }
          .ol-portfolio-grid { grid-template-columns: 1fr !important; }
          .ol-footer-grid    { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <Hero />
      <HowItWorks />
      <Services />
      <Portfolio />
      <CTAFinal />
      <Footer />
    </>
  )
}