import { NextResponse } from "next/server"
import { getAuthenticatedAdmin } from "@/lib/auth/admin"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { hasSupabaseServerEnv } from "@/lib/supabase/env"

export async function GET() {
  if (!hasSupabaseServerEnv()) {
    return NextResponse.json(
      { error: "Supabase environment variables are not configured." },
      { status: 500 },
    )
  }

  const admin = await getAuthenticatedAdmin()
  if (!admin) {
    const supabase = await createSupabaseServerClient()
    await supabase.auth.signOut()
    return NextResponse.json({ error: "Admin access required." }, { status: 403 })
  }

  return NextResponse.json({ ok: true, admin })
}
