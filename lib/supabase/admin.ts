import { createClient } from "@supabase/supabase-js"
import { getSupabaseServerEnv } from "@/lib/supabase/env"

let adminClient:
  | ReturnType<typeof createClient>
  | null = null

export function getSupabaseAdminClient() {
  if (!adminClient) {
    const { url, serviceRoleKey } = getSupabaseServerEnv()
    adminClient = createClient(url, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  }

  return adminClient
}
