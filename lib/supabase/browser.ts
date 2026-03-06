"use client"

import { createBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"
import { getSupabaseBrowserEnv } from "@/lib/supabase/env"

let browserClient: SupabaseClient | null = null

export function getSupabaseBrowserClient() {
  if (!browserClient) {
    const { url, anonKey } = getSupabaseBrowserEnv()
    browserClient = createBrowserClient(url, anonKey)
  }

  return browserClient
}
