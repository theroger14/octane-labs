import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function proxy(request) {
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

  const { pathname } = request.nextUrl

  // ── Admin routes ─────────────────────────────────────────────────
  const isAdminLogin = pathname === '/admin/login'
  const isAdminRoute = pathname.startsWith('/admin') && !isAdminLogin

  if (isAdminRoute && !session) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  if (isAdminLogin && session) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  // ── Customer-protected routes ─────────────────────────────────────
  const isCustomerLogin  = pathname === '/login'
  const isProtectedRoute = pathname === '/checkout' || pathname.startsWith('/account')

  if (isProtectedRoute && !session) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Already logged in and trying to hit /login → send back
  if (isCustomerLogin && session) {
    const redirect = request.nextUrl.searchParams.get('redirect') || '/'
    return NextResponse.redirect(new URL(redirect, request.url))
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*', '/checkout', '/account/:path*', '/login']
}