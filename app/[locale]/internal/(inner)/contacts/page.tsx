"use client"

import {ChangeEvent, useEffect, useMemo, useRef, useState} from "react"
import {Search, ChevronLeft, ChevronRight, Check, X, Download, Upload} from "lucide-react"
import {useTranslations} from "next-intl"
import {ContactDetailPanel} from "@/components/admin/contact-detail-panel"
import {Button} from "@/components/ui/button"
import {toast} from "@/hooks/use-toast"
import type { ContactRecord } from "@/lib/checkins/types"
import { getInterestTranslationKey } from "@/lib/checkins/interest"
import { buildCsvContent, downloadCsvFile, parseCsvContent } from "@/lib/csv"

const PAGE_SIZE = 12

type ImportedContactRow = {
  name: string
  phone: string
  email?: string
  interest?: string
  office?: string
  emailOptIn?: string
  smsOptIn?: string
  createdAt?: string
  lastCheckinAt?: string
}

export default function ContactsPage() {
  const t = useTranslations("contactsPage")
  const kioskFormT = useTranslations("kioskForm")
  const [contacts, setContacts] = useState<ContactRecord[]>([])
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [selectedContact, setSelectedContact] = useState<ContactRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)
  const [importing, setImporting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const getColumnValue = (headers: string[], row: string[], aliases: string[]) => {
    const index = headers.findIndex((header) => aliases.includes(header.trim()))
    return index >= 0 ? (row[index] || "").trim() : ""
  }

  const parseImportedContacts = (content: string) => {
    const rows = parseCsvContent(content)

    if (rows.length < 2) {
      throw new Error("IMPORT_EMPTY")
    }

    const [headerRow, ...dataRows] = rows
    const headers = headerRow.map((header) => header.trim())
    const importedRows = dataRows
      .map<ImportedContactRow>((row) => ({
        name: getColumnValue(headers, row, ["姓名", "Name"]),
        phone: getColumnValue(headers, row, ["手机号", "Phone"]),
        email: getColumnValue(headers, row, ["邮箱", "Email"]),
        interest: getColumnValue(headers, row, ["兴趣方向", "Interest"]),
        office: getColumnValue(headers, row, ["办公室", "Office"]),
        emailOptIn: getColumnValue(headers, row, ["邮件授权", "Email Consent"]),
        smsOptIn: getColumnValue(headers, row, ["短信授权", "SMS Consent"]),
        createdAt: getColumnValue(headers, row, ["创建时间", "Created At"]),
        lastCheckinAt: getColumnValue(headers, row, ["最近来访", "Last Visit"]),
      }))
      .filter((row) => Object.values(row).some((value) => value && value.length > 0))

    if (importedRows.length === 0) {
      throw new Error("IMPORT_EMPTY")
    }

    if (importedRows.some((row) => !row.name || !row.phone)) {
      throw new Error("IMPORT_REQUIRED_FIELDS")
    }

    return importedRows
  }

  async function refreshContacts() {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/internal/contacts", { cache: "no-store" })
      const result = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(result?.error || "CONTACTS_FETCH_FAILED")
      }

      setContacts(result?.contacts || [])
    } catch (fetchError) {
      const errorCode = fetchError instanceof Error ? fetchError.message : "CONTACTS_FETCH_FAILED"
      setError(
        errorCode === "SUPABASE_NOT_CONFIGURED"
          ? t("errors.config")
          : errorCode === "SUPABASE_SCHEMA_MISSING"
            ? t("errors.schema")
            : t("errors.generic")
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let cancelled = false

    void (async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch("/api/internal/contacts", { cache: "no-store" })
        const result = await response.json().catch(() => null)

        if (!response.ok) {
          throw new Error(result?.error || "CONTACTS_FETCH_FAILED")
        }

        if (!cancelled) {
          setContacts(result?.contacts || [])
        }
      } catch (fetchError) {
        if (!cancelled) {
          const errorCode = fetchError instanceof Error ? fetchError.message : "CONTACTS_FETCH_FAILED"
          setError(
            errorCode === "SUPABASE_NOT_CONFIGURED"
              ? t("errors.config")
              : errorCode === "SUPABASE_SCHEMA_MISSING"
                ? t("errors.schema")
                : t("errors.generic")
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [t])

  const filtered = useMemo(() => {
    return contacts.filter((c) => {
      const matchSearch =
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search) ||
        (c.email || "").toLowerCase().includes(search.toLowerCase())
      return matchSearch
    })
  }, [contacts, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageContacts = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
  }

  const formatInterest = (interest: string | null) => {
    const key = getInterestTranslationKey(interest)
    return key ? kioskFormT(key) : interest || "—"
  }

  const handleExport = () => {
    if (filtered.length === 0 || exporting) {
      return
    }

    setExporting(true)

    try {
      const content = buildCsvContent(
        [
          t("headerName"),
          t("headerPhone"),
          t("headerEmail"),
          t("headerInterest"),
          t("headerOffice"),
          t("headerConsentEmail"),
          t("headerConsentSms"),
          t("headerVisitCount"),
          t("headerCreatedAt"),
          t("headerLastVisit"),
        ],
        filtered.map((contact) => [
          contact.name,
          contact.phone,
          contact.email || "",
          formatInterest(contact.interest),
          contact.office || "",
          contact.emailOptIn,
          contact.smsOptIn,
          contact.visitCount,
          formatDate(contact.createdAt),
          formatDate(contact.lastCheckinAt),
        ])
      )

      const dateKey = new Date().toISOString().slice(0, 10)
      downloadCsvFile(`contacts-${dateKey}.csv`, content)
    } finally {
      setExporting(false)
    }
  }

  const handleImportClick = () => {
    if (importing) {
      return
    }

    fileInputRef.current?.click()
  }

  const handleImportFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ""

    if (!file) {
      return
    }

    setImporting(true)

    try {
      const content = await file.text()
      const rows = parseImportedContacts(content)
      const response = await fetch("/api/internal/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rows }),
      })
      const result = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(result?.error || "CONTACTS_IMPORT_FAILED")
      }

      await refreshContacts()

      toast({
        title: t("importSuccessTitle"),
        description: t("importSuccessDescription", { count: result?.imported || rows.length }),
      })
    } catch (importError) {
      const errorCode = importError instanceof Error ? importError.message : "CONTACTS_IMPORT_FAILED"
      const description =
        errorCode === "IMPORT_EMPTY"
          ? t("importErrors.empty")
          : errorCode === "IMPORT_REQUIRED_FIELDS" || errorCode === "INVALID_PAYLOAD"
            ? t("importErrors.required")
            : errorCode === "INVALID_EMAIL"
              ? t("importErrors.email")
              : errorCode === "INVALID_DATE"
                ? t("importErrors.date")
                : t("importErrors.generic")

      toast({
        title: t("importErrorTitle"),
        description,
        variant: "destructive",
      })
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="flex h-full">
      <div className={`flex flex-1 flex-col gap-6 p-6 lg:p-8 ${selectedContact ? "hidden lg:flex" : ""}`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
            <p className="text-sm text-muted-foreground">{t("summary", {count: filtered.length})}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={handleImportFile}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleImportClick}
              disabled={loading || !!error || importing}
            >
              <Upload className="h-4 w-4" />
              {importing ? t("importing") : t("import")}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleExport}
              disabled={loading || !!error || filtered.length === 0 || exporting}
            >
              <Download className="h-4 w-4" />
              {exporting ? t("exporting") : t("export")}
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="rounded-xl border border-border/50 bg-card p-6 text-sm text-muted-foreground">
            {t("loading")}
          </div>
        ) : null}

        {error ? (
          <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-6 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="w-full rounded-lg border border-border bg-surface-2 py-2.5 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 transition-all hover:border-primary/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-border/50">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 bg-surface-1">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">{t("headerName")}</th>
                <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground md:table-cell">{t("headerPhone")}</th>
                <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground lg:table-cell">{t("headerEmail")}</th>
                <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground sm:table-cell">{t("headerInterest")}</th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">{t("headerConsent")}</th>
                <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground md:table-cell">{t("headerLastVisit")}</th>
              </tr>
            </thead>
            <tbody>
              {pageContacts.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => setSelectedContact(c)}
                  className="cursor-pointer border-b border-border/30 transition-colors hover:bg-surface-1"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {c.name[0]}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">{c.phone}</td>
                  <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">{c.email || "—"}</td>
                  <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">{formatInterest(c.interest)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <div
                        title={t("tooltipEmail")}
                        className={`flex h-5 w-5 items-center justify-center rounded-full ${c.emailOptIn ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`}
                      >
                        {c.emailOptIn ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      </div>
                      <div
                        title={t("tooltipSms")}
                        className={`flex h-5 w-5 items-center justify-center rounded-full ${c.smsOptIn ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`}
                      >
                        {c.smsOptIn ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                    {formatDate(c.lastCheckinAt)}
                  </td>
                </tr>
              ))}
              {!loading && !error && pageContacts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-muted-foreground">
                    {t("empty")}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{t("page", {page, total: totalPages})}</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {selectedContact && (
        <ContactDetailPanel
          contact={selectedContact}
          onClose={() => setSelectedContact(null)}
        />
      )}
    </div>
  )
}
