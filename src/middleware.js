import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  let response = NextResponse.next({
    request: { headers: request.headers }
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        }
      }
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  const isLoginPage  = request.nextUrl.pathname === '/admin/login'
  const isProtected  = request.nextUrl.pathname.startsWith('/admin') && !isLoginPage

  // Sin sesión intentando entrar a cualquier ruta admin → redirigir al login
  if (isProtected && !session) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // Con sesión intentando entrar al login → redirigir al dashboard
  if (isLoginPage && session) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*']
}