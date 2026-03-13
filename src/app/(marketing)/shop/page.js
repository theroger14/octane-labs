import { supabase } from "@/lib/supabase"
import Section from "@/components/Section"
import ProductCard from "@/components/ProductCard"
import ButtonLink from "@/components/ButtonLink"

export const revalidate = 60 // refresca los datos cada 60 segundos

export const metadata = { title: "Tienda | Octane Labs" }

export default async function ShopPage() {
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("available", true)
    .order("created_at", { ascending: false })

  return (
    <Section
      title="Tienda"
      subtitle="Piezas listas para encargar. También podés traer tu propio diseño."
    >
      {/* Botón para ir a cotizar */}
      <div className="mb-8">
        <ButtonLink href="/quote">Subir mi propio STL</ButtonLink>
      </div>

      {/* Error de base de datos */}
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 mb-6">
          Error al cargar productos: {error.message}
        </div>
      )}

      {/* Sin productos */}
      {!error && products?.length === 0 && (
        <div className="rounded-xl border border-zinc-200 p-8 text-center text-zinc-500 text-sm">
          No hay productos disponibles por el momento.
        </div>
      )}

      {/* Grilla de productos */}
      {products && products.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </Section>
  )
}