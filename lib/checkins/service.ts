import { getSupabaseAdminClient } from "@/lib/supabase/admin"
import { hasSupabaseServerEnv } from "@/lib/supabase/env"
import {
  checkinPayloadSchema,
  type CheckinRecord,
  type ContactRecord,
  type DashboardMetricsRecord,
} from "@/lib/checkins/types"

type ContactRow = {
  id: string
  name: string
  phone: string
  email: string | null
  interest: string | null
  office: string | null
  email_opt_in: boolean
  sms_opt_in: boolean
  last_checkin_at: string
  created_at: string
  updated_at: string
}

type CheckinRow = {
  id: string
  contact_id: string
  contact_name: string
  checked_in_at: string
  kiosk_id: string
  source: "kiosk" | "web" | "manual"
  status: "completed" | "pending" | "cancelled"
  interest: string | null
  office: string | null
  email_opt_in: boolean
  sms_opt_in: boolean
  created_at: string
}

function ensureSupabaseConfigured() {
  if (!hasSupabaseServerEnv()) {
    throw new Error("SUPABASE_NOT_CONFIGURED")
  }
}

function normalizePhone(phone: string) {
  const trimmed = phone.trim()
  const hasLeadingPlus = trimmed.startsWith("+")
  const digits = trimmed.replace(/\D/g, "")
  return hasLeadingPlus ? `+${digits}` : digits
}

function normalizeEmail(email?: string) {
  const value = email?.trim().toLowerCase()
  return value ? value : null
}

function normalizeOptionalValue(value?: string) {
  const normalized = value?.trim()
  return normalized ? normalized : null
}

function validateNormalizedPhone(phone: string) {
  return /^\+?\d{7,15}$/.test(phone)
}

function validateNormalizedEmail(email: string | null) {
  if (!email) {
    return true
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function getDefaultKioskId() {
  return process.env.NEXT_PUBLIC_KIOSK_ID?.trim() || "KIOSK-1"
}

function toCheckinRecord(row: CheckinRow): CheckinRecord {
  return {
    id: row.id,
    contactId: row.contact_id,
    contactName: row.contact_name,
    checkedInAt: row.checked_in_at,
    kioskId: row.kiosk_id,
    source: row.source,
    status: row.status,
    interest: row.interest,
    office: row.office,
    emailOptIn: row.email_opt_in,
    smsOptIn: row.sms_opt_in,
  }
}

function toContactRecord(row: ContactRow, recentCheckins: CheckinRecord[], visitCount: number): ContactRecord {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    interest: row.interest,
    office: row.office,
    emailOptIn: row.email_opt_in,
    smsOptIn: row.sms_opt_in,
    lastCheckinAt: row.last_checkin_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    visitCount,
    recentCheckins,
  }
}

function getIsoDayKey(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-")
}

function formatMonthDay(value: Date) {
  return `${value.getMonth() + 1}/${value.getDate()}`
}

function getMonday(date: Date) {
  const start = new Date(date)
  const day = start.getDay()
  const diff = day === 0 ? -6 : 1 - day
  start.setHours(0, 0, 0, 0)
  start.setDate(start.getDate() + diff)
  return start
}

function formatHour(hour: number) {
  return `${String(hour).padStart(2, "0")}:00`
}

function buildCheckinMaps(checkins: CheckinRecord[]) {
  const recentCheckinsMap = new Map<string, CheckinRecord[]>()
  const visitCountMap = new Map<string, number>()

  checkins.forEach((checkin) => {
    visitCountMap.set(checkin.contactId, (visitCountMap.get(checkin.contactId) || 0) + 1)
    const recent = recentCheckinsMap.get(checkin.contactId) || []
    if (recent.length < 5) {
      recent.push(checkin)
      recentCheckinsMap.set(checkin.contactId, recent)
    }
  })

  return { recentCheckinsMap, visitCountMap }
}

async function findExistingContact(phone: string, email: string | null) {
  const adminClient = getSupabaseAdminClient()

  const phoneResult = await adminClient
    .from("contacts")
    .select("id, name, phone, email, interest, office, email_opt_in, sms_opt_in, last_checkin_at, created_at, updated_at")
    .eq("phone", phone)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle<ContactRow>()

  if (phoneResult.error) {
    throw new Error(`Failed to read contacts by phone: ${phoneResult.error.message}`)
  }

  if (phoneResult.data) {
    return phoneResult.data
  }

  if (!email) {
    return null
  }

  const emailResult = await adminClient
    .from("contacts")
    .select("id, name, phone, email, interest, office, email_opt_in, sms_opt_in, last_checkin_at, created_at, updated_at")
    .eq("email", email)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle<ContactRow>()

  if (emailResult.error) {
    throw new Error(`Failed to read contacts by email: ${emailResult.error.message}`)
  }

  return emailResult.data
}

export function parseCheckinPayload(input: unknown) {
  const result = checkinPayloadSchema.safeParse(input)

  if (!result.success) {
    return {
      success: false as const,
      error: "INVALID_PAYLOAD",
    }
  }

  const payload = result.data
  const normalizedPhone = normalizePhone(payload.phone)
  const normalizedEmail = normalizeEmail(payload.email)

  if (!validateNormalizedPhone(normalizedPhone)) {
    return {
      success: false as const,
      error: "INVALID_PHONE",
    }
  }

  if (!validateNormalizedEmail(normalizedEmail)) {
    return {
      success: false as const,
      error: "INVALID_EMAIL",
    }
  }

  return {
    success: true as const,
    data: {
      name: payload.name.trim(),
      phone: normalizedPhone,
      email: normalizedEmail,
      interest: normalizeOptionalValue(payload.interest),
      office: normalizeOptionalValue(payload.office),
      emailOptIn: payload.emailOptIn,
      smsOptIn: payload.smsOptIn,
      kioskId: normalizeOptionalValue(payload.kioskId) || getDefaultKioskId(),
      source: payload.source || "kiosk",
    },
  }
}

export async function upsertContactAndCreateCheckin(input: unknown) {
  ensureSupabaseConfigured()

  const parsed = parseCheckinPayload(input)
  if (!parsed.success) {
    throw new Error(parsed.error)
  }

  const adminClient = getSupabaseAdminClient()
  const now = new Date().toISOString()
  const normalizedInput = parsed.data
  const existingContact = await findExistingContact(normalizedInput.phone, normalizedInput.email)
  const existingCheckins = existingContact
    ? await adminClient
        .from("checkins")
        .select("id", { count: "exact", head: true })
        .eq("contact_id", existingContact.id)
    : null

  if (existingCheckins?.error) {
    throw new Error(`Failed to count existing checkins: ${existingCheckins.error.message}`)
  }

  let contactRow: ContactRow

  if (existingContact) {
    const updateResult = await adminClient
      .from("contacts")
      .update({
        name: normalizedInput.name,
        phone: normalizedInput.phone,
        email: normalizedInput.email,
        interest: normalizedInput.interest,
        office: normalizedInput.office,
        email_opt_in: normalizedInput.emailOptIn,
        sms_opt_in: normalizedInput.smsOptIn,
        last_checkin_at: now,
      })
      .eq("id", existingContact.id)
      .select("id, name, phone, email, interest, office, email_opt_in, sms_opt_in, last_checkin_at, created_at, updated_at")
      .single<ContactRow>()

    if (updateResult.error) {
      throw new Error(`Failed to update contact: ${updateResult.error.message}`)
    }

    contactRow = updateResult.data
  } else {
    const insertResult = await adminClient
      .from("contacts")
      .insert({
        name: normalizedInput.name,
        phone: normalizedInput.phone,
        email: normalizedInput.email,
        interest: normalizedInput.interest,
        office: normalizedInput.office,
        email_opt_in: normalizedInput.emailOptIn,
        sms_opt_in: normalizedInput.smsOptIn,
        last_checkin_at: now,
      })
      .select("id, name, phone, email, interest, office, email_opt_in, sms_opt_in, last_checkin_at, created_at, updated_at")
      .single<ContactRow>()

    if (insertResult.error) {
      throw new Error(`Failed to create contact: ${insertResult.error.message}`)
    }

    contactRow = insertResult.data
  }

  const checkinResult = await adminClient
    .from("checkins")
    .insert({
      contact_id: contactRow.id,
      contact_name: normalizedInput.name,
      checked_in_at: now,
      kiosk_id: normalizedInput.kioskId,
      source: normalizedInput.source,
      status: "completed",
      interest: normalizedInput.interest,
      office: normalizedInput.office,
      email_opt_in: normalizedInput.emailOptIn,
      sms_opt_in: normalizedInput.smsOptIn,
    })
    .select("id, contact_id, contact_name, checked_in_at, kiosk_id, source, status, interest, office, email_opt_in, sms_opt_in, created_at")
    .single<CheckinRow>()

  if (checkinResult.error) {
    throw new Error(`Failed to create checkin: ${checkinResult.error.message}`)
  }

  return {
    contact: toContactRecord(
      contactRow,
      [toCheckinRecord(checkinResult.data)],
      (existingCheckins?.count || 0) + 1
    ),
    checkin: toCheckinRecord(checkinResult.data),
  }
}

export async function listCheckins() {
  ensureSupabaseConfigured()
  const adminClient = getSupabaseAdminClient()
  const result = await adminClient
    .from("checkins")
    .select("id, contact_id, contact_name, checked_in_at, kiosk_id, source, status, interest, office, email_opt_in, sms_opt_in, created_at")
    .order("checked_in_at", { ascending: false })

  if (result.error) {
    throw new Error(`Failed to read checkins: ${result.error.message}`)
  }

  return (result.data as CheckinRow[]).map(toCheckinRecord)
}

export async function listContacts() {
  ensureSupabaseConfigured()
  const adminClient = getSupabaseAdminClient()
  const [contactsResult, checkins] = await Promise.all([
    adminClient
      .from("contacts")
      .select("id, name, phone, email, interest, office, email_opt_in, sms_opt_in, last_checkin_at, created_at, updated_at")
      .order("last_checkin_at", { ascending: false }),
    listCheckins(),
  ])

  if (contactsResult.error) {
    throw new Error(`Failed to read contacts: ${contactsResult.error.message}`)
  }

  const { recentCheckinsMap, visitCountMap } = buildCheckinMaps(checkins)

  return (contactsResult.data as ContactRow[]).map((contact) =>
    toContactRecord(
      contact,
      recentCheckinsMap.get(contact.id) || [],
      visitCountMap.get(contact.id) || 0
    )
  )
}

export async function getDashboardMetrics(): Promise<DashboardMetricsRecord> {
  ensureSupabaseConfigured()
  const [contacts, checkins] = await Promise.all([listContacts(), listCheckins()])
  const now = new Date()
  const todayKey = getIsoDayKey(now)

  const todayCheckins = checkins.filter((item) => getIsoDayKey(item.checkedInAt) === todayKey)
  const consentedContacts = contacts.filter((item) => item.emailOptIn || item.smsOptIn)
  const monthlyTrend = []

  for (let offset = 29; offset >= 0; offset -= 1) {
    const date = new Date(now)
    date.setHours(0, 0, 0, 0)
    date.setDate(date.getDate() - offset)
    const key = getIsoDayKey(date)
    monthlyTrend.push({
      date: formatMonthDay(date),
      checkins: checkins.filter((item) => getIsoDayKey(item.checkedInAt) === key).length,
    })
  }

  const weekStart = getMonday(now)
  const weeklyTrend = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart)
    date.setDate(date.getDate() + index)
    const key = getIsoDayKey(date)
    return {
      day: String(index),
      checkins: checkins.filter((item) => getIsoDayKey(item.checkedInAt) === key).length,
      newContacts: contacts.filter((item) => getIsoDayKey(item.createdAt) === key).length,
    }
  })

  const hourlyDistribution = Array.from({ length: 24 }, (_, hour) => ({
    hour: formatHour(hour),
    count: todayCheckins.filter((item) => new Date(item.checkedInAt).getHours() === hour).length,
  }))

  const interestCounts = contacts.reduce<Record<string, number>>((accumulator, contact) => {
    if (!contact.interest) {
      return accumulator
    }

    accumulator[contact.interest] = (accumulator[contact.interest] || 0) + 1
    return accumulator
  }, {})

  const topTags = Object.entries(interestCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((left, right) => right.count - left.count)
    .slice(0, 6)

  return {
    todayCheckins: todayCheckins.length,
    totalContacts: contacts.length,
    consentRate: contacts.length === 0 ? 0 : Math.round((consentedContacts.length / contacts.length) * 1000) / 10,
    avgCheckinTime: null,
    weeklyTrend,
    monthlyTrend,
    topTags,
    hourlyDistribution,
  }
}
