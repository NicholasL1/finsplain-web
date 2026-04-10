"use client"

import { AlertTriangle } from "lucide-react"
import { format, parseISO } from "date-fns"
import type { Anomaly } from "@/src/types/api"

interface AnomaliesCardProps {
  anomalies: Anomaly[]
}

export default function AnomaliesCard({ anomalies }: AnomaliesCardProps) {
  if (anomalies.length === 0) return null

  return (
    <div className="rounded-2xl border border-red-200 dark:border-red-500/20 bg-red-50/50 dark:bg-red-500/5 p-6">
      <h3 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-red-500" />
        Unusual Activity
      </h3>
      <div className="space-y-3">
        {anomalies.map((item, i) => (
          <div
            key={i}
            className="flex items-start justify-between py-2 border-b border-red-200/30 dark:border-red-500/10 last:border-0"
          >
            <div className="flex-1 min-w-0 mr-4">
              <p className="text-sm font-medium text-foreground">
                {item.description}
              </p>
              {item.date && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatDate(item.date)}
                </p>
              )}
            </div>
            {item.amount != null && item.amount > 0 && (
              <span className="text-sm font-semibold text-red-600 dark:text-red-400 tabular-nums flex-shrink-0">
                ${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function formatDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), "MMM d, yyyy")
  } catch {
    return dateStr
  }
}
