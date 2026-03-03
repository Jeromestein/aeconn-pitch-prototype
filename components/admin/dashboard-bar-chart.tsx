"use client"

import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts"
import {useTranslations} from "next-intl"

interface BarChartProps {
  data: { day: string; checkins: number; newContacts: number }[]
}

export function DashboardBarChart({ data }: BarChartProps) {
  const t = useTranslations("charts")

  return (
    <div className="rounded-xl border border-border/50 bg-card p-5">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-foreground">{t("barTitle")}</h3>
        <p className="text-sm text-muted-foreground">{t("barSubtitle")}</p>
      </div>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2A30" vertical={false} />
            <XAxis
              dataKey="day"
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
            <Legend
              wrapperStyle={{ fontSize: 12, color: "#7A7670" }}
            />
            <Bar
              dataKey="checkins"
              fill="#C9A84C"
              name={t("barCheckins")}
              radius={[4, 4, 0, 0]}
              barSize={24}
            />
            <Bar
              dataKey="newContacts"
              fill="#8B7536"
              name={t("barNewContacts")}
              radius={[4, 4, 0, 0]}
              barSize={24}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
