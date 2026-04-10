"use client"

import { useState, useMemo } from "react"
import { Search } from "lucide-react"
import { format, parseISO } from "date-fns"
import type { Transaction } from "@/src/types/api"

interface TransactionTableProps {
  transactions: Transaction[]
}

export default function TransactionTable({ transactions }: TransactionTableProps) {
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    if (!search.trim()) return transactions
    const q = search.toLowerCase()
    return transactions.filter(
      (tx) =>
        tx.merchant.toLowerCase().includes(q) ||
        tx.category.toLowerCase().includes(q) ||
        tx.raw_description.toLowerCase().includes(q)
    )
  }, [transactions, search])

  // Sort by date descending
  const sorted = useMemo(
    () => [...filtered].sort((a, b) => b.date.localeCompare(a.date)),
    [filtered]
  )

  // Show at most 20 rows
  const visible = sorted.slice(0, 20)

  if (transactions.length === 0) return null

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-heading text-lg font-semibold text-foreground">
          Recent Transactions
        </h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search merchants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-3 py-1.5 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring w-48"
          />
        </div>
      </div>

      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-medium text-muted-foreground pb-3 pr-4">
                Date
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground pb-3 pr-4">
                Merchant
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground pb-3 pr-4">
                Category
              </th>
              <th className="text-right text-xs font-medium text-muted-foreground pb-3">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.map((tx, i) => (
              <tr
                key={`${tx.date}-${tx.merchant}-${i}`}
                className="border-b border-border/50 last:border-0"
              >
                <td className="py-3 pr-4 text-sm text-muted-foreground whitespace-nowrap">
                  {formatDate(tx.date)}
                </td>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {tx.merchant}
                    </span>
                    {tx.is_recurring && (
                      <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/20 px-1.5 py-0.5 rounded tracking-wide">
                        RECURRING
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 pr-4 text-sm text-muted-foreground">
                  {tx.category}
                </td>
                <td
                  className={`py-3 text-sm font-medium text-right tabular-nums whitespace-nowrap ${
                    tx.amount < 0 ? "text-foreground" : "text-emerald-600 dark:text-emerald-400"
                  }`}
                >
                  {tx.amount < 0 ? "– " : "+ "}${Math.abs(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sorted.length > 20 && (
        <p className="text-xs text-muted-foreground text-center mt-4">
          Showing 20 of {sorted.length} transactions
        </p>
      )}
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
