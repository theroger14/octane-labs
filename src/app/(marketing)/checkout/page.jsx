import { redirect } from "next/navigation"
import { createSupabaseServer } from "@/lib/supabaseServer"
import CheckoutClient from "./CheckoutClient"

export const metadata = { title: "Checkout | Octane Labs" }

export default async function CheckoutPage() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?redirect=/checkout")
  }

  const { data: addresses } = await supabase
    .from("shipping_addresses")
    .select("*")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false })

  return <CheckoutClient user={user} savedAddresses={addresses || []} />
}
