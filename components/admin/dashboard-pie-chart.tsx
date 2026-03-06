"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import {useTranslations} from "next-intl"

interface PieChartProps {
  data: { tag: string; label: string; count: number }[]
}

const INTEREST_COLORS: Record<string, string> = {
  insurance: "#D4AF37",
  investment: "#2BB8A5",
  agent: "#F97360",
  other: "#8B5CF6",
}

const FALLBACK_COLORS = ["#3B82F6", "#F59E0B", "#10B981", "#EF4444", "#8B5CF6", "#EC4899"]

function getInterestColor(tag: string, index: number) {
  return INTEREST_COLORS[tag] ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length]
}

export function DashboardPieChart({ data }: PieChartProps) {
  const t = useTranslations("charts")

  return (
    <div className="rounded-xl border border-border/50 bg-card p-5">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-foreground">{t("pieTitle")}</h3>
        <p className="text-sm text-muted-foreground">{t("pieSubtitle")}</p>
      </div>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              dataKey="count"
              nameKey="label"
              strokeWidth={0}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getInterestColor(data[index].tag, index)}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#111114",
                border: "1px solid #2A2A30",
                borderRadius: "8px",
                color: "#E8E4DD",
                fontSize: 12,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Legend */}
      <div className="mt-2 flex flex-wrap gap-3">
        {data.map((item, i) => (
          <div key={item.tag} className="flex items-center gap-1.5">
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: getInterestColor(item.tag, i) }}
            />
            <span className="text-xs text-muted-foreground">
              {item.label} ({item.count})
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
