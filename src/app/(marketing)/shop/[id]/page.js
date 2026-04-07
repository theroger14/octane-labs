import { notFound } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import Container from "@/components/Container"
import ButtonLink from "@/components/ButtonLink"

export const revalidate = 60

export async function generateMetadata({ params }) {
  const { data } = await supabase
    .from("products")
    .select("name, description")
    .eq("id", params.id)
    .single()

  if (!data) return { title: "Producto no encontrado | Octane Labs" }
  return {
    title: `${data.name} | Octane Labs`,
    description: data.description || undefined,
  }
}

export default async function ProductDetailPage({ params }) {
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .eq("available", true)
    .single()

  if (!product) notFound()

  return (
    <section className="py-14">
      <Container>

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-zinc-500 mb-10">
          <Link href="/" className="no-underline hover:text-zinc-900 transition">Inicio</Link>
          <span>/</span>
          <Link href="/shop" className="no-underline hover:text-zinc-900 transition">Tienda</Link>
          <span>/</span>
          <span className="text-zinc-800 font-medium">{product.name}</span>
        </nav>

        <div className="grid gap-12 lg:grid-cols-2 items-start">

          {/* Image */}
          <div className="aspect-square rounded-2xl bg-zinc-100 overflow-hidden flex items-center justify-center">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-3 text-zinc-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-20 h-20"
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
                <span className="text-sm">Sin imagen</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {product.category && (
                <span className="text-xs font-medium bg-zinc-100 text-zinc-600 px-3 py-1 rounded-full">
                  {product.category}
                </span>
              )}
              {product.material && (
                <span className="text-xs font-medium bg-orange-50 text-orange-600 px-3 py-1 rounded-full">
                  {product.material}
                </span>
              )}
            </div>

            {/* Name */}
            <h1 className="text-2xl sm:text-3xl font-semibold text-zinc-900 mb-4 leading-tight">
              {product.name}
            </h1>

            {/* Description */}
            {product.description && (
              <p className="text-zinc-600 leading-relaxed mb-6">
                {product.description}
              </p>
            )}

            {/* Price + CTA */}
            <div className="mt-auto pt-6 border-t border-zinc-100 space-y-5">
              <p className="text-3xl font-bold text-zinc-900">
                {product.price
                  ? `$${Number(product.price).toLocaleString("es-AR")}`
                  : "Consultar precio"
                }
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <ButtonLink href="/quote" variant="primary">
                  Encargar este modelo
                </ButtonLink>
                <ButtonLink href="/shop" variant="secondary">
                  Ver más productos
                </ButtonLink>
              </div>

              <p className="text-xs text-zinc-400">
                El precio puede variar según configuración final. Te enviamos cotización exacta por email.
              </p>
            </div>

          </div>
        </div>

      </Container>
    </section>
  )
}
