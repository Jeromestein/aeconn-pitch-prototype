"use client"

import { useEffect, useState } from "react"
import {Users, ClipboardCheck, ShieldCheck, Timer} from "lucide-react"
import {useTranslations} from "next-intl"
import {DashboardTrendChart} from "@/components/admin/dashboard-trend-chart"
import {DashboardBarChart} from "@/components/admin/dashboard-bar-chart"
import {DashboardPieChart} from "@/components/admin/dashboard-pie-chart"
import {DashboardHourlyChart} from "@/components/admin/dashboard-hourly-chart"
import type { DashboardMetricsRecord } from "@/lib/checkins/types"

export default function DashboardPage() {
  const t = useTranslations("dashboard")
  const [dashboard, setDashboard] = useState<DashboardMetricsRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadDashboard() {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch("/api/internal/dashboard", { cache: "no-store" })
        const result = await response.json().catch(() => null)

        if (!response.ok) {
          throw new Error(result?.error || "DASHBOARD_FETCH_FAILED")
        }

        if (!cancelled) {
          setDashboard(result?.dashboard || null)
        }
      } catch (fetchError) {
        if (!cancelled) {
          const errorCode = fetchError instanceof Error ? fetchError.message : "DASHBOARD_FETCH_FAILED"
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
    }

    void loadDashboard()

    return () => {
      cancelled = true
    }
  }, [t])

  const metrics = dashboard ? [
    {
      label: t("metricTodayCheckins"),
      value: dashboard.todayCheckins,
      icon: ClipboardCheck,
    },
    {
      label: t("metricTotalContacts"),
      value: dashboard.totalContacts,
      icon: Users,
    },
    {
      label: t("metricConsentRate"),
      value: `${dashboard.consentRate}%`,
      icon: ShieldCheck,
    },
    {
      label: t("metricAvgCheckin"),
      value: dashboard.avgCheckinTime ?? "—",
      icon: Timer,
    },
  ] : []

  const weeklyTrendData = dashboard?.weeklyTrend.map((item, index) => ({
    ...item,
    day: t(`weekday${index}`),
  })) || []

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((m) => {
          return (
            <div
              key={m.label}
              className="group rounded-xl border border-border/50 bg-card p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_30px_rgba(201,168,76,0.06)]"
            >
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-muted-foreground">{m.label}</p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <m.icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-3xl font-bold text-foreground">{m.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <DashboardTrendChart data={dashboard?.monthlyTrend || []} />
        </div>
        <div>
          <DashboardPieChart data={dashboard?.topTags || []} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <DashboardBarChart data={weeklyTrendData} />
        <DashboardHourlyChart data={dashboard?.hourlyDistribution || []} />
      </div>
    </div>
  )
}
