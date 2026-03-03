"use client"

import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import {useTranslations} from "next-intl"

interface HourlyChartProps {
  data: { hour: string; count: number }[]
}

export function DashboardHourlyChart({ data }: HourlyChartProps) {
  const t = useTranslations("charts")

  return (
    <div className="rounded-xl border border-border/50 bg-card p-5">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-foreground">{t("hourlyTitle")}</h3>
        <p className="text-sm text-muted-foreground">{t("hourlySubtitle")}</p>
      </div>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="hourlyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C9A84C" stopOpacity={1} />
                <stop offset="100%" stopColor="#C9A84C" stopOpacity={0.4} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2A30" vertical={false} />
            <XAxis
              dataKey="hour"
              tick={{ fill: "#7A7670", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#7A7670", fontSize: 11 }}
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
            <Bar
              dataKey="count"
              fill="url(#hourlyGradient)"
              name={t("hourlyCheckins")}
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
