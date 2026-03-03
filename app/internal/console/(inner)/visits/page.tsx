"use client"

import { useState, useMemo } from "react"
import { Search, ChevronLeft, ChevronRight, Monitor, Globe, Hand } from "lucide-react"
import { mockVisits } from "@/lib/mock-data"

const PAGE_SIZE = 15

export default function VisitsPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    return mockVisits.filter((v) => {
      const matchSearch =
        !search ||
        v.contactName.toLowerCase().includes(search.toLowerCase()) ||
        v.contactId.includes(search) ||
        v.id.includes(search)
      const matchStatus = !statusFilter || v.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [search, statusFilter])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const pageVisits = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
  }

  const sourceIcon = (source: string) => {
    if (source === "kiosk") return <Monitor className="h-3.5 w-3.5" />
    if (source === "web") return <Globe className="h-3.5 w-3.5" />
    return <Hand className="h-3.5 w-3.5" />
  }

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground">Visit Records</h1>
        <p className="text-sm text-muted-foreground">
          {filtered.length} check-in records
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="w-full rounded-lg border border-border bg-surface-2 py-2.5 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 transition-all hover:border-primary/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="flex items-center gap-2">
          {["all", "completed", "pending", "cancelled"].map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatusFilter(s === "all" ? null : s)
                setPage(1)
              }}
              className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors ${
                (s === "all" && !statusFilter) || s === statusFilter
                  ? "bg-primary/15 text-primary"
                  : "bg-surface-2 text-muted-foreground hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border/50">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50 bg-surface-1">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">ID</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Contact</th>
              <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground sm:table-cell">Source</th>
              <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground md:table-cell">Kiosk</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Time</th>
            </tr>
          </thead>
          <tbody>
            {pageVisits.map((v) => (
              <tr key={v.id} className="border-b border-border/30 transition-colors hover:bg-surface-1">
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{v.id}</td>
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-foreground">{v.contactName}</p>
                    <p className="text-xs text-muted-foreground">{v.contactId}</p>
                  </div>
                </td>
                <td className="hidden px-4 py-3 sm:table-cell">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    {sourceIcon(v.source)}
                    <span className="capitalize text-xs">{v.source}</span>
                  </div>
                </td>
                <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">{v.kioskId}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    v.status === "completed" ? "bg-emerald-500/15 text-emerald-400"
                    : v.status === "pending" ? "bg-yellow-500/15 text-yellow-400"
                    : "bg-red-500/15 text-red-400"
                  }`}>
                    {v.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{formatDate(v.checkedInAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </p>
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
  )
}
