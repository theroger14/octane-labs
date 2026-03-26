"use client"

import { useState, useMemo } from "react"
import ProductCard from "@/components/ProductCard"

export default function ShopGrid({ products }) {
  const [activeCategory, setActiveCategory] = useState("Todos")
  const [activeMaterial, setActiveMaterial] = useState("Todos")

  const categories = useMemo(() => {
    const cats = products.map(p => p.category).filter(Boolean)
    return ["Todos", ...Array.from(new Set(cats))]
  }, [products])

  const materials = useMemo(() => {
    const mats = products.map(p => p.material).filter(Boolean)
    return ["Todos", ...Array.from(new Set(mats))]
  }, [products])

  const filtered = useMemo(() => {
    return products.filter(p => {
      const catMatch = activeCategory === "Todos" || p.category === activeCategory
      const matMatch = activeMaterial === "Todos" || p.material === activeMaterial
      return catMatch && matMatch
    })
  }, [products, activeCategory, activeMaterial])

  const showFilters = categories.length > 2 || materials.length > 2

  return (
    <>
      {/* Filters */}
      {showFilters && (
        <div className="space-y-3 mb-8">
          {categories.length > 2 && (
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                    activeCategory === cat
                      ? "bg-zinc-900 text-white"
                      : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
          {materials.length > 2 && (
            <div className="flex flex-wrap gap-2">
              {materials.map(mat => (
                <button
                  key={mat}
                  onClick={() => setActiveMaterial(mat)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                    activeMaterial === mat
                      ? "bg-orange-500 text-white"
                      : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                  }`}
                >
                  {mat}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Results count */}
      {showFilters && (activeCategory !== "Todos" || activeMaterial !== "Todos") && (
        <p className="text-sm text-zinc-500 mb-4">
          {filtered.length} {filtered.length === 1 ? "producto" : "productos"}
          {activeCategory !== "Todos" ? ` en "${activeCategory}"` : ""}
          {activeMaterial !== "Todos" ? ` · ${activeMaterial}` : ""}
        </p>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-zinc-200 p-8 text-center text-zinc-500 text-sm">
          No hay productos con esos filtros.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  )
}
