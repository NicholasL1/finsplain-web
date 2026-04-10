"use client"

import type { Totals, FeeHunter, Summary } from "@/src/types/api"

interface StatCardsProps {
  totals: Totals
  feeHunter: FeeHunter
  summary: Summary
}

export default function StatCards({ totals, feeHunter, summary }: StatCardsProps) {
  const stats: { label: string; value: string; badge?: { text: string; color: string } }[] = [
    {
      label: "TOTAL SPENDING",
      value: `$${totals.total_outflow.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
    },
    {
      label: "TOTAL INCOME",
      value: `$${totals.total_inflow.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
    },
    {
      label: "FEES DETECTED",
      value: `$${feeHunter.total_fees_detected.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      badge: feeHunter.fees.length > 0
        ? { text: `${feeHunter.fees.length} found`, color: "text-amber-600 bg-amber-500/10" }
        : undefined,
    },
    {
      label: "ACTIVE SUBSCRIPTIONS",
      value: `${feeHunter.subscriptions.length}`,
    },
  ]

  if (summary.anomalies.length > 0) {
    stats.push({
      label: "UNUSUAL ACTIVITY",
      value: `${summary.anomalies.length}`,
      badge: { text: "Review", color: "text-red-600 bg-red-500/10" },
    })
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="p-5 rounded-2xl border border-border bg-card"
        >
          <p className="text-[10px] font-semibold text-muted-foreground tracking-widest uppercase mb-2">
            {stat.label}
          </p>
          <div className="flex items-end justify-between">
            <span className="font-heading text-2xl font-bold text-card-foreground">
              {stat.value}
            </span>
            {stat.badge && (
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${stat.badge.color}`}
              >
                {stat.badge.text}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
