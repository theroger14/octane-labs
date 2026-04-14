"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { supabase } from "@/lib/supabase"
import { parseSTL } from "./parse-stl"

const StlViewer = dynamic(() => import("./StlViewer"), { ssr: false })

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function fmt(n) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 2 }).format(n)
}

function sectionStyle(disabled) {
  return {
    background: "#fff",
    border: "1px solid #E2E8F0",
    borderRadius: "20px",
    padding: "1.75rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
    opacity: disabled ? 0.45 : 1,
    pointerEvents: disabled ? "none" : "auto",
    transition: "opacity 0.3s",
  }
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function QuotePage() {
  // STL state
  const [file, setFile]           = useState(null)
  const [dragOver, setDragOver]   = useState(false)
  const [stlData, setStlData]     = useState(null)   // { positions, volume_cm3, dimensions, triangle_count }
  const [parseError, setParseError] = useState("")

  // Configuration
  const [materials, setMaterials]             = useState([])
  const [materialsLoading, setMaterialsLoading] = useState(true)
  const [selectedMaterialId, setSelectedMaterialId] = useState(null)
  const [infill, setInfill]                   = useState(20)
  const [quantity, setQuantity]               = useState(1)

  // Pricing
  const [pricing, setPricing]           = useState(null)
  const [pricingLoading, setPricingLoading] = useState(false)

  // Confirmation form
  const [customerName, setCustomerName]   = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [notes, setNotes]                 = useState("")
  const [formErrors, setFormErrors]       = useState({})

  // Submission
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted]   = useState(false)
  const [submitError, setSubmitError] = useState("")

  const confirmRef = useRef(null)

  // ── Fetch materials on mount ─────────────────────────────────────────────
  useEffect(() => {
    async function fetchMaterials() {
      const { data, error } = await supabase
        .from("materials")
        .select("id, name, price_per_gram, density, description")
        .eq("active", true)
        .order("display_order")
      if (!error && data?.length) {
        setMaterials(data)
        setSelectedMaterialId(data[0].id)
      }
      setMaterialsLoading(false)
    }
    fetchMaterials()
  }, [])

  // ── Parse STL on file change ─────────────────────────────────────────────
  function handleFile(selected) {
    if (!selected) return
    if (!selected.name.toLowerCase().endsWith(".stl")) {
      setParseError("Solo se aceptan archivos .STL para el cotizador automático.")
      return
    }
    if (selected.size > 50 * 1024 * 1024) {
      setParseError("El archivo no puede superar los 50 MB.")
      return
    }
    setParseError("")
    setFile(selected)
    setStlData(null)
    setPricing(null)

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const result = parseSTL(e.target.result)
        setStlData(result)
      } catch (err) {
        setParseError("No se pudo leer el archivo STL: " + err.message)
      }
    }
    reader.readAsArrayBuffer(selected)
  }

  // ── Live price calculation (debounced) ───────────────────────────────────
  const calculatePrice = useCallback(async () => {
    if (!stlData || !selectedMaterialId) return
    setPricingLoading(true)
    try {
      const res = await fetch("/api/quote/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          volume_cm3: stlData.volume_cm3,
          material_id: selectedMaterialId,
          infill_percent: infill,
          quantity,
        }),
      })
      const data = await res.json()
      if (res.ok) setPricing(data)
      else setPricing(null)
    } catch {
      setPricing(null)
    } finally {
      setPricingLoading(false)
    }
  }, [stlData, selectedMaterialId, infill, quantity])

  useEffect(() => {
    if (!stlData || !selectedMaterialId) { setPricing(null); return }
    const t = setTimeout(calculatePrice, 350)
    return () => clearTimeout(t)
  }, [stlData, selectedMaterialId, infill, quantity, calculatePrice])

  // ── Confirm / submit ─────────────────────────────────────────────────────
  async function handleConfirm(e) {
    e.preventDefault()
    const errs = {}
    if (!customerName.trim()) errs.name  = "El nombre es requerido"
    if (!customerEmail.trim()) errs.email = "El email es requerido"
    if (customerEmail && !/\S+@\S+\.\S+/.test(customerEmail)) errs.email = "Email inválido"
    if (!stlData) errs.file = "Sube un archivo STL primero"
    if (!selectedMaterialId) errs.material = "Selecciona un material"
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return }

    setSubmitting(true)
    setSubmitError("")
    setFormErrors({})

    try {
      // Upload STL to Supabase Storage
      let file_url = null
      if (file) {
        const safeName = `${Date.now()}_${file.name.replace(/\s/g, "_")}`
        const { error: uploadErr } = await supabase.storage
          .from("stl-uploads")
          .upload(safeName, file, { contentType: "model/stl" })
        if (uploadErr) throw new Error("Error al subir el archivo: " + uploadErr.message)
        const { data: urlData } = supabase.storage.from("stl-uploads").getPublicUrl(safeName)
        file_url = urlData.publicUrl
      }

      // Save quote to database
      const { error: insertErr } = await supabase.from("quotes").insert([{
        file_url,
        file_name:        file?.name ?? null,
        volume_cm3:       stlData?.volume_cm3 ?? null,
        material_id:      selectedMaterialId,
        infill_percent:   infill,
        quantity,
        weight_grams:     pricing?.weight_grams ?? null,
        print_time_hours: pricing?.print_time_hours ?? null,
        total_price:      pricing?.total ?? null,
        customer_name:    customerName.trim(),
        customer_email:   customerEmail.trim(),
        notes:            notes.trim() || null,
        status:           "pending",
      }])

      if (insertErr) throw new Error("Error al guardar la cotización: " + insertErr.message)
      setSubmitted(true)
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  // ─── SUCCESS SCREEN ───────────────────────────────────────────────────────
  if (submitted) {
    const mat = materials.find((m) => m.id === selectedMaterialId)
    return (
      <>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(160deg, #fff 60%, #FFF7ED 100%)", padding: "6rem 1.5rem" }}>
          <div style={{ maxWidth: "520px", width: "100%", textAlign: "center" }}>
            <div style={{ width: "72px", height: "72px", background: "#F0FDF4", border: "2px solid #BBF7D0", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", margin: "0 auto 1.5rem" }}>✅</div>
            <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "800", fontSize: "2rem", color: "#0F172A", letterSpacing: "-0.02em", marginBottom: "0.75rem" }}>
              ¡Pedido confirmado!
            </h1>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1rem", color: "#64748B", lineHeight: "1.75", marginBottom: "2rem" }}>
              Gracias <strong style={{ color: "#0F172A" }}>{customerName}</strong>. Revisaremos tu pedido y te contactaremos a <strong style={{ color: "#F97316" }}>{customerEmail}</strong> para coordinar el pago y la entrega.
            </p>
            <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "16px", padding: "1.5rem", marginBottom: "2rem", textAlign: "left" }}>
              <p style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "0.65rem", color: "#94A3B8", letterSpacing: "0.12em", marginBottom: "1rem" }}>// RESUMEN DE TU PEDIDO</p>
              {[
                ["Archivo", file?.name],
                ["Material", mat?.name],
                ["Relleno", `${infill}%`],
                ["Cantidad", `${quantity} pieza${quantity > 1 ? "s" : ""}`],
                pricing ? ["Total", fmt(pricing.total)] : null,
              ].filter(Boolean).map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid #F1F5F9" }}>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.85rem", color: "#64748B" }}>{k}</span>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.85rem", color: "#0F172A", fontWeight: "600" }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: "0.875rem", justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={() => { setSubmitted(false); setFile(null); setStlData(null); setPricing(null); setCustomerName(""); setCustomerEmail(""); setNotes("") }}
                style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "700", fontSize: "0.9rem", background: "#F97316", color: "#fff", padding: "0.875rem 1.75rem", borderRadius: "12px", border: "none", cursor: "pointer", boxShadow: "0 4px 14px rgba(249,115,22,0.3)" }}>
                Nueva cotización
              </button>
              <Link href="/" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "600", fontSize: "0.9rem", background: "#fff", color: "#64748B", padding: "0.875rem 1.75rem", borderRadius: "12px", border: "1px solid #E2E8F0", textDecoration: "none", display: "inline-block" }}>
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </>
    )
  }

  const selectedMat = materials.find((m) => m.id === selectedMaterialId)
  const hasPrice = pricing && !pricingLoading

  // ─── MAIN FORM ────────────────────────────────────────────────────────────
  return (
    <>
      {/* Hero */}
      <div style={{ background: "linear-gradient(160deg, #fff 60%, #FFF7ED 100%)", paddingTop: "68px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "4rem 1.5rem 3rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#FFF7ED", border: "1px solid #FED7AA", padding: "0.3rem 0.9rem", borderRadius: "100px", marginBottom: "1.25rem" }}>
            <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "0.7rem", color: "#EA580C", letterSpacing: "0.08em" }}>// Precio instantáneo</span>
          </div>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "800", fontSize: "clamp(2rem, 4vw, 2.75rem)", color: "#0F172A", letterSpacing: "-0.03em", marginBottom: "0.75rem" }}>
            Cotizador automático STL
          </h1>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1rem", color: "#64748B", lineHeight: "1.7" }}>
            Sube tu modelo 3D y obtén un precio al instante. Sin esperas, sin formularios.
          </p>
        </div>
      </div>

      {/* Main grid */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem 1.5rem 6rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "1.75rem", alignItems: "start" }} className="ol-quote-grid">

          {/* ── LEFT COLUMN ────────────────────────────────────────────────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

            {/* Upload */}
            <div style={sectionStyle(false)}>
              <SectionHeader icon="📁" title="Archivo STL" />

              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]) }}
                onClick={() => document.getElementById("stl-file-input").click()}
                style={{
                  border: "2px dashed",
                  borderColor: dragOver ? "#F97316" : stlData ? "#22C55E" : parseError ? "#EF4444" : "#E2E8F0",
                  borderRadius: "14px",
                  background: dragOver ? "#FFF7ED" : stlData ? "#F0FDF4" : "#F8FAFC",
                  padding: "2rem 1.5rem",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.25s",
                }}
              >
                <input id="stl-file-input" type="file" accept=".stl"
                  onChange={(e) => handleFile(e.target.files[0])}
                  style={{ display: "none" }} />

                {stlData ? (
                  <>
                    <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>✅</div>
                    <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "600", fontSize: "0.95rem", color: "#15803D" }}>{file.name}</p>
                    <p style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "0.68rem", color: "#86EFAC", marginTop: "0.25rem" }}>
                      {(file.size / 1024 / 1024).toFixed(2)} MB · {stlData.triangle_count.toLocaleString("es-MX")} triángulos
                    </p>
                    <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); setStlData(null); setPricing(null); setParseError("") }}
                      style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.75rem", color: "#94A3B8", background: "none", border: "none", cursor: "pointer", marginTop: "0.5rem", textDecoration: "underline" }}>
                      Cambiar archivo
                    </button>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: "2rem", marginBottom: "0.6rem" }}>📤</div>
                    <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "600", fontSize: "0.95rem", color: "#1E293B", marginBottom: "0.25rem" }}>
                      Arrastra tu archivo STL aquí
                    </p>
                    <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.82rem", color: "#94A3B8" }}>
                      o <span style={{ color: "#F97316", fontWeight: "600" }}>haz clic para seleccionar</span>
                    </p>
                    <p style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "0.62rem", color: "#CBD5E1", marginTop: "0.6rem", letterSpacing: "0.06em" }}>
                      STL · máx. 50 MB
                    </p>
                  </>
                )}
              </div>

              {parseError && (
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.8rem", color: "#EF4444", marginTop: "0.5rem" }}>⚠️ {parseError}</p>
              )}

              {/* Other formats note */}
              {!stlData && (
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.78rem", color: "#94A3B8", marginTop: "0.75rem" }}>
                  ¿Tienes STEP, OBJ o 3MF?{" "}
                  <Link href="/contact" style={{ color: "#F97316", textDecoration: "none", fontWeight: "600" }}>Contáctanos</Link>
                  {" "}y te cotizamos manualmente.
                </p>
              )}

              {/* 3D Preview */}
              {stlData && (
                <div style={{ marginTop: "1.25rem" }}>
                  <StlViewer positions={stlData.positions} />
                  <DimensionsBadge dims={stlData.dimensions} volume={stlData.volume_cm3} />
                </div>
              )}
            </div>

            {/* Material selector */}
            <div style={sectionStyle(!stlData)}>
              <SectionHeader icon="🧪" title="Material" subtitle={selectedMat ? `${selectedMat.name} · $${selectedMat.price_per_gram}/g` : "Selecciona el material para tu pieza"} />

              {materialsLoading ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
                  {[1,2,3,4,5,6].map((i) => (
                    <div key={i} style={{ height: "70px", borderRadius: "12px", background: "#F1F5F9", animation: "pulse-skeleton 1.5s ease-in-out infinite" }} />
                  ))}
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }} className="ol-materials-grid">
                  {materials.map((mat) => {
                    const sel = mat.id === selectedMaterialId
                    return (
                      <button
                        key={mat.id}
                        type="button"
                        onClick={() => setSelectedMaterialId(mat.id)}
                        style={{
                          background: sel ? "#FFF7ED" : "#F8FAFC",
                          border: `2px solid ${sel ? "#F97316" : "#E2E8F0"}`,
                          borderRadius: "12px",
                          padding: "0.75rem 0.6rem",
                          cursor: "pointer",
                          textAlign: "left",
                          transition: "all 0.18s",
                        }}
                      >
                        <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "700", fontSize: "0.88rem", color: sel ? "#EA580C" : "#1E293B", marginBottom: "2px" }}>{mat.name}</p>
                        <p style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "0.65rem", color: sel ? "#F97316" : "#94A3B8" }}>${mat.price_per_gram}/g</p>
                        {mat.description && (
                          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.7rem", color: "#64748B", marginTop: "4px", lineHeight: "1.3" }}>{mat.description}</p>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Parameters */}
            <div style={sectionStyle(!stlData)}>
              <SectionHeader icon="⚙️" title="Parámetros de impresión" />

              {/* Infill */}
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                  <label style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "600", fontSize: "0.875rem", color: "#374151" }}>
                    Relleno (Infill)
                  </label>
                  <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "0.875rem", color: "#F97316", fontWeight: "600", background: "#FFF7ED", border: "1px solid #FED7AA", padding: "2px 10px", borderRadius: "20px" }}>
                    {infill}%
                  </span>
                </div>
                <input type="range" min="10" max="100" step="5"
                  value={infill}
                  onChange={(e) => setInfill(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "#F97316" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.35rem" }}>
                  {[["10%", "Mínimo"], ["20%", "Estándar"], ["50%", "Robusto"], ["100%", "Sólido"]].map(([val, lbl]) => (
                    <span key={val} style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.68rem", color: "#94A3B8", textAlign: "center" }}>{val}<br />{lbl}</span>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "600", fontSize: "0.875rem", color: "#374151", display: "block", marginBottom: "0.75rem" }}>
                  Cantidad de piezas
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <button type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    style={{ width: "40px", height: "40px", borderRadius: "10px", border: "1.5px solid #E2E8F0", background: "#F8FAFC", fontSize: "1.25rem", cursor: "pointer", color: "#374151", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "600" }}>−</button>
                  <input type="number" min="1" max="999" value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    style={{ width: "80px", textAlign: "center", fontFamily: "'Outfit', sans-serif", fontWeight: "700", fontSize: "1.1rem", color: "#1E293B", border: "1.5px solid #E2E8F0", borderRadius: "10px", padding: "0.5rem", outline: "none" }}
                    onFocus={(e) => e.target.style.borderColor = "#F97316"}
                    onBlur={(e) => e.target.style.borderColor = "#E2E8F0"}
                  />
                  <button type="button"
                    onClick={() => setQuantity((q) => Math.min(999, q + 1))}
                    style={{ width: "40px", height: "40px", borderRadius: "10px", border: "1.5px solid #E2E8F0", background: "#F8FAFC", fontSize: "1.25rem", cursor: "pointer", color: "#374151", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "600" }}>+</button>
                  {quantity > 1 && (
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.82rem", color: "#64748B" }}>
                      {fmt(pricing?.price_per_unit ?? 0)}/pza
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Confirm form */}
            <div ref={confirmRef} style={sectionStyle(!hasPrice)}>
              <SectionHeader icon="📋" title="Confirmar pedido" subtitle="Completa tus datos para guardar la cotización" />

              <form onSubmit={handleConfirm} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }} className="ol-confirm-grid">
                  <FormField label="Nombre completo" required error={formErrors.name}>
                    <input value={customerName} onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Carlos García"
                      style={{ ...inputStyle, borderColor: formErrors.name ? "#EF4444" : "#E2E8F0" }}
                      onFocus={(e) => e.target.style.borderColor = "#F97316"}
                      onBlur={(e) => e.target.style.borderColor = formErrors.name ? "#EF4444" : "#E2E8F0"}
                    />
                  </FormField>
                  <FormField label="Email" required error={formErrors.email}>
                    <input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="carlos@empresa.com"
                      style={{ ...inputStyle, borderColor: formErrors.email ? "#EF4444" : "#E2E8F0" }}
                      onFocus={(e) => e.target.style.borderColor = "#F97316"}
                      onBlur={(e) => e.target.style.borderColor = formErrors.email ? "#EF4444" : "#E2E8F0"}
                    />
                  </FormField>
                </div>
                <FormField label="Notas adicionales" hint="Tolerancias, uso final, acabado deseado...">
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ej: El agujero central necesita exactamente 12mm. La pieza va en exterior con rayos UV."
                    rows={3}
                    style={{ ...inputStyle, resize: "vertical", lineHeight: "1.6" }}
                    onFocus={(e) => e.target.style.borderColor = "#F97316"}
                    onBlur={(e) => e.target.style.borderColor = "#E2E8F0"}
                  />
                </FormField>

                {submitError && (
                  <div style={{ background: "#FFF1F2", border: "1px solid #FECDD3", borderRadius: "10px", padding: "0.875rem 1rem" }}>
                    <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.82rem", color: "#E11D48" }}>⚠️ {submitError}</p>
                  </div>
                )}

                <div style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap" }}>
                  <button type="submit" disabled={submitting}
                    style={{
                      flex: 1, minWidth: "200px",
                      fontFamily: "'Outfit', sans-serif", fontWeight: "700", fontSize: "0.95rem",
                      background: submitting ? "#FDBA74" : "#F97316",
                      color: "#fff", padding: "0.9rem 1.5rem", borderRadius: "12px", border: "none",
                      cursor: submitting ? "not-allowed" : "pointer",
                      boxShadow: "0 4px 14px rgba(249,115,22,0.3)",
                    }}>
                    {submitting ? "Guardando..." : "Confirmar pedido →"}
                  </button>
                  <Link href="/contact"
                    style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "600", fontSize: "0.9rem", background: "#fff", color: "#64748B", padding: "0.9rem 1.25rem", borderRadius: "12px", border: "1px solid #E2E8F0", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    💬 Hablar con un asesor
                  </Link>
                </div>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.72rem", color: "#94A3B8" }}>
                  Al confirmar aceptas nuestra política de privacidad. Solo contactaremos por el pedido.
                </p>
              </form>
            </div>
          </div>

          {/* ── RIGHT COLUMN — sticky price card ──────────────────────────── */}
          <div style={{ position: "sticky", top: "88px" }}>
            <div style={{ background: stlData && !pricingLoading && pricing ? "linear-gradient(160deg, #fff 40%, #FFF7ED 100%)" : "#fff", border: "1px solid #E2E8F0", borderRadius: "24px", padding: "1.75rem", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <p style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "0.65rem", color: "#94A3B8", letterSpacing: "0.12em", marginBottom: "1.25rem" }}>// PRECIO ESTIMADO</p>

              {!stlData && (
                <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>📐</div>
                  <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.9rem", color: "#64748B" }}>Sube un archivo STL<br />para ver el precio al instante</p>
                </div>
              )}

              {stlData && !selectedMaterialId && (
                <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🧪</div>
                  <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.9rem", color: "#64748B" }}>Selecciona un material</p>
                </div>
              )}

              {stlData && selectedMaterialId && pricingLoading && (
                <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.9rem", color: "#94A3B8" }}>Calculando...</div>
                </div>
              )}

              {hasPrice && (
                <>
                  {/* Total */}
                  <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                    <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(2rem, 4vw, 2.75rem)", fontWeight: "800", color: "#0F172A", letterSpacing: "-0.03em", lineHeight: 1 }}>
                      {fmt(pricing.total)}
                    </p>
                    {quantity > 1 && (
                      <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.85rem", color: "#64748B", marginTop: "0.3rem" }}>
                        {fmt(pricing.price_per_unit)} × {quantity} piezas
                      </p>
                    )}
                    <p style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "0.65rem", color: "#F97316", marginTop: "0.4rem", letterSpacing: "0.06em" }}>MXN · PRECIO ESTIMADO</p>
                  </div>

                  {/* Breakdown */}
                  <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: "1rem", marginBottom: "1.25rem" }}>
                    <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.75rem", fontWeight: "600", color: "#94A3B8", letterSpacing: "0.06em", marginBottom: "0.75rem" }}>DESGLOSE</p>
                    {[
                      [`Peso estimado`, `${pricing.weight_grams} g`],
                      [`Tiempo de impresión`, `${pricing.print_time_hours} h`],
                      [`Material (${selectedMat?.name})`, fmt(pricing.breakdown.material_cost)],
                      [`Tiempo máquina`, fmt(pricing.breakdown.machine_cost)],
                      [`Setup`, fmt(pricing.breakdown.setup_cost)],
                    ].map(([k, v]) => (
                      <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "0.3rem 0" }}>
                        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.8rem", color: "#64748B" }}>{k}</span>
                        <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "0.78rem", color: "#0F172A" }}>{v}</span>
                      </div>
                    ))}
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderTop: "1px dashed #E2E8F0", marginTop: "0.25rem" }}>
                      <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.82rem", color: "#374151", fontWeight: "600" }}>Total por pieza</span>
                      <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "0.82rem", color: "#F97316", fontWeight: "700" }}>{fmt(pricing.price_per_unit)}</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <button
                    type="button"
                    onClick={() => confirmRef.current?.scrollIntoView({ behavior: "smooth" })}
                    style={{
                      width: "100%", fontFamily: "'Outfit', sans-serif", fontWeight: "700", fontSize: "0.95rem",
                      background: "#F97316", color: "#fff", padding: "0.875rem", borderRadius: "12px",
                      border: "none", cursor: "pointer", boxShadow: "0 4px 14px rgba(249,115,22,0.3)",
                      marginBottom: "0.75rem",
                    }}>
                    Confirmar pedido →
                  </button>
                  <Link href="/contact"
                    style={{ display: "block", textAlign: "center", fontFamily: "'Outfit', sans-serif", fontWeight: "600", fontSize: "0.85rem", color: "#64748B", textDecoration: "none", padding: "0.6rem", border: "1px solid #E2E8F0", borderRadius: "10px", background: "#F8FAFC" }}>
                    💬 Hablar con un asesor
                  </Link>
                </>
              )}

              {/* Trust badges */}
              <div style={{ borderTop: "1px solid #F1F5F9", marginTop: "1.25rem", paddingTop: "1rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {[["🔒", "Precio sin compromiso"], ["⚡", "Entrega en 3–7 días hábiles"], ["✅", "Garantía de calidad incluida"]].map(([icon, text]) => (
                  <div key={text} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontSize: "0.85rem" }}>{icon}</span>
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.78rem", color: "#64748B" }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

    </>
  )
}

// ─── SMALL COMPONENTS ─────────────────────────────────────────────────────────
function SectionHeader({ icon, title, subtitle }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "0.625rem", marginBottom: "1.25rem", paddingBottom: "0.875rem", borderBottom: "1px solid #F1F5F9" }}>
      <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>{icon}</span>
      <div>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "700", fontSize: "1rem", color: "#0F172A", margin: 0 }}>{title}</h2>
        {subtitle && <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.78rem", color: "#94A3B8", margin: "2px 0 0" }}>{subtitle}</p>}
      </div>
    </div>
  )
}

function DimensionsBadge({ dims, volume }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.875rem" }}>
      {[
        ["Ancho", `${dims.x} cm`],
        ["Prof.", `${dims.y} cm`],
        ["Alto", `${dims.z} cm`],
        ["Volumen", `${volume} cm³`],
      ].map(([k, v]) => (
        <span key={k} style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "0.68rem", color: "#475569", background: "#F1F5F9", border: "1px solid #E2E8F0", borderRadius: "6px", padding: "3px 8px" }}>
          {k}: <strong style={{ color: "#0F172A" }}>{v}</strong>
        </span>
      ))}
    </div>
  )
}

function FormField({ label, required, hint, error, children }) {
  return (
    <div>
      <label style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.875rem", fontWeight: "600", color: "#374151", marginBottom: "0.4rem", display: "block" }}>
        {label}{required && <span style={{ color: "#F97316", marginLeft: "3px" }}>*</span>}
      </label>
      {hint && <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.75rem", color: "#94A3B8", marginBottom: "0.4rem" }}>{hint}</p>}
      {children}
      {error && <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.75rem", color: "#EF4444", marginTop: "0.3rem" }}>{error}</p>}
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
  transition: "border-color 0.2s",
  boxSizing: "border-box",
}

