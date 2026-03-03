"use client"

import { X, Mail, Phone, Globe, Calendar, Tag, ShieldCheck, Clock } from "lucide-react"
import {useTranslations} from "next-intl"
import type { Contact } from "@/lib/mock-data"
import { mockVisits } from "@/lib/mock-data"

interface ContactDetailPanelProps {
  contact: Contact
  onClose: () => void
}

export function ContactDetailPanel({ contact, onClose }: ContactDetailPanelProps) {
  const t = useTranslations("contactDetailPanel")
  const contactVisits = mockVisits
    .filter((v) => v.contactId === contact.id)
    .slice(0, 5)

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
  }

  return (
    <div className="flex w-full flex-col border-l border-border/50 bg-surface-1 lg:w-[400px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 px-6 py-4">
        <h3 className="text-base font-semibold text-foreground">{t("title")}</h3>
        <button
          onClick={onClose}
          className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Avatar & name */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
            {contact.name[0]}
          </div>
          <div>
            <h4 className="text-lg font-semibold text-foreground">{contact.name}</h4>
            <p className="text-sm text-muted-foreground">{contact.id}</p>
          </div>
        </div>

        {/* Info cards */}
        <div className="mt-6 flex flex-col gap-3">
          <div className="flex items-center gap-3 rounded-lg bg-background p-3">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-foreground">{contact.phone}</span>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-background p-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-foreground">{contact.email}</span>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-background p-3">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-foreground">{contact.lang === "zh" ? t("langChinese") : t("langEnglish")}</span>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-background p-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-foreground">{t("created", {value: formatDate(contact.createdAt)})}</span>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-background p-3">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-foreground">{t("visits", {count: contact.visitCount})}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="mt-5">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Tag className="h-4 w-4" />
            {t("tags")}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {contact.tags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Consent */}
        <div className="mt-5">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <ShieldCheck className="h-4 w-4" />
            {t("consent")}
          </div>
          <div className="mt-2 flex flex-col gap-2">
            <div className="flex items-center justify-between rounded-lg bg-background p-3">
              <span className="text-sm text-foreground">{t("emailNotifications")}</span>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${contact.emailOptIn ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`}>
                {contact.emailOptIn ? t("optedIn") : t("optedOut")}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-background p-3">
              <span className="text-sm text-foreground">{t("smsNotifications")}</span>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${contact.smsOptIn ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`}>
                {contact.smsOptIn ? t("optedIn") : t("optedOut")}
              </span>
            </div>
          </div>
        </div>

        {/* Recent visits */}
        <div className="mt-5">
          <h4 className="text-sm font-medium text-muted-foreground">{t("recentVisits")}</h4>
          <div className="mt-2 flex flex-col gap-2">
            {contactVisits.length === 0 ? (
              <p className="text-sm text-muted-foreground/60">{t("noVisits")}</p>
            ) : (
              contactVisits.map((v) => (
                <div key={v.id} className="flex items-center justify-between rounded-lg bg-background p-3">
                  <div>
                    <p className="text-sm text-foreground">{v.kioskId}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(v.checkedInAt)}</p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    v.status === "completed" ? "bg-emerald-500/15 text-emerald-400"
                    : v.status === "pending" ? "bg-yellow-500/15 text-yellow-400"
                    : "bg-red-500/15 text-red-400"
                  }`}>
                    {v.status === "completed" ? t("statusCompleted") : v.status === "pending" ? t("statusPending") : t("statusCancelled")}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
