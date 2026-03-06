"use client"

import {useState} from "react"
import {Plus, Send, Eye, FileText, CheckCircle2, Clock, XCircle} from "lucide-react"
import {useTranslations} from "next-intl"
import {mockCampaigns, mockMessages} from "@/lib/mock-data"
import type {Campaign} from "@/lib/mock-data"
import {CampaignCreateModal} from "@/components/admin/campaign-create-modal"
import {CampaignResultPanel} from "@/components/admin/campaign-result-panel"

export default function CampaignsPage() {
  const t = useTranslations("campaignsPage")
  const [showCreate, setShowCreate] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)

  const statusConfig = {
    draft: {icon: FileText, label: t("statusDraft"), bgClass: "bg-surface-2", textClass: "text-muted-foreground"},
    sending: {icon: Clock, label: t("statusSending"), bgClass: "bg-yellow-500/15", textClass: "text-yellow-400"},
    sent: {icon: CheckCircle2, label: t("statusSent"), bgClass: "bg-emerald-500/15", textClass: "text-emerald-400"},
    failed: {icon: XCircle, label: t("statusFailed"), bgClass: "bg-red-500/15", textClass: "text-red-400"},
  }

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
  }

  return (
    <div className="flex h-full">
      <div className={`flex flex-1 flex-col gap-6 p-6 lg:p-8 ${selectedCampaign ? "hidden lg:flex" : ""}`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
            <p className="text-sm text-muted-foreground">{t("summary", {count: mockCampaigns.length})}</p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:shadow-[0_0_30px_rgba(201,168,76,0.2)]"
          >
            <Plus className="h-4 w-4" />
            {t("newCampaign")}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {mockCampaigns.map((campaign) => {
            const config = statusConfig[campaign.status]
            return (
              <div
                key={campaign.id}
                onClick={() => setSelectedCampaign(campaign)}
                className="group cursor-pointer rounded-xl border border-border/50 bg-card p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_30px_rgba(201,168,76,0.06)]"
              >
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.bgClass} ${config.textClass}`}>
                    <config.icon className="h-3 w-3" />
                    {config.label}
                  </span>
                  <span className="text-xs text-muted-foreground/60">{campaign.id}</span>
                </div>

                <h3 className="mt-3 text-base font-semibold text-foreground transition-colors group-hover:text-primary">
                  {campaign.name}
                </h3>
                <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{campaign.subject}</p>

                <div className="mt-4 flex items-center gap-4 border-t border-border/30 pt-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Send className="h-3 w-3" />
                    {t("recipients", {count: campaign.audienceCount})}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Eye className="h-3 w-3" />
                    {campaign.openRate ? `${campaign.openRate}%` : "—"}
                  </div>
                  <div className="ml-auto text-xs text-muted-foreground/60">{formatDate(campaign.createdAt)}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {selectedCampaign && (
        <CampaignResultPanel
          campaign={selectedCampaign}
          messages={mockMessages.filter((m) => m.campaignId === selectedCampaign.id)}
          onClose={() => setSelectedCampaign(null)}
        />
      )}

      {showCreate && <CampaignCreateModal onClose={() => setShowCreate(false)} />}
    </div>
  )
}
