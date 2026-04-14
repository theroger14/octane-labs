import { createSupabaseServer } from "@/lib/supabaseServer"
import { redirect } from "next/navigation"
import AddressesClient from "./AddressesClient"

export const metadata = { title: "Mis direcciones | Octane Labs" }

export default async function AddressesPage() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login?redirect=/account/addresses")

  const { data: addresses } = await supabase
    .from("shipping_addresses")
    .select("*")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false })

  return <AddressesClient user={user} initialAddresses={addresses || []} />
}
