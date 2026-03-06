import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { hasSupabaseServerEnv } from "@/lib/supabase/env"
import { getAdminByEmail, type AdminUser } from "@/lib/auth/admin-access"

export async function getAuthenticatedAdmin(): Promise<AdminUser | null> {
  if (!hasSupabaseServerEnv()) {
    return null
  }

  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) {
    return null
  }

  const admin = await getAdminByEmail(user.email)
  if (!admin || admin.status !== "active") {
    return null
  }

  return admin
}

export async function requireAdmin(locale: string) {
  const admin = await getAuthenticatedAdmin()

  if (!admin) {
    redirect(`/${locale}/internal`)
  }

  return admin
}
