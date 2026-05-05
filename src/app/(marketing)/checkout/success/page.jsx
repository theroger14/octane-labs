import { redirect } from "next/navigation"
import { createSupabaseServer } from "@/lib/supabaseServer"
import SuccessClient from "./SuccessClient"

export const metadata = { title: "¡Pago exitoso! | Octane Labs" }

export default async function SuccessPage({ searchParams }) {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { order_id } = await searchParams

  let order = null
  if (order_id) {
    const { data } = await supabase
      .from("orders")
      .select("*, order_items (*)")
      .eq("id", order_id)
      .eq("user_id", user.id)
      .single()
    order = data
  }

  return <SuccessClient order={order} userEmail={user.email} />
}
