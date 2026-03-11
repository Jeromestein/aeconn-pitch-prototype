import { getSupabaseAdminClient } from "@/lib/supabase/admin"

const HEARTBEAT_TABLES = ["admin_users", "checkins"] as const

export async function runSupabaseHeartbeat() {
  const supabase = getSupabaseAdminClient()
  const attempts: string[] = []

  for (const table of HEARTBEAT_TABLES) {
    const { error, count } = await supabase
      .from(table)
      .select("*", { count: "exact", head: true })
      .limit(1)

    if (!error) {
      return {
        table,
        count: count ?? 0,
      }
    }

    attempts.push(`${table}: ${error.message}`)
  }

  throw new Error(`Supabase heartbeat failed. ${attempts.join(" | ")}`)
}
