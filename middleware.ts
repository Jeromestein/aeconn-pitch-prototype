import { type NextRequest, NextResponse } from "next/server"
import createMiddleware from "next-intl/middleware"
import { createServerClient } from "@supabase/ssr"
import { routing } from "./i18n/routing"
import { getAdminByEmail } from "@/lib/auth/admin-access"
import { hasSupabaseBrowserEnv } from "@/lib/supabase/env"
import { normalizeAdminEmail } from "@/lib/auth/shared"

const handleI18nRouting = createMiddleware(routing)

function getInternalBasePath(pathname: string) {
  return routing.locales.find((locale) => pathname === `/${locale}/internal` || pathname.startsWith(`/${locale}/internal/`))
}

function isLoginPath(pathname: string) {
  return routing.locales.some((locale) => pathname === `/${locale}/internal`)
}

function isProtectedInternalPath(pathname: string) {
  return routing.locales.some((locale) => pathname.startsWith(`/${locale}/internal/`) && pathname !== `/${locale}/internal`)
}

function copyCookies(source: NextResponse, target: NextResponse) {
  source.cookies.getAll().forEach((cookie) => {
    target.cookies.set(cookie)
  })
  return target
}

export default async function middleware(request: NextRequest) {
  const response = handleI18nRouting(request)
  const pathname = request.nextUrl.pathname

  if (!hasSupabaseBrowserEnv()) {
    return response
  }

  if (!isLoginPath(pathname) && !isProtectedInternalPath(pathname)) {
    return response
  }

  const { url, anonKey } = {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value)
          response.cookies.set(name, value, options)
        })
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const locale = getInternalBasePath(pathname) ?? routing.defaultLocale

  if (isLoginPath(pathname)) {
    if (!user?.email) {
      return response
    }

    const admin = await getAdminByEmail(normalizeAdminEmail(user.email))
    if (admin?.status === "active") {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = `/${locale}/internal/dashboard`
      return copyCookies(response, NextResponse.redirect(redirectUrl))
    }

    await supabase.auth.signOut()
    return response
  }

  if (!user?.email) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = `/${locale}/internal`
    return copyCookies(response, NextResponse.redirect(redirectUrl))
  }

  const admin = await getAdminByEmail(normalizeAdminEmail(user.email))
  if (admin?.status === "active") {
    return response
  }

  await supabase.auth.signOut()
  const redirectUrl = request.nextUrl.clone()
  redirectUrl.pathname = `/${locale}/internal`
  return copyCookies(response, NextResponse.redirect(redirectUrl))
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
}
