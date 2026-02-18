"use client"

import { TrendingUp, TrendingDown, Users, ClipboardCheck, ShieldCheck, Timer } from "lucide-react"
import { mockDashboard } from "@/lib/mock-data"
import { DashboardTrendChart } from "@/components/admin/dashboard-trend-chart"
import { DashboardBarChart } from "@/components/admin/dashboard-bar-chart"
import { DashboardPieChart } from "@/components/admin/dashboard-pie-chart"
import { DashboardHourlyChart } from "@/components/admin/dashboard-hourly-chart"

const metrics = [
  {
    label: "Today Check-ins",
    labelZh: "今日签到",
    value: mockDashboard.todayCheckins,
    delta: mockDashboard.todayCheckinsDelta,
    icon: ClipboardCheck,
  },
  {
    label: "Total Contacts",
    labelZh: "总客户数",
    value: mockDashboard.totalContacts,
    delta: mockDashboard.totalContactsDelta,
    icon: Users,
  },
  {
    label: "Consent Rate",
    labelZh: "同意率",
    value: `${mockDashboard.consentRate}%`,
    delta: mockDashboard.consentRateDelta,
    icon: ShieldCheck,
  },
  {
    label: "Avg Check-in",
    labelZh: "平均签到耗时",
    value: mockDashboard.avgCheckinTime,
    delta: -2.1,
    icon: Timer,
    invertDelta: true,
  },
]

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      {/* Page header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your check-in and marketing data
        </p>
      </div>

      {/* Metric cards */}
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
                  <p className="text-xs text-muted-foreground/60">{m.labelZh}</p>
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

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <DashboardTrendChart data={mockDashboard.monthlyTrend} />
        </div>
        <div>
          <DashboardPieChart data={mockDashboard.topTags} />
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <DashboardBarChart data={mockDashboard.weeklyTrend} />
        <DashboardHourlyChart data={mockDashboard.hourlyDistribution} />
      </div>
    </div>
  )
}
