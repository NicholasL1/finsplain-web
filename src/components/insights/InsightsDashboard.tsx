"use client"

import type { DocumentResult } from "@/src/types/api"
import {
  SpendingChart,
  StatCards,
  CategoryBreakdown,
  FeesAndSubscriptions,
  TransactionTable,
  AnomaliesCard,
  SummaryBullets,
} from "@/src/components/insights"

interface InsightsDashboardProps {
  result: DocumentResult
}

export default function InsightsDashboard({ result }: InsightsDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Row 1: Spending over time chart */}
      <SpendingChart
        transactions={result.transactions}
        dateRange={result.date_range}
      />

      {/* Row 2: Stat cards */}
      <StatCards
        totals={result.totals}
        feeHunter={result.fee_hunter}
        summary={result.summary}
      />

      {/* Row 3: Two-column — Categories + Fees/Subscriptions */}
      <div className="grid lg:grid-cols-2 gap-6">
        <CategoryBreakdown categories={result.summary.top_categories} />
        <FeesAndSubscriptions feeHunter={result.fee_hunter} />
      </div>

      {/* Row 4: Transaction table */}
      <TransactionTable transactions={result.transactions} />

      {/* Row 5: Two-column — Key takeaways + Anomalies */}
      <div className="grid lg:grid-cols-2 gap-6">
        <SummaryBullets bullets={result.summary.bullets} />
        <AnomaliesCard anomalies={result.summary.anomalies} />
      </div>
    </div>
  )
}
