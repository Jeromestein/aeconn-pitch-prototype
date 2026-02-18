"use client"

import { useState } from "react"
import { X, Users, Mail, Eye, Send } from "lucide-react"

interface CampaignCreateModalProps {
  onClose: () => void
}

const audienceFilters = [
  { id: "email_opt_in", label: "Email Opted In", count: 102 },
  { id: "vip", label: "VIP Customers", count: 28 },
  { id: "new_customer", label: "New Customers (30d)", count: 34 },
  { id: "high_intent", label: "High Intent", count: 45 },
  { id: "return_visit", label: "Return Visitors", count: 38 },
]

export function CampaignCreateModal({ onClose }: CampaignCreateModalProps) {
  const [step, setStep] = useState<"config" | "preview" | "sent">("config")
  const [name, setName] = useState("")
  const [subject, setSubject] = useState("")
  const [selectedFilters, setSelectedFilters] = useState<string[]>(["email_opt_in"])
  const [isSending, setIsSending] = useState(false)

  const totalAudience = audienceFilters
    .filter((f) => selectedFilters.includes(f.id))
    .reduce((sum, f) => sum + f.count, 0)

  const handleSend = async () => {
    setIsSending(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsSending(false)
    setStep("sent")
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-4xl rounded-xl border border-border/50 bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/50 px-6 py-4">
          <h2 className="text-lg font-semibold text-foreground">
            {step === "sent" ? "Campaign Sent" : "New Email Campaign"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {step === "sent" ? (
          <div className="flex flex-col items-center gap-6 px-6 py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15">
              <Send className="h-8 w-8 text-emerald-400" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-foreground">Campaign Queued</h3>
              <p className="mt-2 text-muted-foreground">
                Your campaign &quot;{name || "Untitled Campaign"}&quot; has been queued for delivery to {totalAudience} recipients.
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:shadow-[0_0_30px_rgba(201,168,76,0.2)]"
            >
              Back to Campaigns
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row">
            {/* Left: Configuration */}
            <div className="flex-1 border-b border-border/50 p-6 lg:border-b-0 lg:border-r">
              <h3 className="text-sm font-medium text-muted-foreground">Campaign Settings</h3>

              <div className="mt-4 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">Campaign Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Spring Promotion"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 transition-all hover:border-primary/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">Email Subject</label>
                  <input
                    type="text"
                    placeholder="e.g., You're Invited..."
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 transition-all hover:border-primary/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">
                    <Users className="mr-1.5 inline h-4 w-4" />
                    Audience Filters
                  </label>
                  <div className="flex flex-col gap-2">
                    {audienceFilters.map((f) => (
                      <label
                        key={f.id}
                        className="flex cursor-pointer items-center justify-between rounded-lg border border-border/50 bg-surface-2 px-4 py-3 transition-all hover:border-primary/40"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            onClick={() =>
                              setSelectedFilters((prev) =>
                                prev.includes(f.id) ? prev.filter((x) => x !== f.id) : [...prev, f.id]
                              )
                            }
                            className={`flex h-4 w-4 items-center justify-center rounded border transition-all ${
                              selectedFilters.includes(f.id)
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border"
                            }`}
                          >
                            {selectedFilters.includes(f.id) && (
                              <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className="text-sm text-foreground">{f.label}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{f.count} people</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2 rounded-lg bg-primary/5 px-4 py-3">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-sm text-primary font-medium">
                  Estimated audience: {totalAudience} recipients
                </span>
              </div>
            </div>

            {/* Right: Preview */}
            <div className="flex flex-1 flex-col p-6">
              <h3 className="text-sm font-medium text-muted-foreground">
                <Eye className="mr-1.5 inline h-4 w-4" />
                Email Preview
              </h3>

              <div className="mt-4 flex-1 rounded-lg border border-border/50 bg-surface-2 p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/30 bg-background">
                      <span className="text-sm font-bold text-primary">A</span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">Aeconn</span>
                  </div>
                  <div className="h-px w-full bg-border/50" />
                  <h4 className="text-lg font-semibold text-foreground">
                    {subject || "Email subject will appear here..."}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Dear Customer,
                    <br /><br />
                    Thank you for visiting Aeconn. We&apos;re excited to share our latest updates with you.
                    As a valued member of our community, you have exclusive access to premium offerings.
                    <br /><br />
                    Click below to learn more about what we have prepared for you.
                  </p>
                  <div className="mt-2 inline-flex self-start rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground">
                    Learn More
                  </div>
                  <div className="mt-4 h-px w-full bg-border/50" />
                  <p className="text-xs text-muted-foreground/60">
                    Aeconn Inc. | You&apos;re receiving this because you opted in.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-3">
                <button
                  onClick={onClose}
                  className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
                >
                  Save as Draft
                </button>
                <button
                  onClick={handleSend}
                  disabled={isSending}
                  className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:shadow-[0_0_30px_rgba(201,168,76,0.2)] disabled:opacity-60"
                >
                  {isSending ? (
                    <span className="flex items-center gap-2">
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                        <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Campaign
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
