"use client"

import { useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

// ─── SHARED NAV + FOOTER (same as FAQ) ───────────────────────────────────────
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
        <Link href="/contact" style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.875rem", fontWeight: "500", color: "#64748B", textDecoration: "none", padding: "0.5rem 1rem" }} className="ol-desktop-nav">
          Contacto
        </Link>
        <button onClick={() => setMenuOpen(!menuOpen)} className="ol-mobile-btn"
          style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: "4px", flexDirection: "column", gap: "5px" }}>
          {[0,1,2].map((i) => <span key={i} style={{ display: "block", width: "22px", height: "2px", background: "#1E293B", borderRadius: "2px" }} />)}
        </button>
      </div>
      {menuOpen && (
        <div style={{ background: "#fff", borderTop: "1px solid #E2E8F0", padding: "1.25rem 1.5rem 1.75rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          {[["Servicios", "/#servicios"], ["Proceso", "/#proceso"], ["FAQ", "/faq"], ["Contacto", "/contact"]].map(([l, h]) => (
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
          © {new Date().getFullYear()} Octane Lab · Morelia, México
        </span>
      </div>
    </footer>
  )
}

// ─── FORM FIELD COMPONENTS ────────────────────────────────────────────────────
function Label({ children, required }) {
  return (
    <label style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.875rem", fontWeight: "600", color: "#374151", marginBottom: "0.4rem", display: "block" }}>
      {children}
      {required && <span style={{ color: "#F97316", marginLeft: "3px" }}>*</span>}
    </label>
  )
}

function InputField({ label, required, hint, error, children }) {
  return (
    <div>
      <Label required={required}>{label}</Label>
      {hint && <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.78rem", color: "#94A3B8", marginBottom: "0.4rem" }}>{hint}</p>}
      {children}
      {error && <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.78rem", color: "#EF4444", marginTop: "0.35rem" }}>{error}</p>}
    </div>
  )
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

const MATERIALS = ["PLA", "PLA+", "PETG", "ABS", "ASA", "TPU (flexible)", "Nylon PA12", "Resina estándar", "Resina ABS-like", "Resina 8K", "No sé, que me recomienden"]
const COLORS    = ["Sin preferencia", "Blanco", "Negro", "Gris", "Rojo", "Azul", "Verde", "Amarillo", "Naranja", "Transparente", "Otro (indicar en notas)"]
const FINISHES  = ["Estándar (tal como sale de la impresora)", "Lijado fino", "Pintado (un color)", "Imprimación + pintura", "No sé, que me recomienden"]

// ─── QUOTE PAGE ───────────────────────────────────────────────────────────────
export default function QuotePage() {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", company: "",
    material: "", color: "", finish: "",
    quantity: 1, notes: "",
  })
  const [file, setFile] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [status, setStatus]     = useState("idle")  // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("")
  const [fieldErrors, setFieldErrors] = useState({})

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setFieldErrors((prev) => ({ ...prev, [name]: "" }))
  }

  function handleFile(selected) {
    if (!selected) return
    if (!selected.name.toLowerCase().endsWith(".stl") &&
        !selected.name.toLowerCase().endsWith(".step") &&
        !selected.name.toLowerCase().endsWith(".stp") &&
        !selected.name.toLowerCase().endsWith(".obj") &&
        !selected.name.toLowerCase().endsWith(".3mf")) {
      setErrorMsg("Formato no soportado. Usa STL, STEP, OBJ o 3MF.")
      return
    }
    if (selected.size > 50 * 1024 * 1024) {
      setErrorMsg("El archivo no puede superar los 50 MB.")
      return
    }
    setErrorMsg("")
    setFile(selected)
  }

  function validate() {
    const errs = {}
    if (!form.name.trim())  errs.name  = "El nombre es requerido"
    if (!form.email.trim()) errs.email = "El email es requerido"
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) errs.email = "Email inválido"
    if (!form.material)     errs.material = "Selecciona un material"
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setFieldErrors(errs); return }

    setStatus("loading")
    setErrorMsg("")

    try {
      let stl_file_url = null

      if (file) {
        const fileName = Date.now() + "_" + file.name.replace(/\s/g, "_")
        const { error: uploadError } = await supabase.storage.from("stl-files").upload(fileName, file)
        if (uploadError) throw new Error("Error al subir el archivo: " + uploadError.message)
        const { data: urlData } = supabase.storage.from("stl-files").getPublicUrl(fileName)
        stl_file_url = urlData.publicUrl
      }

      const { error: insertError } = await supabase.from("quotes").insert([{
        name:         form.name,
        email:        form.email,
        phone:        form.phone   || null,
        material:     form.material,
        color:        form.color   || null,
        quantity:     Number(form.quantity),
        notes:        [form.company ? "Empresa: " + form.company : "", form.finish ? "Acabado: " + form.finish : "", form.notes].filter(Boolean).join("\n") || null,
        stl_file_url,
        status:       "pending",
      }])

      if (insertError) throw new Error("Error al guardar: " + insertError.message)
      setStatus("success")
    } catch (err) {
      setErrorMsg(err.message)
      setStatus("error")
    }
  }

  // ─── SUCCESS ─────────────────────────────────────────────────────────────
  if (status === "success") {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Roboto+Mono:wght@400;500&display=swap');
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: #fff; -webkit-font-smoothing: antialiased; }
          .ol-desktop-nav { display: flex; }
          .ol-mobile-btn  { display: none; }
          @media (max-width: 768px) { .ol-desktop-nav { display: none !important; } .ol-mobile-btn { display: flex !important; } }
        `}</style>
        <PageNav />
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(160deg, #fff 60%, #FFF7ED 100%)", paddingTop: "68px", padding: "6rem 1.5rem" }}>
          <div style={{ maxWidth: "520px", width: "100%", textAlign: "center" }}>
            <div style={{ width: "72px", height: "72px", background: "#F0FDF4", border: "2px solid #BBF7D0", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", margin: "0 auto 1.5rem" }}>
              ✅
            </div>
            <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "800", fontSize: "2rem", color: "#0F172A", letterSpacing: "-0.02em", marginBottom: "0.75rem" }}>
              ¡Cotización recibida!
            </h1>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1rem", color: "#64748B", lineHeight: "1.75", marginBottom: "2rem" }}>
              Gracias <strong style={{ color: "#0F172A" }}>{form.name}</strong>. Revisaremos tu proyecto y te enviaremos el presupuesto detallado a <strong style={{ color: "#F97316" }}>{form.email}</strong> en menos de <strong style={{ color: "#0F172A" }}>4 horas hábiles</strong>.
            </p>
            <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "16px", padding: "1.5rem", marginBottom: "2rem", textAlign: "left" }}>
              <p style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "0.65rem", color: "#94A3B8", letterSpacing: "0.12em", marginBottom: "1rem" }}>// RESUMEN DE TU PEDIDO</p>
              {[
                ["Material", form.material],
                ["Cantidad", form.quantity + " piezas"],
                ["Color", form.color || "Sin preferencia"],
                file ? ["Archivo", file.name] : null,
              ].filter(Boolean).map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid #F1F5F9" }}>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.85rem", color: "#64748B" }}>{k}</span>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.85rem", color: "#0F172A", fontWeight: "600" }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: "0.875rem", justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={() => { setStatus("idle"); setForm({ name: "", email: "", phone: "", company: "", material: "", color: "", finish: "", quantity: 1, notes: "" }); setFile(null) }}
                style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "700", fontSize: "0.9rem", background: "#F97316", color: "#fff", padding: "0.875rem 1.75rem", borderRadius: "12px", border: "none", cursor: "pointer", boxShadow: "0 4px 14px rgba(249,115,22,0.3)", transition: "all 0.2s" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#EA6C0A"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#F97316"}
              >
                Enviar otra cotización
              </button>
              <Link href="/" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "600", fontSize: "0.9rem", background: "#fff", color: "#64748B", padding: "0.875rem 1.75rem", borderRadius: "12px", border: "1px solid #E2E8F0", textDecoration: "none", display: "inline-block" }}>
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>
        <PageFooter />
      </>
    )
  }

  // ─── FORM ─────────────────────────────────────────────────────────────────
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
        @media (max-width: 900px) { .ol-quote-grid { grid-template-columns: 1fr !important; } }
      `}</style>
      <PageNav />

      {/* Page header */}
      <div style={{ background: "linear-gradient(160deg, #fff 60%, #FFF7ED 100%)", paddingTop: "68px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "4rem 1.5rem 3rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#FFF7ED", border: "1px solid #FED7AA", padding: "0.3rem 0.9rem", borderRadius: "100px", marginBottom: "1.25rem" }}>
            <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "0.7rem", color: "#EA580C", letterSpacing: "0.08em" }}>// Cotización gratuita</span>
          </div>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "800", fontSize: "clamp(2rem, 4vw, 2.75rem)", color: "#0F172A", letterSpacing: "-0.03em", marginBottom: "0.75rem" }}>
            Cotiza tu proyecto 3D
          </h1>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1rem", color: "#64748B", lineHeight: "1.7" }}>
            Completa el formulario y recibe tu presupuesto en{" "}
            <strong style={{ color: "#0F172A" }}>menos de 4 horas</strong> sin costo ni compromiso.
          </p>
        </div>
      </div>

      {/* Main grid */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem 1.5rem 6rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "2rem", alignItems: "start" }} className="ol-quote-grid">

          {/* ── FORM CARD ── */}
          <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "24px", padding: "2.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <form onSubmit={handleSubmit}>

              {/* Section: Contacto */}
              <div style={{ marginBottom: "2.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem", paddingBottom: "0.875rem", borderBottom: "1px solid #F1F5F9" }}>
                  <span style={{ fontSize: "1.1rem" }}>👤</span>
                  <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "700", fontSize: "1rem", color: "#0F172A" }}>Tus datos de contacto</h2>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                  <InputField label="Nombre completo" required error={fieldErrors.name}>
                    <input name="name" value={form.name} onChange={handleChange} placeholder="Carlos García"
                      style={{ ...inputStyle, borderColor: fieldErrors.name ? "#EF4444" : "#E2E8F0" }}
                      onFocus={(e) => e.target.style.borderColor = "#F97316"}
                      onBlur={(e) => e.target.style.borderColor = fieldErrors.name ? "#EF4444" : "#E2E8F0"}
                    />
                  </InputField>
                  <InputField label="Email" required error={fieldErrors.email}>
                    <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="carlos@empresa.com"
                      style={{ ...inputStyle, borderColor: fieldErrors.email ? "#EF4444" : "#E2E8F0" }}
                      onFocus={(e) => e.target.style.borderColor = "#F97316"}
                      onBlur={(e) => e.target.style.borderColor = fieldErrors.email ? "#EF4444" : "#E2E8F0"}
                    />
                  </InputField>
                  <InputField label="Teléfono / WhatsApp" hint="Opcional, para contacto rápido">
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="+52 443 123 4567"
                      style={inputStyle}
                      onFocus={(e) => e.target.style.borderColor = "#F97316"}
                      onBlur={(e) => e.target.style.borderColor = "#E2E8F0"}
                    />
                  </InputField>
                  <InputField label="Empresa u organización" hint="Opcional">
                    <input name="company" value={form.company} onChange={handleChange} placeholder="Mi Empresa SA de CV"
                      style={inputStyle}
                      onFocus={(e) => e.target.style.borderColor = "#F97316"}
                      onBlur={(e) => e.target.style.borderColor = "#E2E8F0"}
                    />
                  </InputField>
                </div>
              </div>

              {/* Section: Especificaciones */}
              <div style={{ marginBottom: "2.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem", paddingBottom: "0.875rem", borderBottom: "1px solid #F1F5F9" }}>
                  <span style={{ fontSize: "1.1rem" }}>🧪</span>
                  <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "700", fontSize: "1rem", color: "#0F172A" }}>Especificaciones de la pieza</h2>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                  <InputField label="Material" required error={fieldErrors.material}>
                    <select name="material" value={form.material} onChange={handleChange}
                      style={{ ...inputStyle, borderColor: fieldErrors.material ? "#EF4444" : "#E2E8F0", cursor: "pointer" }}
                      onFocus={(e) => e.target.style.borderColor = "#F97316"}
                      onBlur={(e) => e.target.style.borderColor = fieldErrors.material ? "#EF4444" : "#E2E8F0"}
                    >
                      <option value="">Seleccionar material...</option>
                      {MATERIALS.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </InputField>
                  <InputField label="Color">
                    <select name="color" value={form.color} onChange={handleChange}
                      style={{ ...inputStyle, cursor: "pointer" }}
                      onFocus={(e) => e.target.style.borderColor = "#F97316"}
                      onBlur={(e) => e.target.style.borderColor = "#E2E8F0"}
                    >
                      <option value="">Seleccionar color...</option>
                      {COLORS.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </InputField>
                  <InputField label="Acabado superficial">
                    <select name="finish" value={form.finish} onChange={handleChange}
                      style={{ ...inputStyle, cursor: "pointer" }}
                      onFocus={(e) => e.target.style.borderColor = "#F97316"}
                      onBlur={(e) => e.target.style.borderColor = "#E2E8F0"}
                    >
                      <option value="">Seleccionar acabado...</option>
                      {FINISHES.map((f) => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </InputField>
                  <InputField label="Cantidad de piezas">
                    <input name="quantity" type="number" min="1" max="9999" value={form.quantity} onChange={handleChange}
                      style={inputStyle}
                      onFocus={(e) => e.target.style.borderColor = "#F97316"}
                      onBlur={(e) => e.target.style.borderColor = "#E2E8F0"}
                    />
                  </InputField>
                </div>
              </div>

              {/* Section: Archivo */}
              <div style={{ marginBottom: "2.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem", paddingBottom: "0.875rem", borderBottom: "1px solid #F1F5F9" }}>
                  <span style={{ fontSize: "1.1rem" }}>📎</span>
                  <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "700", fontSize: "1rem", color: "#0F172A" }}>Archivo de tu pieza</h2>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.78rem", color: "#94A3B8", marginLeft: "4px" }}>(opcional)</span>
                </div>

                {/* Drop zone */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]) }}
                  onClick={() => document.getElementById("file-input").click()}
                  style={{
                    border: "2px dashed",
                    borderColor: dragOver ? "#F97316" : file ? "#22C55E" : "#E2E8F0",
                    borderRadius: "16px",
                    background: dragOver ? "#FFF7ED" : file ? "#F0FDF4" : "#F8FAFC",
                    padding: "2.5rem 1.5rem",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 0.25s",
                  }}
                >
                  <input id="file-input" type="file" accept=".stl,.step,.stp,.obj,.3mf"
                    onChange={(e) => handleFile(e.target.files[0])}
                    style={{ display: "none" }}
                  />
                  <div style={{ fontSize: "2.25rem", marginBottom: "0.75rem" }}>{file ? "✅" : "📤"}</div>
                  {file ? (
                    <>
                      <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "600", fontSize: "0.95rem", color: "#15803D" }}>{file.name}</p>
                      <p style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "0.7rem", color: "#86EFAC", marginTop: "0.25rem" }}>
                        {(file.size / 1024 / 1024).toFixed(2)} MB · Listo para subir
                      </p>
                      <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null) }}
                        style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.78rem", color: "#94A3B8", background: "none", border: "none", cursor: "pointer", marginTop: "0.5rem", textDecoration: "underline" }}>
                        Eliminar
                      </button>
                    </>
                  ) : (
                    <>
                      <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "600", fontSize: "0.95rem", color: "#1E293B", marginBottom: "0.35rem" }}>
                        Arrastra tu archivo aquí
                      </p>
                      <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.82rem", color: "#94A3B8" }}>
                        o <span style={{ color: "#F97316", fontWeight: "600" }}>haz clic para seleccionar</span>
                      </p>
                      <p style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "0.65rem", color: "#CBD5E1", marginTop: "0.6rem", letterSpacing: "0.06em" }}>
                        STL · STEP · OBJ · 3MF · máx. 50 MB
                      </p>
                    </>
                  )}
                </div>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.78rem", color: "#94A3B8", marginTop: "0.75rem" }}>
                  ¿No tienes archivo? Cuéntanos tu idea en las notas y te ayudamos a diseñarla.
                </p>
              </div>

              {/* Section: Notas */}
              <div style={{ marginBottom: "2rem" }}>
                <InputField label="Notas adicionales" hint="Uso final, tolerancias necesarias, referencias, preguntas...">
                  <textarea name="notes" value={form.notes} onChange={handleChange}
                    placeholder="Ej: La pieza va en un ambiente de hasta 80°C. Necesito que el agujero central sea de exactamente 12mm. Tengo 3 iteraciones en mente..."
                    rows={4}
                    style={{ ...inputStyle, resize: "vertical", lineHeight: "1.6" }}
                    onFocus={(e) => e.target.style.borderColor = "#F97316"}
                    onBlur={(e) => e.target.style.borderColor = "#E2E8F0"}
                  />
                </InputField>
              </div>

              {/* Error global */}
              {(errorMsg || status === "error") && (
                <div style={{ background: "#FFF1F2", border: "1px solid #FECDD3", borderRadius: "12px", padding: "1rem 1.25rem", marginBottom: "1.5rem" }}>
                  <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.875rem", color: "#E11D48" }}>
                    ⚠️ {errorMsg || "Ocurrió un error. Intenta de nuevo."}
                  </p>
                </div>
              )}

              {/* Submit */}
              <button type="submit" disabled={status === "loading"} style={{
                width: "100%", fontFamily: "'Outfit', sans-serif", fontWeight: "700", fontSize: "1rem",
                background: status === "loading" ? "#FDBA74" : "#F97316",
                color: "#fff", padding: "1rem", borderRadius: "12px", border: "none",
                cursor: status === "loading" ? "not-allowed" : "pointer",
                boxShadow: "0 4px 14px rgba(249,115,22,0.3)",
                transition: "all 0.2s",
              }}
                onMouseEnter={(e) => { if (status !== "loading") e.currentTarget.style.background = "#EA6C0A" }}
                onMouseLeave={(e) => { if (status !== "loading") e.currentTarget.style.background = "#F97316" }}
              >
                {status === "loading" ? "Enviando tu cotización..." : "Enviar cotización gratuita →"}
              </button>

              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.75rem", color: "#94A3B8", textAlign: "center", marginTop: "0.875rem" }}>
                Al enviar aceptas nuestra{" "}
                <Link href="#" style={{ color: "#F97316", textDecoration: "none" }}>política de privacidad</Link>.
                No compartimos tus datos.
              </p>
            </form>
          </div>

          {/* ── SIDEBAR ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

            {/* Response time */}
            <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "20px", padding: "1.75rem", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
                <div style={{ width: "40px", height: "40px", background: "#FFF7ED", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem" }}>⚡</div>
                <div>
                  <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "700", fontSize: "0.95rem", color: "#0F172A" }}>Respuesta en 4h</p>
                  <p style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "0.65rem", color: "#F97316" }}>GARANTIZADO</p>
                </div>
              </div>
              {[
                ["📧 Presupuesto detallado", "Material, precio y tiempo de entrega"],
                ["📞 Asesoría gratuita", "Te recomendamos el mejor material"],
                ["🔒 Sin compromiso", "Solo pagas si aceptas la cotización"],
              ].map(([title, desc]) => (
                <div key={title} style={{ display: "flex", gap: "0.75rem", padding: "0.75rem 0", borderTop: "1px solid #F8FAFC" }}>
                  <span style={{ fontSize: "0.95rem", flexShrink: 0 }}>{title.split(" ")[0]}</span>
                  <div>
                    <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "600", fontSize: "0.82rem", color: "#1E293B" }}>{title.split(" ").slice(1).join(" ")}</p>
                    <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.78rem", color: "#94A3B8" }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Materials quick ref */}
            <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "20px", padding: "1.75rem", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <p style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.12em", color: "#94A3B8", marginBottom: "1rem" }}>// GUÍA DE MATERIALES</p>
              {[
                { mat: "PLA",   use: "Prototipos visuales, maquetas",    color: "#EFF6FF" },
                { mat: "PETG",  use: "Piezas mecánicas, uso general",    color: "#F0FDF4" },
                { mat: "Nylon", use: "Alta carga y resistencia",         color: "#FFF7ED" },
                { mat: "TPU",   use: "Piezas flexibles y sellos",        color: "#FDF4FF" },
                { mat: "Resina",use: "Máximo detalle y acabado",         color: "#FFF1F2" },
              ].map((m) => (
                <div key={m.mat} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.55rem 0", borderBottom: "1px solid #F8FAFC" }}>
                  <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "0.7rem", fontWeight: "500", color: "#F97316", minWidth: "44px" }}>{m.mat}</span>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.78rem", color: "#64748B" }}>{m.use}</span>
                </div>
              ))}
              <Link href="/faq#materiales" style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.78rem", color: "#F97316", textDecoration: "none", display: "block", marginTop: "0.875rem" }}>
                ¿Cuál necesito? Ver guía completa →
              </Link>
            </div>

            {/* Contact alt */}
            <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "20px", padding: "1.5rem" }}>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "600", fontSize: "0.875rem", color: "#1E293B", marginBottom: "0.5rem" }}>¿Prefieres hablar directo?</p>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.82rem", color: "#64748B", marginBottom: "1rem", lineHeight: "1.6" }}>
                Escríbenos por WhatsApp o email y te atendemos en minutos.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {/* ▼ Reemplaza href con tu número y correo reales */}
                <a href="https://wa.me/52XXXXXXXXXX" target="_blank" rel="noopener noreferrer"
                  style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.82rem", fontWeight: "600", color: "#15803D", background: "#F0FDF4", border: "1px solid #BBF7D0", padding: "0.6rem 1rem", borderRadius: "10px", textDecoration: "none", textAlign: "center" }}>
                  💬 WhatsApp
                </a>
                <a href="mailto:hola@octanelab.mx"
                  style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.82rem", fontWeight: "600", color: "#1D4ED8", background: "#EFF6FF", border: "1px solid #BFDBFE", padding: "0.6rem 1rem", borderRadius: "10px", textDecoration: "none", textAlign: "center" }}>
                  ✉️ hola@octanelab.mx
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PageFooter />
    </>
  )
}