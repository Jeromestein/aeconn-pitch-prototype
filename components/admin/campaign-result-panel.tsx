"use client"

import { X, CheckCircle2, Eye, MousePointerClick, AlertTriangle, XCircle } from "lucide-react"
import {useTranslations} from "next-intl"
import type { Campaign, CampaignMessage } from "@/lib/mock-data"
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts"

interface CampaignResultPanelProps {
  campaign: Campaign
  messages: CampaignMessage[]
  onClose: () => void
}

export function CampaignResultPanel({ campaign, messages, onClose }: CampaignResultPanelProps) {
  const t = useTranslations("campaignResultPanel")
  const stats = {
    delivered: messages.filter((m) => m.status === "delivered").length,
    opened: messages.filter((m) => m.status === "opened").length,
    clicked: messages.filter((m) => m.status === "clicked").length,
    bounced: messages.filter((m) => m.status === "bounced").length,
    failed: messages.filter((m) => m.status === "failed").length,
  }

  const chartData = [
    { name: t("delivered"), value: stats.delivered, color: "#C9A84C" },
    { name: t("opened"), value: stats.opened, color: "#D4AF37" },
    { name: t("clicked"), value: stats.clicked, color: "#E6CE70" },
    { name: t("bounced"), value: stats.bounced, color: "#A08C3A" },
    { name: t("failed"), value: stats.failed, color: "#B33A3A" },
  ]

  const total = messages.length

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
  }

  return (
    <div className="flex w-full flex-col border-l border-border/50 bg-surface-1 lg:w-[450px]">
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
        {/* Campaign info */}
        <div>
          <h4 className="text-lg font-semibold text-foreground">{campaign.name}</h4>
          <p className="mt-1 text-sm text-muted-foreground">{campaign.subject}</p>
          <p className="mt-2 text-xs text-muted-foreground/60">
            {t("created")}: {formatDate(campaign.createdAt)}
            {campaign.sentAt && ` | ${t("sent")}: ${formatDate(campaign.sentAt)}`}
          </p>
        </div>

        {/* Stats grid */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-background p-3">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-xs font-medium">{t("delivered")}</span>
            </div>
            <p className="mt-1 text-xl font-bold text-foreground">{stats.delivered}</p>
            <p className="text-xs text-muted-foreground">{total > 0 ? Math.round((stats.delivered / total) * 100) : 0}%</p>
          </div>
          <div className="rounded-lg bg-background p-3">
            <div className="flex items-center gap-2 text-primary">
              <Eye className="h-4 w-4" />
              <span className="text-xs font-medium">{t("opened")}</span>
            </div>
            <p className="mt-1 text-xl font-bold text-foreground">{stats.opened}</p>
            <p className="text-xs text-muted-foreground">{campaign.openRate || 0}%</p>
          </div>
          <div className="rounded-lg bg-background p-3">
            <div className="flex items-center gap-2 text-gold-light">
              <MousePointerClick className="h-4 w-4" />
              <span className="text-xs font-medium">{t("clicked")}</span>
            </div>
            <p className="mt-1 text-xl font-bold text-foreground">{stats.clicked}</p>
            <p className="text-xs text-muted-foreground">{campaign.clickRate || 0}%</p>
          </div>
          <div className="rounded-lg bg-background p-3">
            <div className="flex items-center gap-2 text-red-400">
              <XCircle className="h-4 w-4" />
              <span className="text-xs font-medium">{t("failed")}</span>
            </div>
            <p className="mt-1 text-xl font-bold text-foreground">{stats.failed + stats.bounced}</p>
            <p className="text-xs text-muted-foreground">{total > 0 ? Math.round(((stats.failed + stats.bounced) / total) * 100) : 0}%</p>
          </div>
        </div>

        {/* Chart */}
        <div className="mt-6">
          <h4 className="text-sm font-medium text-muted-foreground">{t("distribution")}</h4>
          <div className="mt-3 h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#7A7670", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#7A7670", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111114",
                    border: "1px solid #2A2A30",
                    borderRadius: "8px",
                    color: "#E8E4DD",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={28}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Failed reasons */}
        {(stats.failed + stats.bounced) > 0 && (
          <div className="mt-6">
            <h4 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              {t("failureReasons")}
            </h4>
            <div className="mt-2 flex flex-col gap-2">
              {messages
                .filter((m) => m.failReason)
                .slice(0, 5)
                .map((m) => (
                  <div key={m.id} className="flex items-center justify-between rounded-lg bg-background p-3">
                    <div>
                      <p className="text-sm text-foreground">{m.recipientName}</p>
                      <p className="text-xs text-muted-foreground">{m.recipient}</p>
                    </div>
                    <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-xs text-red-400">
                      {m.failReason}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
