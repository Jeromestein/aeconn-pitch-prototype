"use client"

import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

interface TrendChartProps {
  data: { date: string; checkins: number }[]
}

export function DashboardTrendChart({ data }: TrendChartProps) {
  return (
    <div className="rounded-xl border border-border/50 bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground">Check-in Trend</h3>
          <p className="text-sm text-muted-foreground">Daily check-ins over 30 days</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-surface-2 px-3 py-1.5 text-xs text-muted-foreground">
          Last 30 Days
        </div>
      </div>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C9A84C" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#C9A84C" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2A30" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: "#7A7670", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
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
            <Area
              type="monotone"
              dataKey="checkins"
              stroke="#C9A84C"
              strokeWidth={2}
              fill="url(#goldGradient)"
              name="Check-ins"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
