"use client"

import { MEXICAN_STATES } from "@/lib/mexicanStates"

const EMPTY_ADDRESS = {
  recipient_name: "",
  phone: "",
  street: "",
  exterior_number: "",
  interior_number: "",
  neighborhood: "",
  postal_code: "",
  city: "",
  state: "",
  references: "",
  delivery_instructions: "",
  is_default: false,
}

export { EMPTY_ADDRESS }

export function validateAddress(form) {
  const errors = {}
  if (!form.recipient_name?.trim()) errors.recipient_name = "Nombre requerido"
  if (!form.phone?.trim()) {
    errors.phone = "Teléfono requerido"
  } else if (!/^\d[\d\s\-().]{8,14}$/.test(form.phone.replace(/\s/g, ""))) {
    errors.phone = "Teléfono inválido (min. 10 dígitos)"
  }
  if (!form.street?.trim()) errors.street = "Calle requerida"
  if (!form.exterior_number?.trim()) errors.exterior_number = "Número exterior requerido"
  if (!form.neighborhood?.trim()) errors.neighborhood = "Colonia requerida"
  if (!form.postal_code?.trim()) {
    errors.postal_code = "Código postal requerido"
  } else if (!/^\d{5}$/.test(form.postal_code)) {
    errors.postal_code = "Debe tener exactamente 5 dígitos"
  }
  if (!form.city?.trim()) errors.city = "Ciudad/Municipio requerido"
  if (!form.state?.trim()) errors.state = "Estado requerido"
  return errors
}

/**
 * Reusable address form.
 *
 * Props:
 *   values        — current form object (use EMPTY_ADDRESS as initial value)
 *   errors        — { field: "message" } validation errors
 *   onChange      — (field, value) => void
 *   onCpLookup    — ({ state, city, neighborhood }) => void  (called after successful CP lookup)
 *   cpLoading     — boolean
 */
export default function AddressForm({ values, errors = {}, onChange, onCpLookup, cpLoading }) {
  function field(name, hasError) {
    return {
      style: {
        width: "100%",
        boxSizing: "border-box",
        border: `1.5px solid ${hasError || errors[name] ? "#F87171" : "#E2E8F0"}`,
        borderRadius: "10px",
        padding: "0.7rem 0.875rem",
        fontSize: "0.875rem",
        fontFamily: "'Outfit', sans-serif",
        color: "#0F172A",
        outline: "none",
        background: "#fff",
        transition: "border-color 0.2s",
      },
      onFocus: e  => { e.target.style.borderColor = errors[name] ? "#F87171" : "#F97316" },
      onBlur:  e  => { e.target.style.borderColor = errors[name] ? "#F87171" : "#E2E8F0" },
    }
  }

  const label = {
    display: "block",
    fontSize: "0.8rem",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "0.4rem",
  }

  const errMsg = {
    fontSize: "0.75rem",
    color: "#DC2626",
    marginTop: "0.3rem",
    marginBottom: 0,
  }

  async function handleCpChange(e) {
    const cp = e.target.value.replace(/\D/g, "").slice(0, 5)
    onChange("postal_code", cp)
    if (cp.length === 5 && onCpLookup) {
      try {
        const res = await fetch(
          `https://api.copomex.com/query/info_cp/${cp}?token=pruebas`
        )
        if (!res.ok) return
        const data = await res.json()
        const r = Array.isArray(data?.response) ? data.response[0] : data?.response
        if (r) {
          onCpLookup({
            state:        r.estado     || "",
            city:         r.municipio  || r.ciudad || "",
            neighborhood: r.asentamiento || "",
          })
        }
      } catch {
        // Silently fail — user can type manually
      }
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

      {errors._general && (
        <div style={{
          background: "#FFF1F2", border: "1px solid #FECDD3",
          borderRadius: "10px", padding: "0.875rem 1rem",
          fontSize: "0.875rem", color: "#BE123C",
        }}>
          {errors._general}
        </div>
      )}

      {/* Recipient name */}
      <div>
        <label style={label}>Nombre completo del destinatario *</label>
        <input
          value={values.recipient_name}
          onChange={e => onChange("recipient_name", e.target.value)}
          placeholder="Juan García López"
          {...field("recipient_name")}
        />
        {errors.recipient_name && <p style={errMsg}>{errors.recipient_name}</p>}
      </div>

      {/* Phone */}
      <div>
        <label style={label}>Teléfono *</label>
        <input
          value={values.phone}
          onChange={e => onChange("phone", e.target.value)}
          placeholder="443 123 4567"
          {...field("phone")}
        />
        {errors.phone && <p style={errMsg}>{errors.phone}</p>}
      </div>

      {/* Street */}
      <div>
        <label style={label}>Calle *</label>
        <input
          value={values.street}
          onChange={e => onChange("street", e.target.value)}
          placeholder="Av. Madero"
          {...field("street")}
        />
        {errors.street && <p style={errMsg}>{errors.street}</p>}
      </div>

      {/* Exterior + Interior */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }} className="addr-two-col">
        <div>
          <label style={label}>Número exterior *</label>
          <input
            value={values.exterior_number}
            onChange={e => onChange("exterior_number", e.target.value)}
            placeholder="123"
            {...field("exterior_number")}
          />
          {errors.exterior_number && <p style={errMsg}>{errors.exterior_number}</p>}
        </div>
        <div>
          <label style={label}>Número interior</label>
          <input
            value={values.interior_number}
            onChange={e => onChange("interior_number", e.target.value)}
            placeholder="Depto. 4B"
            {...field("interior_number")}
          />
        </div>
      </div>

      {/* Postal code */}
      <div>
        <label style={label}>
          Código postal *
          {cpLoading && (
            <span style={{ marginLeft: "0.5rem", fontSize: "0.7rem", color: "#94A3B8", fontWeight: 400 }}>
              Buscando colonia...
            </span>
          )}
        </label>
        <input
          value={values.postal_code}
          onChange={handleCpChange}
          placeholder="58000"
          maxLength={5}
          inputMode="numeric"
          {...field("postal_code")}
        />
        {errors.postal_code && <p style={errMsg}>{errors.postal_code}</p>}
      </div>

      {/* Neighborhood */}
      <div>
        <label style={label}>Colonia *</label>
        <input
          value={values.neighborhood}
          onChange={e => onChange("neighborhood", e.target.value)}
          placeholder="Centro Histórico"
          {...field("neighborhood")}
        />
        {errors.neighborhood && <p style={errMsg}>{errors.neighborhood}</p>}
      </div>

      {/* City */}
      <div>
        <label style={label}>Ciudad / Municipio *</label>
        <input
          value={values.city}
          onChange={e => onChange("city", e.target.value)}
          placeholder="Morelia"
          {...field("city")}
        />
        {errors.city && <p style={errMsg}>{errors.city}</p>}
      </div>

      {/* State */}
      <div>
        <label style={label}>Estado *</label>
        <select
          value={values.state}
          onChange={e => onChange("state", e.target.value)}
          style={{
            ...field("state").style,
            appearance: "none",
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 0.875rem center",
            paddingRight: "2.25rem",
          }}
          onFocus={field("state").onFocus}
          onBlur={field("state").onBlur}
        >
          <option value="">Selecciona un estado</option>
          {MEXICAN_STATES.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        {errors.state && <p style={errMsg}>{errors.state}</p>}
      </div>

      {/* References */}
      <div>
        <label style={label}>Referencias</label>
        <textarea
          value={values.references}
          onChange={e => onChange("references", e.target.value)}
          placeholder="Ej: Casa blanca con portón café, entre calle X y Y"
          rows={2}
          style={{ ...field("references").style, resize: "vertical", lineHeight: "1.6" }}
          onFocus={field("references").onFocus}
          onBlur={field("references").onBlur}
        />
      </div>

      {/* Delivery instructions */}
      <div>
        <label style={label}>Instrucciones de entrega</label>
        <textarea
          value={values.delivery_instructions}
          onChange={e => onChange("delivery_instructions", e.target.value)}
          placeholder="Ej: Tocar timbre dos veces, dejar con vecino si no hay nadie"
          rows={2}
          style={{ ...field("delivery_instructions").style, resize: "vertical", lineHeight: "1.6" }}
          onFocus={field("delivery_instructions").onFocus}
          onBlur={field("delivery_instructions").onBlur}
        />
      </div>

      {/* Default checkbox */}
      <label style={{ display: "flex", alignItems: "center", gap: "0.625rem", cursor: "pointer", userSelect: "none" }}>
        <input
          type="checkbox"
          checked={values.is_default}
          onChange={e => onChange("is_default", e.target.checked)}
          style={{ width: "16px", height: "16px", accentColor: "#F97316", cursor: "pointer" }}
        />
        <span style={{ fontSize: "0.875rem", color: "#374151" }}>
          Guardar como dirección predeterminada
        </span>
      </label>

      <style>{`
        @media (max-width: 480px) {
          .addr-two-col { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
