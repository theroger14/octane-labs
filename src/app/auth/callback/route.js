import { NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabaseServer"

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  // After OAuth the provider can pass a `next` param with the redirect destination
  const next = searchParams.get("next") ?? "/"

  if (code) {
    const supabase = await createSupabaseServer()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // OAuth error — send back to login with a flag
  return NextResponse.redirect(`${origin}/login?error=oauth_error`)
}
