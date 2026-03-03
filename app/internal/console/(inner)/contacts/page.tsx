"use client"

import { useState, useMemo } from "react"
import { Search, Filter, ChevronLeft, ChevronRight, Mail, Phone, Check, X } from "lucide-react"
import { mockContacts } from "@/lib/mock-data"
import type { Contact } from "@/lib/mock-data"
import { ContactDetailPanel } from "@/components/admin/contact-detail-panel"

const PAGE_SIZE = 12

export default function ContactsPage() {
  const [search, setSearch] = useState("")
  const [tagFilter, setTagFilter] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)

  const allTags = useMemo(() => {
    const tags = new Set<string>()
    mockContacts.forEach((c) => c.tags.forEach((t) => tags.add(t)))
    return Array.from(tags).sort()
  }, [])

  const filtered = useMemo(() => {
    return mockContacts.filter((c) => {
      const matchSearch =
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search) ||
        c.email.toLowerCase().includes(search.toLowerCase())
      const matchTag = !tagFilter || c.tags.includes(tagFilter)
      return matchSearch && matchTag
    })
  }, [search, tagFilter])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const pageContacts = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
  }

  return (
    <div className="flex h-full">
      {/* Main list */}
      <div className={`flex flex-1 flex-col gap-6 p-6 lg:p-8 ${selectedContact ? "hidden lg:flex" : ""}`}>
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-foreground">Contacts</h1>
          <p className="text-sm text-muted-foreground">
            {filtered.length} contacts total
          </p>
        </div>

        {/* Filters bar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
            <input
              type="text"
              placeholder="Search by name, phone, or email..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="w-full rounded-lg border border-border bg-surface-2 py-2.5 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 transition-all hover:border-primary/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto">
            <Filter className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
            <button
              onClick={() => { setTagFilter(null); setPage(1) }}
              className={`flex-shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                !tagFilter
                  ? "bg-primary/15 text-primary"
                  : "bg-surface-2 text-muted-foreground hover:text-foreground"
              }`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => { setTagFilter(tag === tagFilter ? null : tag); setPage(1) }}
                className={`flex-shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  tag === tagFilter
                    ? "bg-primary/15 text-primary"
                    : "bg-surface-2 text-muted-foreground hover:text-foreground"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-border/50">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 bg-surface-1">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground md:table-cell">Phone</th>
                <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground lg:table-cell">Email</th>
                <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground sm:table-cell">Tags</th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">Consent</th>
                <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground md:table-cell">Last Visit</th>
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
                  <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">{c.email}</td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {c.tags.slice(0, 2).map((t) => (
                        <span key={t} className="rounded-full bg-surface-2 px-2 py-0.5 text-xs text-muted-foreground">
                          {t}
                        </span>
                      ))}
                      {c.tags.length > 2 && (
                        <span className="rounded-full bg-surface-2 px-2 py-0.5 text-xs text-muted-foreground">
                          +{c.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <div title="Email" className={`flex h-5 w-5 items-center justify-center rounded-full ${c.emailOptIn ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`}>
                        {c.emailOptIn ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      </div>
                      <div title="SMS" className={`flex h-5 w-5 items-center justify-center rounded-full ${c.smsOptIn ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`}>
                        {c.smsOptIn ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                    {formatDate(c.lastVisitAt)}
                  </td>
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

      {/* Detail panel */}
      {selectedContact && (
        <ContactDetailPanel
          contact={selectedContact}
          onClose={() => setSelectedContact(null)}
        />
      )}
    </div>
  )
}
