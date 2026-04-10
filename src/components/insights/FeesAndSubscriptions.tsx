"use client"

import { CircleDot } from "lucide-react"
import type { FeeHunter, DuplicateCharge, PriceCreep } from "@/src/types/api"

interface FeesAndSubscriptionsProps {
  feeHunter: FeeHunter
}

export default function FeesAndSubscriptions({ feeHunter }: FeesAndSubscriptionsProps) {
  const { total_fees_detected, fees, subscriptions, duplicate_charges, price_creep } =
    feeHunter

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h3 className="font-heading text-lg font-semibold text-foreground mb-5">
        Fees & Subscriptions
      </h3>

      {/* Total fees banner */}
      {total_fees_detected > 0 && (
        <div className="rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200/50 dark:border-amber-500/20 px-4 py-3 mb-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 tracking-widest uppercase">
              TOTAL FEES
            </p>
            <p className="text-xl font-bold text-amber-800 dark:text-amber-300 font-heading">
              ${total_fees_detected.toFixed(2)}
            </p>
          </div>
        </div>
      )}

      {/* Subscriptions */}
      {subscriptions.length > 0 && (
        <div className="space-y-3 mb-5">
          {subscriptions.map((sub, i) => (
            <div
              key={`${sub.merchant}-${i}`}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <CircleDot className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                <span className="text-sm text-foreground">{sub.merchant}</span>
              </div>
              <span className="text-sm text-muted-foreground tabular-nums">
                ${sub.amount.toFixed(2)}/{sub.frequency === "monthly" ? "mo" : sub.frequency === "annual" ? "yr" : sub.frequency}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Individual fees */}
      {fees.length > 0 && (
        <div className="border-t border-border pt-4 mt-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Fees Found
          </p>
          <div className="space-y-2.5">
            {fees.map((fee, i) => (
              <div
                key={`${fee.type}-${i}`}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                      fee.recurring
                        ? "text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-500/20"
                        : "text-muted-foreground bg-muted"
                    }`}
                  >
                    {fee.recurring ? "RECURRING" : "ONE-TIME"}
                  </span>
                  <span className="text-sm text-foreground">{fee.description}</span>
                </div>
                <span className="text-sm font-medium text-amber-600 dark:text-amber-400 tabular-nums">
                  ${fee.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Duplicate charges */}
      {duplicate_charges.length > 0 && (
        <div className="border-t border-border pt-4 mt-4">
          <p className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-3">
            Possible Duplicate Charges
          </p>
          <div className="space-y-2.5">
            {duplicate_charges.map((dup, i) => (
              <DuplicateChargeRow key={i} charge={dup} />
            ))}
          </div>
        </div>
      )}

      {/* Price creep */}
      {price_creep.length > 0 && (
        <div className="border-t border-border pt-4 mt-4">
          <p className="text-xs font-semibold text-amber-500 uppercase tracking-wider mb-3">
            Price Increases Detected
          </p>
          <div className="space-y-2.5">
            {price_creep.map((pc, i) => (
              <PriceCreepRow key={i} item={pc} />
            ))}
          </div>
        </div>
      )}

      {subscriptions.length === 0 && fees.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No fees or subscriptions detected.
        </p>
      )}
    </div>
  )
}

function DuplicateChargeRow({ charge }: { charge: DuplicateCharge }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div>
        <span className="text-foreground">{charge.description}</span>
        <span className="text-xs text-muted-foreground ml-2">
          ({charge.dates.length}x)
        </span>
      </div>
      <span className="font-medium text-red-500 tabular-nums">
        ${charge.amount.toFixed(2)} each
      </span>
    </div>
  )
}

function PriceCreepRow({ item }: { item: PriceCreep }) {
  const increase = item.new_amount - item.old_amount
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-foreground">{item.merchant}</span>
      <div className="flex items-center gap-2 tabular-nums">
        <span className="text-muted-foreground line-through">
          ${item.old_amount.toFixed(2)}
        </span>
        <span className="text-foreground font-medium">
          ${item.new_amount.toFixed(2)}
        </span>
        <span className="text-[10px] font-semibold text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded">
          +${increase.toFixed(2)}
        </span>
      </div>
    </div>
  )
}
