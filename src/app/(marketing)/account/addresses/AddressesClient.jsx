"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import AddressForm, { EMPTY_ADDRESS, validateAddress } from "@/components/AddressForm"

const fmt = addr =>
  `${addr.street} #${addr.exterior_number}${addr.interior_number ? ` Int. ${addr.interior_number}` : ""}, ${addr.neighborhood}, ${addr.city}, ${addr.state} C.P. ${addr.postal_code}`

// ─── Address card ─────────────────────────────────────────────────────────────
function AddressCard({ addr, onEdit, onDelete, onSetDefault, deleting, setting }) {
  return (
    <div style={{
      background: "#fff",
      border: `1.5px solid ${addr.is_default ? "#F97316" : "#E2E8F0"}`,
      borderRadius: "16px",
      padding: "1.25rem 1.5rem",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem", flexWrap: "wrap" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.375rem" }}>
            <p style={{ fontWeight: "700", fontSize: "0.95rem", color: "#0F172A", margin: 0 }}>
              {addr.recipient_name}
            </p>
            {addr.is_default && (
              <span style={{ background: "#F97316", color: "#fff", fontSize: "0.65rem", fontWeight: "700", padding: "0.1rem 0.5rem", borderRadius: "999px" }}>
                Principal
              </span>
            )}
          </div>
          <p style={{ fontSize: "0.85rem", color: "#64748B", margin: "0 0 0.2rem", lineHeight: "1.5" }}>
            {fmt(addr)}
          </p>
          <p style={{ fontSize: "0.82rem", color: "#94A3B8", margin: 0 }}>
            Tel: {addr.phone}
          </p>
          {addr.references && (
            <p style={{ fontSize: "0.8rem", color: "#94A3B8", margin: "0.25rem 0 0", fontStyle: "italic" }}>
              Ref: {addr.references}
            </p>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0, flexWrap: "wrap" }}>
          {!addr.is_default && (
            <button
              onClick={() => onSetDefault(addr.id)}
              disabled={setting}
              style={btnStyle("ghost")}
            >
              {setting ? "..." : "Predeterminar"}
            </button>
          )}
          <button onClick={() => onEdit(addr)} style={btnStyle("ghost")}>
            Editar
          </button>
          <button
            onClick={() => onDelete(addr.id)}
            disabled={deleting}
            style={btnStyle("danger")}
          >
            {deleting ? "..." : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  )
}

function btnStyle(variant) {
  const base = {
    fontFamily: "'Outfit', sans-serif",
    fontWeight: "600",
    fontSize: "0.8rem",
    padding: "0.45rem 0.875rem",
    borderRadius: "8px",
    cursor: "pointer",
    border: "none",
    transition: "background 0.2s",
  }
  if (variant === "ghost") return { ...base, background: "#F1F5F9", color: "#475569" }
  if (variant === "danger") return { ...base, background: "#FFF1F2", color: "#BE123C" }
  if (variant === "primary") return { ...base, background: "#F97316", color: "#fff", boxShadow: "0 4px 12px rgba(249,115,22,0.25)" }
  return base
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function AddressesClient({ user, initialAddresses }) {
  const [addresses, setAddresses] = useState(initialAddresses)
  const [showForm,  setShowForm]  = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formVals,  setFormVals]  = useState(EMPTY_ADDRESS)
  const [errors,    setErrors]    = useState({})
  const [cpLoading, setCpLoading] = useState(false)
  const [saving,    setSaving]    = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [settingId,  setSettingId]  = useState(null)

  function handleChange(field, value) {
    setFormVals(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n })
  }

  function handleCpLookup({ state, city, neighborhood }) {
    setFormVals(prev => ({
      ...prev,
      state:        state        || prev.state,
      city:         city         || prev.city,
      neighborhood: neighborhood || prev.neighborhood,
    }))
  }

  function openNew() {
    setEditingId(null)
    setFormVals(EMPTY_ADDRESS)
    setErrors({})
    setShowForm(true)
  }

  function openEdit(addr) {
    setEditingId(addr.id)
    setFormVals({
      recipient_name:        addr.recipient_name,
      phone:                 addr.phone,
      street:                addr.street,
      exterior_number:       addr.exterior_number,
      interior_number:       addr.interior_number || "",
      neighborhood:          addr.neighborhood,
      postal_code:           addr.postal_code,
      city:                  addr.city,
      state:                 addr.state,
      references:            addr.references || "",
      delivery_instructions: addr.delivery_instructions || "",
      is_default:            addr.is_default,
    })
    setErrors({})
    setShowForm(true)
  }

  function cancelForm() {
    setShowForm(false)
    setEditingId(null)
    setErrors({})
  }

  async function handleSave() {
    const errs = validateAddress(formVals)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setSaving(true)

    try {
      if (formVals.is_default) {
        await supabase
          .from("shipping_addresses")
          .update({ is_default: false })
          .eq("user_id", user.id)
      }

      if (editingId) {
        const { data, error } = await supabase
          .from("shipping_addresses")
          .update({ ...formVals })
          .eq("id", editingId)
          .eq("user_id", user.id)
          .select()
          .single()

        if (error) { setErrors({ _general: error.message }); return }
        setAddresses(prev => {
          const updated = prev.map(a => {
            if (formVals.is_default) return a.id === editingId ? data : { ...a, is_default: false }
            return a.id === editingId ? data : a
          })
          return updated
        })
      } else {
        const { data, error } = await supabase
          .from("shipping_addresses")
          .insert({ ...formVals, user_id: user.id })
          .select()
          .single()

        if (error) { setErrors({ _general: error.message }); return }
        setAddresses(prev => {
          const updated = formVals.is_default
            ? prev.map(a => ({ ...a, is_default: false }))
            : [...prev]
          return [data, ...updated.filter(a => a.id !== data.id)]
        })
      }

      setShowForm(false)
      setEditingId(null)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm("¿Eliminar esta dirección?")) return
    setDeletingId(id)
    const { error } = await supabase
      .from("shipping_addresses")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id)

    if (!error) setAddresses(prev => prev.filter(a => a.id !== id))
    setDeletingId(null)
  }

  async function handleSetDefault(id) {
    setSettingId(id)
    await supabase
      .from("shipping_addresses")
      .update({ is_default: false })
      .eq("user_id", user.id)

    const { error } = await supabase
      .from("shipping_addresses")
      .update({ is_default: true })
      .eq("id", id)
      .eq("user_id", user.id)

    if (!error) {
      setAddresses(prev => prev.map(a => ({ ...a, is_default: a.id === id })))
    }
    setSettingId(null)
  }

  return (
    <div>
      {/* Empty state */}
      {addresses.length === 0 && !showForm && (
        <div style={{
          textAlign: "center",
          padding: "4rem 2rem",
          background: "#fff",
          borderRadius: "20px",
          border: "1px solid #E2E8F0",
        }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📬</div>
          <p style={{ fontWeight: "700", fontSize: "1.1rem", color: "#0F172A", marginBottom: "0.5rem" }}>
            Sin direcciones guardadas
          </p>
          <p style={{ fontSize: "0.875rem", color: "#64748B", marginBottom: "1.75rem" }}>
            Agrega tu primera dirección de envío.
          </p>
          <button onClick={openNew} style={{ ...btnStyle("primary"), fontSize: "0.9rem", padding: "0.7rem 1.5rem" }}>
            + Agregar dirección
          </button>
        </div>
      )}

      {/* Address list */}
      {addresses.length > 0 && !showForm && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {addresses.map(addr => (
            <AddressCard
              key={addr.id}
              addr={addr}
              onEdit={openEdit}
              onDelete={handleDelete}
              onSetDefault={handleSetDefault}
              deleting={deletingId === addr.id}
              setting={settingId === addr.id}
            />
          ))}
          <button
            onClick={openNew}
            style={{
              width: "100%", padding: "0.875rem",
              border: "2px dashed #CBD5E1", borderRadius: "16px",
              background: "transparent", color: "#64748B",
              fontFamily: "'Outfit', sans-serif", fontWeight: "600", fontSize: "0.875rem",
              cursor: "pointer",
            }}
          >
            + Agregar nueva dirección
          </button>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid #E2E8F0", padding: "2rem" }}>
          <h2 style={{ fontWeight: "700", fontSize: "1.1rem", color: "#0F172A", margin: "0 0 1.75rem" }}>
            {editingId ? "Editar dirección" : "Nueva dirección"}
          </h2>

          <AddressForm
            values={formVals}
            errors={errors}
            onChange={handleChange}
            onCpLookup={handleCpLookup}
            cpLoading={cpLoading}
          />

          <div style={{ display: "flex", gap: "0.875rem", marginTop: "1.75rem", justifyContent: "flex-end" }}>
            <button onClick={cancelForm} style={btnStyle("ghost")}>
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{ ...btnStyle("primary"), opacity: saving ? 0.7 : 1, cursor: saving ? "not-allowed" : "pointer" }}
            >
              {saving ? "Guardando..." : editingId ? "Guardar cambios" : "Guardar dirección"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
