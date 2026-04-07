"use client"

import { useState } from "react"
import Link from "next/link"

// ─── SHARED LAYOUT WRAPPER ────────────────────────────────────────────────────
function PageLayout({ children }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Roboto+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #fff; color: #1E293B; overflow-x: hidden; -webkit-font-smoothing: antialiased; }
        @media (max-width: 768px) {
          .ol-desktop-nav { display: none !important; }
          .ol-mobile-btn  { display: flex !important; }
        }
      `}</style>
      <PageNav />
      {children}
      <PageFooter />
    </>
  )
}

function PageNav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  if (typeof window !== "undefined") {
    window.onscroll = () => setScrolled(window.scrollY > 48)
  }

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "rgba(255,255,255,0.92)",
      backdropFilter: "blur(16px)",
      borderBottom: "1px solid #E2E8F0",
      padding: "0 1.5rem",
    }}>
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
          <Link href="/contact" style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.875rem", fontWeight: "500", color: "#64748B", textDecoration: "none", padding: "0.5rem 1rem", transition: "color 0.2s" }}
            onMouseEnter={(e) => e.currentTarget.style.color = "#1E293B"}
            onMouseLeave={(e) => e.currentTarget.style.color = "#64748B"}
          >Contacto</Link>
          <Link href="/quote" style={{
            fontFamily: "'Outfit', sans-serif", fontSize: "0.875rem", fontWeight: "600",
            color: "#fff", background: "#F97316", padding: "0.55rem 1.25rem", borderRadius: "8px",
            textDecoration: "none", boxShadow: "0 1px 3px rgba(249,115,22,0.35)", transition: "background 0.2s",
          }}
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
          {[["Servicios", "/#servicios"], ["Proceso", "/#proceso"], ["Portfolio", "/#portfolio"], ["FAQ", "/faq"], ["Contacto", "/contact"]].map(([l, h]) => (
            <Link key={l} href={h} onClick={() => setMenuOpen(false)}
              style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1rem", fontWeight: "500", color: "#475569", textDecoration: "none" }}>{l}</Link>
          ))}
          <Link href="/quote" onClick={() => setMenuOpen(false)}
            style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "600", background: "#F97316", color: "#fff", padding: "0.8rem 1.2rem", borderRadius: "10px", textAlign: "center", textDecoration: "none" }}>
            Cotizar gratis
          </Link>
        </div>
      )}
    </nav>
  )
}

function PageFooter() {
  return (
    <footer style={{ background: "#0F172A", padding: "3.5rem 1.5rem 2rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "28px", height: "28px", background: "#F97316", borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontWeight: "900", fontSize: "0.85rem", fontFamily: "'Outfit', sans-serif" }}>O</span>
          </div>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "700", fontSize: "1rem", color: "#fff" }}>
            Octane<span style={{ color: "#F97316" }}>Lab</span>
          </span>
        </div>
        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.8rem", color: "#334155" }}>
          © {new Date().getFullYear()} Octane Lab · Morelia, Michoacán, México
        </span>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          {[["Contacto", "/contact"]].map(([l, h]) => (
            <Link key={l} href={h} style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.8rem", color: "#475569", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#F97316"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#475569"}
            >{l}</Link>
          ))}
        </div>
      </div>
    </footer>
  )
}

// ─── FAQ ACCORDION ────────────────────────────────────────────────────────────
function AccordionItem({ question, answer, isOpen, onToggle, index }) {
  return (
    <div style={{
      border: "1px solid",
      borderColor: isOpen ? "#FED7AA" : "#E2E8F0",
      borderRadius: "16px",
      overflow: "hidden",
      transition: "border-color 0.25s",
      background: isOpen ? "#FFFBF5" : "#fff",
    }}>
      <button
        onClick={onToggle}
        style={{
          width: "100%", display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: "1rem",
          padding: "1.5rem 1.75rem",
          background: "none", border: "none", cursor: "pointer", textAlign: "left",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{
            fontFamily: "'Roboto Mono', monospace", fontSize: "0.65rem",
            color: isOpen ? "#F97316" : "#94A3B8",
            letterSpacing: "0.12em", flexShrink: 0,
            transition: "color 0.2s",
          }}>
            {"0" + (index + 1)}
          </span>
          <span style={{
            fontFamily: "'Outfit', sans-serif", fontWeight: "600",
            fontSize: "1rem", color: isOpen ? "#0F172A" : "#1E293B",
            lineHeight: "1.4",
          }}>
            {question}
          </span>
        </div>
        <div style={{
          width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0,
          background: isOpen ? "#F97316" : "#F1F5F9",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "background 0.25s, transform 0.25s",
          transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
        }}>
          <span style={{ color: isOpen ? "#fff" : "#64748B", fontSize: "1.1rem", lineHeight: 1, marginTop: "-1px" }}>+</span>
        </div>
      </button>

      <div style={{
        maxHeight: isOpen ? "600px" : "0",
        overflow: "hidden",
        transition: "max-height 0.4s ease",
      }}>
        <div style={{ padding: "0 1.75rem 1.75rem", paddingLeft: "calc(1.75rem + 1rem + 2.2rem)" }}>
          <p style={{
            fontFamily: "'Outfit', sans-serif", fontSize: "0.925rem",
            color: "#475569", lineHeight: "1.8",
          }}>
            {answer}
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── FAQ PAGE ─────────────────────────────────────────────────────────────────
const FAQ_CATEGORIES = [
  {
    category: "Archivos y formatos",
    icon: "📎",
    items: [
      {
        q: "¿Qué formatos de archivo aceptan?",
        a: "Aceptamos STL, STEP, STP, OBJ, 3MF, DXF y AMF. Si tienes un formato distinto, contáctanos y lo revisamos. Para mejores resultados recomendamos STEP o STL con resolución de malla alta.",
      },
      {
        q: "¿Qué pasa si no tengo un archivo 3D?",
        a: "¡Sin problema! Puedes describirnos lo que necesitas por texto, enviarnos un croquis o sketch, e incluso una foto de referencia. Nuestro equipo puede ayudarte a preparar el modelo o referirte con diseñadores de confianza.",
      },
      {
        q: "¿Cuál es el tamaño máximo de archivo que puedo subir?",
        a: "Aceptamos archivos de hasta 50 MB directamente desde el formulario. Si tu archivo es más grande, puedes enviárnoslo por WeTransfer o Google Drive y lo gestionamos por correo.",
      },
    ],
  },
  {
    category: "Materiales",
    icon: "🧪",
    items: [
      {
        q: "¿Qué materiales tienen disponibles?",
        a: "Trabajamos con PLA, PLA+, PETG, ABS, ASA, TPU (flexible), Nylon PA12, Nylon con fibra de vidrio, Resina estándar, Resina ABS-like, Resina flexible y Resina 8K para detalle fino. Pregúntanos si necesitas un material específico.",
      },
      {
        q: "¿Cómo elijo el material correcto para mi pieza?",
        a: "Depende del uso: PLA para prototipos visuales, PETG para uso mecánico y contacto con alimentos, ABS/ASA para exterior y alta temperatura, Nylon para piezas de ingeniería de alta carga, TPU para partes flexibles, y Resina para máximo detalle. En el formulario de cotización te recomendamos el más adecuado según tu descripción.",
      },
      {
        q: "¿Pueden imprimir en multicolor o multimaterial?",
        a: "Sí. Contamos con impresoras de hasta 4 materiales simultáneos. Podemos combinar colores, dureza (rígido + flexible), o propiedades mecánicas en una sola pieza sin postproceso de pintura.",
      },
    ],
  },
  {
    category: "Precios y presupuesto",
    icon: "💬",
    items: [
      {
        q: "¿Cuánto cuesta imprimir una pieza?",
        a: "El precio varía según material, volumen, complejidad y acabado. Una pieza pequeña en PLA puede costar desde $80 MXN. Te enviamos un presupuesto detallado en menos de 4 horas sin costo ni compromiso.",
      },
      {
        q: "¿Hay un mínimo de piezas para cotizar?",
        a: "No. Fabricamos desde una sola pieza hasta series de 500+ unidades. No cobramos costo de setup por ser impresión 3D.",
      },
      {
        q: "¿El presupuesto tiene algún costo?",
        a: "El presupuesto es completamente gratuito. Solo pagas si decides aceptarlo y confirmar el pedido.",
      },
      {
        q: "¿Ofrecen descuentos por volumen?",
        a: "Sí. A partir de 10 piezas iguales aplicamos descuento escalonado. A partir de 50 piezas, contacta directamente para una propuesta personalizada.",
      },
    ],
  },
  {
    category: "Tiempos de entrega",
    icon: "⚡",
    items: [
      {
        q: "¿Cuánto tarda en llegar mi pieza?",
        a: "El tiempo depende del tamaño y complejidad. Piezas pequeñas y medianas: 24–48h. Piezas grandes o con postproceso: 48–72h. En casos especiales hasta 5 días hábiles. Te confirmamos el tiempo exacto en el presupuesto.",
      },
      {
        q: "¿Tienen servicio express?",
        a: "Sí. Contamos con modalidad express 24h con un cargo adicional del 30%. Disponible para piezas de hasta 20×20×20 cm y según disponibilidad de agenda.",
      },
      {
        q: "¿Entregan a domicilio o solo en Morelia?",
        a: "Enviamos a todo México con Fedex, DHL o Estafeta. También puedes recoger en nuestro taller en Morelia sin costo adicional. El envío se cotiza aparte según peso y destino.",
      },
    ],
  },
  {
    category: "Calidad y garantía",
    icon: "✅",
    items: [
      {
        q: "¿Qué tolerancia dimensional tienen sus impresoras?",
        a: "Nuestras impresoras FDM tienen tolerancia de ±0.2mm en ejes XY y ±0.3mm en Z. Para SLA/Resina llegamos a ±0.05mm. Si tu pieza requiere tolerancias específicas, indícalas en las notas del formulario.",
      },
      {
        q: "¿Qué pasa si mi pieza llega dañada o con defectos?",
        a: "Garantizamos la calidad de cada pieza. Si hay un defecto de impresión, la reimprimimos sin costo. Solo necesitas enviarnos fotos del problema dentro de los 5 días hábiles después de recibir el pedido.",
      },
      {
        q: "¿Puedo pedir una muestra antes de un pedido grande?",
        a: "Sí, recomendamos siempre hacer 1–2 piezas de validación antes de una serie. El costo es el mismo por pieza unitaria, y te asegura que el resultado cumple tus expectativas antes de invertir en la serie completa.",
      },
    ],
  },
]

export default function FAQPage() {
  const [openItems, setOpenItems] = useState({})
  const [activeCategory, setActiveCategory] = useState("Todos")

  function toggle(catIndex, itemIndex) {
    const key = catIndex + "-" + itemIndex
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const filtered = activeCategory === "Todos"
    ? FAQ_CATEGORIES
    : FAQ_CATEGORIES.filter((c) => c.category === activeCategory)

  let globalIndex = 0

  return (
    <PageLayout>
      {/* Header */}
      <section style={{
        background: "linear-gradient(160deg, #FFFFFF 60%, #FFF7ED 100%)",
        paddingTop: "68px",
      }}>
        <div style={{ maxWidth: "760px", margin: "0 auto", padding: "5rem 1.5rem 4rem", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#FFF7ED", border: "1px solid #FED7AA", padding: "0.3rem 0.9rem", borderRadius: "100px", marginBottom: "1.5rem" }}>
            <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "0.7rem", color: "#EA580C", letterSpacing: "0.08em" }}>// Preguntas frecuentes</span>
          </div>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "800", fontSize: "clamp(2.2rem, 5vw, 3.25rem)", color: "#0F172A", letterSpacing: "-0.03em", marginBottom: "1rem", lineHeight: "1.1" }}>
            Todo lo que necesitas<br />saber antes de cotizar
          </h1>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.05rem", color: "#64748B", lineHeight: "1.75", marginBottom: "2.5rem" }}>
            Si no encuentras respuesta a tu pregunta,{" "}
            <Link href="/contact" style={{ color: "#F97316", textDecoration: "none", fontWeight: "600" }}>escríbenos</Link>
            {" "}y te respondemos en menos de 2 horas.
          </p>

          {/* Search suggestion */}
          <div style={{
            background: "#F8FAFC", border: "1px solid #E2E8F0",
            borderRadius: "12px", padding: "0.875rem 1.25rem",
            display: "flex", alignItems: "center", gap: "0.75rem",
            maxWidth: "440px", margin: "0 auto",
            cursor: "text",
          }}>
            <span style={{ color: "#94A3B8", fontSize: "1rem" }}>🔍</span>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.9rem", color: "#94A3B8" }}>
              ¿Cuánto cuesta imprimir una pieza?
            </span>
          </div>
        </div>
      </section>

      {/* Category filter */}
      <section style={{ background: "#fff", borderBottom: "1px solid #E2E8F0", position: "sticky", top: "68px", zIndex: 50 }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 1.5rem" }}>
          <div style={{ display: "flex", gap: "0.25rem", overflowX: "auto", padding: "1rem 0" }}>
            {["Todos", ...FAQ_CATEGORIES.map((c) => c.category)].map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                fontFamily: "'Outfit', sans-serif", fontSize: "0.83rem", fontWeight: "500",
                padding: "0.45rem 1rem", borderRadius: "100px", whiteSpace: "nowrap",
                border: activeCategory === cat ? "1.5px solid #F97316" : "1.5px solid #E2E8F0",
                background: activeCategory === cat ? "#FFF7ED" : "#fff",
                color: activeCategory === cat ? "#F97316" : "#64748B",
                cursor: "pointer", transition: "all 0.2s", flexShrink: 0,
              }}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Accordion */}
      <section style={{ background: "#fff", padding: "4rem 1.5rem 7rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "4rem" }}>
          {filtered.map((cat, catIndex) => {
            const realCatIndex = FAQ_CATEGORIES.indexOf(cat)
            return (
              <div key={cat.category}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
                  <span style={{ fontSize: "1.4rem" }}>{cat.icon}</span>
                  <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "700", fontSize: "1.2rem", color: "#0F172A" }}>
                    {cat.category}
                  </h2>
                  <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "0.65rem", color: "#94A3B8", marginLeft: "auto" }}>
                    {cat.items.length} preguntas
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {cat.items.map((item, itemIndex) => {
                    const key = realCatIndex + "-" + itemIndex
                    const idx = globalIndex++
                    return (
                      <AccordionItem
                        key={item.q}
                        question={item.q}
                        answer={item.a}
                        isOpen={!!openItems[key]}
                        onToggle={() => toggle(realCatIndex, itemIndex)}
                        index={idx}
                      />
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA bottom */}
      <section style={{ background: "#F8FAFC", borderTop: "1px solid #E2E8F0", padding: "5rem 1.5rem" }}>
        <div style={{
          maxWidth: "640px", margin: "0 auto", textAlign: "center",
          background: "linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)",
          border: "1px solid #FED7AA", borderRadius: "24px", padding: "3.5rem 2.5rem",
        }}>
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🚀</div>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "800", fontSize: "1.75rem", color: "#0F172A", letterSpacing: "-0.02em", marginBottom: "0.75rem" }}>
            ¿Listo para cotizar?
          </h2>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.95rem", color: "#78716C", lineHeight: "1.7", marginBottom: "2rem" }}>
            Sube tu archivo y recibe tu presupuesto en menos de 4 horas, sin costo y sin compromiso.
          </p>
          <div style={{ display: "flex", gap: "0.875rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/quote" style={{
              fontFamily: "'Outfit', sans-serif", fontWeight: "700", fontSize: "0.95rem",
              background: "#F97316", color: "#fff", padding: "0.875rem 2rem", borderRadius: "12px",
              textDecoration: "none", boxShadow: "0 4px 14px rgba(249,115,22,0.3)", display: "inline-block", transition: "all 0.2s",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#EA6C0A"; e.currentTarget.style.transform = "translateY(-1px)" }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#F97316"; e.currentTarget.style.transform = "translateY(0)" }}
            >
              Cotizar mi proyecto →
            </Link>
            <Link href="/contact" style={{
              fontFamily: "'Outfit', sans-serif", fontWeight: "600", fontSize: "0.95rem",
              background: "#fff", color: "#64748B", padding: "0.875rem 1.75rem", borderRadius: "12px",
              textDecoration: "none", border: "1px solid #E2E8F0", transition: "all 0.2s",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#CBD5E1"; e.currentTarget.style.color = "#0F172A" }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.color = "#64748B" }}
            >
              Tengo otra pregunta
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}