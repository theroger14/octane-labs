import ButtonLink from "@/components/ButtonLink"

export default function ProductCard({ product }) {
  const { name, description, price, material, category, image_url } = product

  return (
    <div className="rounded-2xl border border-zinc-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">

      {/* Imagen o placeholder */}
      <div className="aspect-square bg-zinc-100 flex items-center justify-center overflow-hidden">
        {image_url ? (
          <img
            src={image_url}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-zinc-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 h-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
              />
            </svg>
            <span className="text-xs">Sin imagen</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">

        {/* Categoría y material */}
        <div className="flex gap-2 mb-3">
          {category && (
            <span className="text-xs font-medium bg-zinc-100 text-zinc-600 px-2 py-1 rounded-full">
              {category}
            </span>
          )}
          {material && (
            <span className="text-xs font-medium bg-zinc-100 text-zinc-600 px-2 py-1 rounded-full">
              {material}
            </span>
          )}
        </div>

        {/* Nombre */}
        <h3 className="font-semibold text-zinc-900 mb-2 leading-tight">
          {name}
        </h3>

        {/* Descripción */}
        {description && (
          <p className="text-sm text-zinc-600 mb-4 flex-1 leading-relaxed">
            {description}
          </p>
        )}

        {/* Precio y botón */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-100">
          <span className="font-semibold text-zinc-900">
            {price
              ? `$${Number(price).toLocaleString("es-AR")}`
              : "Consultar precio"
            }
          </span>
          <ButtonLink href="/quote" variant="secondary">
            Encargar
          </ButtonLink>
        </div>

      </div>
    </div>
  )
}