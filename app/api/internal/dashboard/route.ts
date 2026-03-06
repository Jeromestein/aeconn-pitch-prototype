import { NextResponse } from "next/server"
import { getAuthenticatedAdmin } from "@/lib/auth/admin"
import { getDashboardMetrics } from "@/lib/checkins/service"
import { hasSupabaseServerEnv } from "@/lib/supabase/env"

export async function GET() {
  if (!hasSupabaseServerEnv()) {
    return NextResponse.json(
      { error: "SUPABASE_NOT_CONFIGURED", message: "Supabase is not configured." },
      { status: 503 }
    )
  }

  const admin = await getAuthenticatedAdmin()
  if (!admin) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Unauthorized." },
      { status: 401 }
    )
  }

  try {
    const dashboard = await getDashboardMetrics()
    return NextResponse.json({ dashboard })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load dashboard."
    const code = message.includes("Could not find the table")
      ? "SUPABASE_SCHEMA_MISSING"
      : "DASHBOARD_FETCH_FAILED"

    return NextResponse.json(
      {
        error: code,
        message,
      },
      { status: 500 }
    )
  }
}
