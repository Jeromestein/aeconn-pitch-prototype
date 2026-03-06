import { NextResponse } from "next/server"
import { isAdminEmail } from "@/lib/auth/admin-access"
import { normalizeAdminEmail } from "@/lib/auth/shared"
import { hasSupabaseServerEnv } from "@/lib/supabase/env"

const GENERIC_ERROR = "Unable to send a sign-in code. Please verify your admin access and try again."

export async function POST(request: Request) {
  if (!hasSupabaseServerEnv()) {
    return NextResponse.json(
      { error: "Supabase environment variables are not configured." },
      { status: 500 },
    )
  }

  const { email } = await request.json()
  if (typeof email !== "string" || !email.trim()) {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 400 })
  }

  const allowed = await isAdminEmail(normalizeAdminEmail(email))
  if (!allowed) {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}
