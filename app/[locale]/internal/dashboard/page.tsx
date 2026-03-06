"use client"

import {TrendingUp, TrendingDown, Users, ClipboardCheck, ShieldCheck, Timer} from "lucide-react"
import {useTranslations} from "next-intl"
import {mockDashboard} from "@/lib/mock-data"
import {DashboardTrendChart} from "@/components/admin/dashboard-trend-chart"
import {DashboardBarChart} from "@/components/admin/dashboard-bar-chart"
import {DashboardPieChart} from "@/components/admin/dashboard-pie-chart"
import {DashboardHourlyChart} from "@/components/admin/dashboard-hourly-chart"

export default function DashboardPage() {
  const t = useTranslations("dashboard")

  const metrics = [
    {
      label: t("metricTodayCheckins"),
      value: mockDashboard.todayCheckins,
      delta: mockDashboard.todayCheckinsDelta,
      icon: ClipboardCheck,
    },
    {
      label: t("metricTotalContacts"),
      value: mockDashboard.totalContacts,
      delta: mockDashboard.totalContactsDelta,
      icon: Users,
    },
    {
      label: t("metricConsentRate"),
      value: `${mockDashboard.consentRate}%`,
      delta: mockDashboard.consentRateDelta,
      icon: ShieldCheck,
    },
    {
      label: t("metricAvgCheckin"),
      value: mockDashboard.avgCheckinTime,
      delta: -2.1,
      icon: Timer,
      invertDelta: true,
    },
  ]

  const weeklyTrendData = mockDashboard.weeklyTrend.map((item, index) => ({
    ...item,
    day: t(`weekday${index}`),
  }))

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((m) => {
          const isPositive = m.invertDelta ? m.delta < 0 : m.delta > 0
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
              <div className="mt-3 flex items-end justify-between">
                <p className="text-3xl font-bold text-foreground">{m.value}</p>
                <div
                  className={`flex items-center gap-0.5 text-sm font-medium ${
                    isPositive ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp className="h-3.5 w-3.5" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5" />
                  )}
                  {Math.abs(m.delta)}%
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <DashboardTrendChart data={mockDashboard.monthlyTrend} />
        </div>
        <div>
          <DashboardPieChart data={mockDashboard.topTags} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <DashboardBarChart data={weeklyTrendData} />
        <DashboardHourlyChart data={mockDashboard.hourlyDistribution} />
      </div>
    </div>
  )
}
