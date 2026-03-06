import { NextResponse } from "next/server"
import { ZodError } from "zod"
import { hasSupabaseServerEnv } from "@/lib/supabase/env"
import { parseCheckinPayload, upsertContactAndCreateCheckin } from "@/lib/checkins/service"

function getErrorMessage(code: string) {
  switch (code) {
    case "INVALID_PHONE":
      return "Invalid phone number format."
    case "INVALID_EMAIL":
      return "Invalid email format."
    case "INVALID_PAYLOAD":
      return "Invalid request payload."
    case "SUPABASE_NOT_CONFIGURED":
      return "Supabase is not configured."
    case "SUPABASE_SCHEMA_MISSING":
      return "Supabase tables are not initialized."
    default:
      return "Unable to complete check-in."
  }
}

export async function POST(request: Request) {
  if (!hasSupabaseServerEnv()) {
    return NextResponse.json(
      { error: "SUPABASE_NOT_CONFIGURED", message: getErrorMessage("SUPABASE_NOT_CONFIGURED") },
      { status: 503 }
    )
  }

  try {
    const body = await request.json()
    const parsed = parseCheckinPayload(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error, message: getErrorMessage(parsed.error) },
        { status: 400 }
      )
    }

    const result = await upsertContactAndCreateCheckin(body)
    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "INVALID_PAYLOAD", message: getErrorMessage("INVALID_PAYLOAD") },
        { status: 400 }
      )
    }

    if (error instanceof Error) {
      const code = error.message.includes("Could not find the table")
        ? "SUPABASE_SCHEMA_MISSING"
        : error.message

      return NextResponse.json(
        { error: code, message: getErrorMessage(code), detail: error.message },
        { status: code === "SUPABASE_NOT_CONFIGURED" ? 503 : 500 }
      )
    }

    return NextResponse.json(
      { error: "UNKNOWN_ERROR", message: getErrorMessage("UNKNOWN_ERROR") },
      { status: 500 }
    )
  }
}
