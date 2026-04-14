import { createSupabaseServer } from "@/lib/supabaseServer"
import { redirect } from "next/navigation"
import Link from "next/link"
import WishlistPageClient from "./WishlistPageClient"

export const metadata = { title: "Mis favoritos | Octane Labs" }

export default async function WishlistPage() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login?redirect=/account/wishlist")

  const { data: items } = await supabase
    .from("wishlists")
    .select(`
      id,
      created_at,
      products (
        id, name, description, price, material, category, image_url
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const products = (items || [])
    .map(item => item.products)
    .filter(Boolean)

  return <WishlistPageClient products={products} />
}
