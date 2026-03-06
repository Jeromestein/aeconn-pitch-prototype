import { z } from "zod"

export const CHECKIN_SOURCES = ["kiosk", "web", "manual"] as const
export const CHECKIN_STATUSES = ["completed", "pending", "cancelled"] as const

export type CheckinSource = (typeof CHECKIN_SOURCES)[number]
export type CheckinStatus = (typeof CHECKIN_STATUSES)[number]

export const checkinPayloadSchema = z.object({
  name: z.string().trim().min(1),
  phone: z.string().trim().min(1),
  email: z.string().trim().optional().or(z.literal("")),
  interest: z.string().trim().optional().or(z.literal("")),
  office: z.string().trim().optional().or(z.literal("")),
  emailOptIn: z.boolean(),
  smsOptIn: z.boolean(),
  kioskId: z.string().trim().optional().or(z.literal("")),
  source: z.enum(CHECKIN_SOURCES).optional(),
})

export type CheckinPayload = z.infer<typeof checkinPayloadSchema>

export interface CheckinRecord {
  id: string
  contactId: string
  contactName: string
  checkedInAt: string
  kioskId: string
  source: CheckinSource
  status: CheckinStatus
  interest: string | null
  office: string | null
  emailOptIn: boolean
  smsOptIn: boolean
}

export interface ContactRecord {
  id: string
  name: string
  phone: string
  email: string | null
  interest: string | null
  office: string | null
  emailOptIn: boolean
  smsOptIn: boolean
  lastCheckinAt: string
  createdAt: string
  updatedAt: string
  visitCount: number
  recentCheckins: CheckinRecord[]
}

export interface DashboardMetricsRecord {
  todayCheckins: number
  totalContacts: number
  consentRate: number
  avgCheckinTime: string | null
  weeklyTrend: { day: string; checkins: number; newContacts: number }[]
  monthlyTrend: { date: string; checkins: number }[]
  topTags: { tag: string; count: number }[]
  hourlyDistribution: { hour: string; count: number }[]
}
