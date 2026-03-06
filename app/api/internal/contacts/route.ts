import { NextResponse } from "next/server"
import { getAuthenticatedAdmin } from "@/lib/auth/admin"
import { importContacts, listContacts } from "@/lib/checkins/service"
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
    const contacts = await listContacts()
    return NextResponse.json({ contacts })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load contacts."
    const code = message.includes("Could not find the table")
      ? "SUPABASE_SCHEMA_MISSING"
      : "CONTACTS_FETCH_FAILED"

    return NextResponse.json(
      {
        error: code,
        message,
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
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
    const body = await request.json()
    const rows = Array.isArray(body?.rows) ? body.rows : null

    if (!rows) {
      return NextResponse.json(
        { error: "INVALID_PAYLOAD", message: "Invalid import payload." },
        { status: 400 }
      )
    }

    const result = await importContacts(rows)
    return NextResponse.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to import contacts."
    const code = message.includes("Could not find the table")
      ? "SUPABASE_SCHEMA_MISSING"
      : message

    return NextResponse.json(
      {
        error: code,
        message,
      },
      {
        status:
          code === "INVALID_PAYLOAD" || code === "INVALID_EMAIL" || code === "INVALID_DATE" || code === "IMPORT_EMPTY"
            ? 400
            : 500,
      }
    )
  }
}
