import { NextResponse } from "next/server"
import { runSupabaseHeartbeat } from "@/lib/supabase/heartbeat"
import { hasSupabaseServerEnv } from "@/lib/supabase/env"

function isAuthorized(request: Request) {
  const secret = process.env.HEARTBEAT_SECRET

  if (!secret) {
    return false
  }

  const authHeader = request.headers.get("authorization")
  return authHeader === `Bearer ${secret}`
}

export async function GET(request: Request) {
  if (!hasSupabaseServerEnv()) {
    return NextResponse.json(
      { error: "SUPABASE_NOT_CONFIGURED", message: "Supabase is not configured." },
      { status: 503 }
    )
  }

  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Unauthorized." },
      { status: 401 }
    )
  }

  try {
    const result = await runSupabaseHeartbeat()

    return NextResponse.json({
      ok: true,
      checkedAt: new Date().toISOString(),
      table: result.table,
      count: result.count,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Supabase heartbeat failed."

    return NextResponse.json(
      { error: "HEARTBEAT_FAILED", message },
      { status: 500 }
    )
  }
}
