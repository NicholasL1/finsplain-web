"use client"

import type { Category } from "@/src/types/api"

interface CategoryBreakdownProps {
  categories: Category[]
}

const CATEGORY_COLORS: Record<string, string> = {
  Groceries: "#10B981",
  Dining: "#3B82F6",
  Transportation: "#8B5CF6",
  Gas: "#F59E0B",
  Entertainment: "#EC4899",
  Shopping: "#6366F1",
  Healthcare: "#14B8A6",
  Utilities: "#64748B",
  Housing: "#0EA5E9",
  Insurance: "#A855F7",
  "Banking Fees": "#EF4444",
  Subscriptions: "#F97316",
  Income: "#22C55E",
  Transfer: "#94A3B8",
  Government: "#0891B2",
  Education: "#7C3AED",
  Travel: "#2563EB",
  "Personal Care": "#D946EF",
  Charity: "#059669",
  Other: "#9CA3AF",
}

function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] || "#9CA3AF"
}

export default function CategoryBreakdown({ categories }: CategoryBreakdownProps) {
  if (categories.length === 0) return null

  const maxAmount = Math.max(...categories.map((c) => c.amount))

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h3 className="font-heading text-lg font-semibold text-foreground mb-5">
        Top Spending Categories
      </h3>
      <div className="space-y-5">
        {categories.map((cat) => {
          const pct = maxAmount > 0 ? (cat.amount / maxAmount) * 100 : 0
          const color = getCategoryColor(cat.category)

          return (
            <div key={cat.category}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-foreground">
                  {cat.category}
                </span>
                <span className="text-sm font-semibold text-foreground tabular-nums">
                  ${cat.amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="relative h-2 w-full rounded-full bg-muted">
                <div
                  className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
