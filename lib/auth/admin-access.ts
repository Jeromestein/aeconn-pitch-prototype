import { getSupabaseAdminClient } from "@/lib/supabase/admin"
import { hasSupabaseServerEnv } from "@/lib/supabase/env"
import { normalizeAdminEmail } from "@/lib/auth/shared"

export type AdminUser = {
  id: string
  email: string
  name: string | null
  role: string | null
  status: "active" | "disabled"
}

export async function getAdminByEmail(email: string): Promise<AdminUser | null> {
  if (!hasSupabaseServerEnv()) {
    return null
  }

  const adminClient = getSupabaseAdminClient()
  const normalizedEmail = normalizeAdminEmail(email)
  const { data, error } = await adminClient
    .from("admin_users")
    .select("id, email, name, role, status")
    .eq("email", normalizedEmail)
    .maybeSingle()

  if (error) {
    throw new Error(`Failed to read admin_users: ${error.message}`)
  }

  return data
}

export async function isAdminEmail(email: string) {
  const admin = await getAdminByEmail(email)
  return admin?.status === "active"
}
