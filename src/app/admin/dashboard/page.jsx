"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import QuoteRow from "@/components/QuoteRow"

export default function DashboardPage() {
  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [userEmail, setUserEmail] = useState("")
  const router = useRouter()

  useEffect(() => {
    getUser()
    fetchQuotes()
  }, [])

  async function getUser() {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) setUserEmail(user.email)
  }

  async function fetchQuotes() {
    setLoading(true)
    const { data, error } = await supabase
      .from("quotes")
      .select("*")
      .order("created_at", { ascending: false })
    if (!error) setQuotes(data)
    setLoading(false)
  }

  async function updateStatus(id, newStatus) {
    const { error } = await supabase
      .from("quotes")
      .update({ status: newStatus })
      .eq("id", id)
    if (!error) {
      setQuotes((prev) =>
        prev.map((q) => (q.id === id ? { ...q, status: newStatus } : q))
      )
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/admin/login")
    router.refresh()
  }

  const filters = [
    { key: "all",       label: "Todos"       },
    { key: "pending",   label: "Pendientes"  },
    { key: "reviewed",  label: "Revisados"   },
    { key: "quoted",    label: "Cotizados"   },
    { key: "completed", label: "Completados" },
    { key: "rejected",  label: "Rechazados"  },
  ]

  const filtered = filter === "all"
    ? quotes
    : quotes.filter((q) => q.status === filter)

  const total     = quotes.length
  const pending   = quotes.filter((q) => q.status === "pending").length
  const quoted    = quotes.filter((q) => q.status === "quoted").length
  const completed = quotes.filter((q) => q.status === "completed").length

  return (
    <div className="min-h-screen bg-zinc-50">

      <header className="bg-white border-b border-zinc-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-bold text-zinc-900">Octane Labs — Admin</h1>
            <p className="text-xs text-zinc-500">{userEmail}</p>
          </div>
          <div className="flex items-center gap-4">
            <a href="/admin/products" className="text-sm text-zinc-600 hover:text-zinc-900 transition">
              Productos
            </a>
            <a href="/" className="text-sm text-zinc-600 hover:text-zinc-900 transition">
              Ver sitio
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

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-zinc-200 p-5">
            <p className="text-sm text-zinc-500">Total</p>
            <p className="text-3xl font-bold mt-1 text-zinc-900">{total}</p>
          </div>
          <div className="bg-white rounded-2xl border border-zinc-200 p-5">
            <p className="text-sm text-zinc-500">Pendientes</p>
            <p className="text-3xl font-bold mt-1 text-yellow-600">{pending}</p>
          </div>
          <div className="bg-white rounded-2xl border border-zinc-200 p-5">
            <p className="text-sm text-zinc-500">Cotizados</p>
            <p className="text-3xl font-bold mt-1 text-purple-600">{quoted}</p>
          </div>
          <div className="bg-white rounded-2xl border border-zinc-200 p-5">
            <p className="text-sm text-zinc-500">Completados</p>
            <p className="text-3xl font-bold mt-1 text-green-600">{completed}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={
                filter === f.key
                  ? "px-4 py-1.5 rounded-full text-sm font-medium bg-zinc-900 text-white"
                  : "px-4 py-1.5 rounded-full text-sm font-medium bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
              }
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
          {loading && (
            <div className="p-12 text-center text-zinc-400 text-sm">
              Cargando cotizaciones...
            </div>
          )}
          {!loading && filtered.length === 0 && (
            <div className="p-12 text-center text-zinc-400 text-sm">
              No hay cotizaciones con este filtro.
            </div>
          )}
          {!loading && filtered.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 bg-zinc-50">
                    <th className="text-left px-6 py-3 font-medium text-zinc-500">Fecha</th>
                    <th className="text-left px-6 py-3 font-medium text-zinc-500">Cliente</th>
                    <th className="text-left px-6 py-3 font-medium text-zinc-500">Material</th>
                    <th className="text-left px-6 py-3 font-medium text-zinc-500">Archivo STL</th>
                    <th className="text-left px-6 py-3 font-medium text-zinc-500">Notas</th>
                    <th className="text-left px-6 py-3 font-medium text-zinc-500">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {filtered.map((quote) => (
                    <QuoteRow
                      key={quote.id}
                      quote={quote}
                      onStatusChange={updateStatus}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>
    </div>
  )
}