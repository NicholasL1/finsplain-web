"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/src/components/ui/chart"
import type { Transaction } from "@/src/types/api"
import { format, parseISO } from "date-fns"

interface SpendingChartProps {
  transactions: Transaction[]
  dateRange: { start: string; end: string }
}

const chartConfig = {
  spending: {
    label: "Spending",
    color: "#10B981",
  },
} satisfies ChartConfig

export default function SpendingChart({ transactions, dateRange }: SpendingChartProps) {
  // Aggregate daily spending (outflows only)
  const dailyMap = new Map<string, number>()

  for (const tx of transactions) {
    if (tx.amount < 0) {
      const day = tx.date
      dailyMap.set(day, (dailyMap.get(day) || 0) + Math.abs(tx.amount))
    }
  }

  // Build sorted data points
  const data = Array.from(dailyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, amount]) => ({
      date,
      spending: Math.round(amount * 100) / 100,
      label: format(parseISO(date), "MMM d"),
    }))

  if (data.length === 0) return null

  const periodLabel = (() => {
    try {
      const start = parseISO(dateRange.start)
      return format(start, "MMMM yyyy")
    } catch {
      return ""
    }
  })()

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-1">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {periodLabel}
        </p>
        <h3 className="font-heading text-lg font-semibold text-foreground">
          Spending Over Time
        </h3>
      </div>
      <ChartContainer config={chartConfig} className="aspect-[2.5/1] w-full mt-4">
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            fontSize={11}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={4}
            fontSize={11}
            tickFormatter={(v: number) => `$${v}`}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value) => `$${Number(value).toFixed(2)}`}
              />
            }
          />
          <Area
            type="monotone"
            dataKey="spending"
            stroke="#10B981"
            strokeWidth={2}
            fill="url(#spendingGradient)"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}
