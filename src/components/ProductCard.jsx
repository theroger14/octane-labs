"use client"

import Link from "next/link"
import { useCart } from "@/context/CartContext"

export default function ProductCard({ product }) {
  const { id, name, description, price, material, category, image_url } = product
  const { addItem } = useCart()

  return (
    <div className="rounded-2xl border border-zinc-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">

      {/* Image */}
      <Link href={`/shop/${id}`} className="no-underline block">
        <div className="aspect-square bg-zinc-100 flex items-center justify-center overflow-hidden">
          {image_url ? (
            <img
              src={image_url}
              alt={name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-zinc-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
              </svg>
              <span className="text-xs">Sin imagen</span>
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">

        {/* Badges */}
        <div className="flex gap-2 mb-3 flex-wrap">
          {category && (
            <span className="text-xs font-medium bg-zinc-100 text-zinc-600 px-2 py-1 rounded-full">{category}</span>
          )}
          {material && (
            <span className="text-xs font-medium bg-zinc-100 text-zinc-600 px-2 py-1 rounded-full">{material}</span>
          )}
        </div>

        {/* Name */}
        <Link href={`/shop/${id}`} className="no-underline">
          <h3 className="font-semibold text-zinc-900 mb-2 leading-tight hover:text-orange-600 transition-colors">
            {name}
          </h3>
        </Link>

        {/* Description */}
        {description && (
          <p className="text-sm text-zinc-600 mb-4 flex-1 leading-relaxed line-clamp-2">{description}</p>
        )}

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-100">
          <span className="font-semibold text-zinc-900">
            {price ? `$${Number(price).toLocaleString("es-MX")}` : "Consultar precio"}
          </span>
          <button
            onClick={() => addItem({ id, name, price, image_url })}
            style={{
              fontFamily: "'Outfit', sans-serif", fontWeight: "600", fontSize: "0.8rem",
              background: "#F97316", color: "#fff", border: "none", cursor: "pointer",
              padding: "0.45rem 0.9rem", borderRadius: "8px", transition: "background 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#EA6C0A"}
            onMouseLeave={e => e.currentTarget.style.background = "#F97316"}
          >
            + Agregar
          </button>
        </div>

      </div>
    </div>
  )
}
