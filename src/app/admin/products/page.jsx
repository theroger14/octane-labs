"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

const MATERIALS = [
  "PLA", "PLA+", "PETG", "ABS", "ASA", "TPU",
  "Nylon PA12", "Resina Standard", "Resina ABS-Like", "Resina Flexible",
]

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  material: "",
  category: "",
  image_url: "",
  available: true,
}

export default function ProductsAdminPage() {
  const [products, setProducts]       = useState([])
  const [loading, setLoading]         = useState(true)
  const [modalOpen, setModalOpen]     = useState(false)
  const [editing, setEditing]         = useState(null)
  const [form, setForm]               = useState(EMPTY_FORM)
  const [saving, setSaving]           = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [imageFile, setImageFile]     = useState(null)
  const [uploadingImg, setUploadingImg] = useState(false)
  const [userEmail, setUserEmail]     = useState("")
  const [error, setError]             = useState("")
  const fileRef                       = useRef(null)
  const router                        = useRouter()

  useEffect(() => {
    getUser()
    fetchProducts()
  }, [])

  async function getUser() {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) setUserEmail(user.email)
  }

  async function fetchProducts() {
    setLoading(true)
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
    if (!error) setProducts(data || [])
    setLoading(false)
  }

  function openNew() {
    setEditing(null)
    setForm(EMPTY_FORM)
    setImageFile(null)
    setError("")
    setModalOpen(true)
  }

  function openEdit(product) {
    setEditing(product)
    setForm({
      name:        product.name        || "",
      description: product.description || "",
      price:       product.price       || "",
      material:    product.material    || "",
      category:    product.category    || "",
      image_url:   product.image_url   || "",
      available:   product.available   ?? true,
    })
    setImageFile(null)
    setError("")
    setModalOpen(true)
  }

  async function uploadImage() {
    if (!imageFile) return null
    setUploadingImg(true)
    const ext      = imageFile.name.split(".").pop()
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage
      .from("product-images")
      .upload(filename, imageFile, { contentType: imageFile.type })
    setUploadingImg(false)
    if (error) {
      setError("Error al subir imagen: " + error.message)
      return null
    }
    const { data: { publicUrl } } = supabase.storage
      .from("product-images")
      .getPublicUrl(filename)
    return publicUrl
  }

  async function handleSave() {
    if (!form.name.trim()) { setError("El nombre es requerido"); return }
    setSaving(true)
    setError("")

    let imageUrl = form.image_url
    if (imageFile) {
      const uploaded = await uploadImage()
      if (uploaded) imageUrl = uploaded
    }

    const payload = {
      name:        form.name.trim(),
      description: form.description.trim() || null,
      price:       form.price ? Number(form.price) : null,
      material:    form.material || null,
      category:    form.category.trim() || null,
      image_url:   imageUrl || null,
      available:   form.available,
    }

    if (editing) {
      const { error } = await supabase.from("products").update(payload).eq("id", editing.id)
      if (error) { setError(error.message); setSaving(false); return }
      setProducts(prev => prev.map(p => p.id === editing.id ? { ...p, ...payload } : p))
    } else {
      const { data, error } = await supabase.from("products").insert(payload).select().single()
      if (error) { setError(error.message); setSaving(false); return }
      setProducts(prev => [data, ...prev])
    }

    setSaving(false)
    setModalOpen(false)
    fetch("/api/revalidate", { method: "POST" })
  }

  async function handleDelete(id) {
    await supabase.from("products").delete().eq("id", id)
    setProducts(prev => prev.filter(p => p.id !== id))
    setDeleteConfirm(null)
    fetch("/api/revalidate", { method: "POST" })
  }

  async function toggleAvailable(product) {
    const next = !product.available
    await supabase.from("products").update({ available: next }).eq("id", product.id)
    setProducts(prev => prev.map(p => p.id === product.id ? { ...p, available: next } : p))
    fetch("/api/revalidate", { method: "POST" })
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/admin/login")
  }

  const published   = products.filter(p => p.available).length
  const unpublished = products.length - published

  return (
    <div className="min-h-screen bg-zinc-50">

      {/* Header */}
      <header className="bg-white border-b border-zinc-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-bold text-zinc-900">Octane Labs — Admin</h1>
            <p className="text-xs text-zinc-500">{userEmail}</p>
          </div>
          <div className="flex items-center gap-4">
            <a href="/admin/dashboard" className="text-sm text-zinc-600 hover:text-zinc-900 transition">
              Cotizaciones
            </a>
            <a href="/shop" target="_blank" className="text-sm text-zinc-600 hover:text-zinc-900 transition">
              Ver tienda
            </a>
            <button
              onClick={handleLogout}
              className="text-sm font-medium bg-zinc-900 text-white px-4 py-2 rounded-lg hover:bg-zinc-800 transition"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-zinc-200 p-5">
            <p className="text-sm text-zinc-500">Total</p>
            <p className="text-3xl font-bold mt-1 text-zinc-900">{products.length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-zinc-200 p-5">
            <p className="text-sm text-zinc-500">Publicados</p>
            <p className="text-3xl font-bold mt-1 text-green-600">{published}</p>
          </div>
          <div className="bg-white rounded-2xl border border-zinc-200 p-5">
            <p className="text-sm text-zinc-500">Ocultos</p>
            <p className="text-3xl font-bold mt-1 text-zinc-400">{unpublished}</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-zinc-900">Productos</h2>
          <button
            onClick={openNew}
            className="text-sm font-medium bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
          >
            + Nuevo producto
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
          {loading && (
            <div className="p-12 text-center text-zinc-400 text-sm">Cargando productos...</div>
          )}
          {!loading && products.length === 0 && (
            <div className="p-12 text-center text-zinc-400 text-sm">
              No hay productos aún. Creá el primero con "+ Nuevo producto".
            </div>
          )}
          {!loading && products.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 bg-zinc-50">
                    <th className="text-left px-4 py-3 font-medium text-zinc-500 w-16">Foto</th>
                    <th className="text-left px-4 py-3 font-medium text-zinc-500">Nombre</th>
                    <th className="text-left px-4 py-3 font-medium text-zinc-500">Categoría</th>
                    <th className="text-left px-4 py-3 font-medium text-zinc-500">Material</th>
                    <th className="text-left px-4 py-3 font-medium text-zinc-500">Precio</th>
                    <th className="text-left px-4 py-3 font-medium text-zinc-500">Estado</th>
                    <th className="text-left px-4 py-3 font-medium text-zinc-500">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {products.map(product => (
                    <tr key={product.id} className="hover:bg-zinc-50">
                      <td className="px-4 py-3">
                        <div className="w-12 h-12 rounded-lg bg-zinc-100 overflow-hidden flex items-center justify-center flex-shrink-0">
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                            </svg>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-zinc-900">{product.name}</p>
                        {product.description && (
                          <p className="text-xs text-zinc-400 mt-0.5 max-w-xs truncate">{product.description}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-zinc-600">{product.category || "—"}</td>
                      <td className="px-4 py-3 text-zinc-600">{product.material || "—"}</td>
                      <td className="px-4 py-3 font-medium text-zinc-900">
                        {product.price ? `$${Number(product.price).toLocaleString("es-MX")}` : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleAvailable(product)}
                          className={`px-2.5 py-1 rounded-full text-xs font-medium transition ${
                            product.available
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                          }`}
                        >
                          {product.available ? "Publicado" : "Oculto"}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => openEdit(product)}
                            className="text-xs font-medium text-zinc-600 hover:text-zinc-900 transition"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(product.id)}
                            className="text-xs font-medium text-red-400 hover:text-red-600 transition"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>

      {/* ── Product form modal ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[92vh] overflow-y-auto">

            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
              <h2 className="font-semibold text-zinc-900">
                {editing ? "Editar producto" : "Nuevo producto"}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-zinc-400 hover:text-zinc-700 text-lg leading-none">✕</button>
            </div>

            <div className="p-6 space-y-5">

              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                  Nombre <span className="text-orange-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Ej: Soporte para cámara GoPro"
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">Descripción</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  placeholder="Descripción breve del producto..."
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                />
              </div>

              {/* Price + Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">Precio (MXN)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                    placeholder="2500"
                    min="0"
                    className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">Categoría</label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    placeholder="Decoración, Hobby…"
                    className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
              </div>

              {/* Material */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">Material</label>
                <select
                  value={form.material}
                  onChange={e => setForm(f => ({ ...f, material: e.target.value }))}
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <option value="">Sin especificar</option>
                  {MATERIALS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">Imagen</label>
                <input
                  type="url"
                  value={form.image_url}
                  onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
                  placeholder="https://… (pegá una URL de imagen)"
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 mb-2"
                />
                <div className="flex items-center gap-3">
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={e => setImageFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="text-xs border border-zinc-300 rounded-lg px-3 py-1.5 text-zinc-600 hover:bg-zinc-50 transition"
                  >
                    Subir desde archivo
                  </button>
                  {imageFile && (
                    <span className="text-xs text-zinc-500 truncate max-w-[180px]">{imageFile.name}</span>
                  )}
                </div>
                <p className="text-xs text-zinc-400 mt-1.5">
                  Podés pegar una URL o subir un archivo. Si subís archivo necesitás el bucket <code className="bg-zinc-100 px-1 rounded">product-images</code> en Supabase Storage (público).
                </p>
              </div>

              {/* Available toggle */}
              <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
                <div>
                  <p className="text-sm font-medium text-zinc-700">Publicado en tienda</p>
                  <p className="text-xs text-zinc-400 mt-0.5">Los clientes verán este producto</p>
                </div>
                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, available: !f.available }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    form.available ? "bg-orange-500" : "bg-zinc-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                      form.available ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-zinc-100">
              <button
                onClick={() => setModalOpen(false)}
                className="text-sm px-4 py-2 rounded-lg border border-zinc-300 text-zinc-600 hover:bg-zinc-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving || uploadingImg}
                className="text-sm px-4 py-2 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 transition disabled:opacity-50"
              >
                {saving || uploadingImg ? "Guardando…" : editing ? "Guardar cambios" : "Crear producto"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete confirmation modal ── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h3 className="font-semibold text-zinc-900 mb-2">Eliminar producto</h3>
            <p className="text-sm text-zinc-600 mb-6">
              Esta acción es permanente. ¿Confirmar eliminación?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="text-sm px-4 py-2 rounded-lg border border-zinc-300 text-zinc-600 hover:bg-zinc-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="text-sm px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
