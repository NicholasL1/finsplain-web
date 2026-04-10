"use client";

import { useState } from "react";
import { Check, ChevronDown, ChevronUp, Zap, Loader2, CreditCard } from "lucide-react";
import { PLANS, PLAN_MAP, type PlanId } from "@/src/lib/plans";
import { cn } from "@/src/lib/utils";

interface PlanSubscriptionCardProps {
  currentPlan: PlanId;
  creditsUsed: number;
  creditsRemaining: number;
  creditsResetAt: string;
  hasStripeCustomer: boolean;
}

const PRICE_IDS: Partial<Record<PlanId, { monthly: string; annual: string }>> = {
  pro: {
    monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY ?? "",
    annual: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_ANNUAL ?? "",
  },
  business: {
    monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_BUSINESS_MONTHLY ?? "",
    annual: process.env.NEXT_PUBLIC_STRIPE_PRICE_BUSINESS_ANNUAL ?? "",
  },
};

function formatResetDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

const PLAN_BADGE_STYLES: Record<PlanId, string> = {
  starter: "bg-muted text-muted-foreground border-border",
  pro: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  business: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
};

export default function PlanSubscriptionCard({
  currentPlan,
  creditsUsed,
  creditsRemaining,
  creditsResetAt,
  hasStripeCustomer,
}: Readonly<PlanSubscriptionCardProps>) {
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<PlanId | null>(null);
  const [loadingPortal, setLoadingPortal] = useState(false);
  const [annual, setAnnual] = useState(false);

  const plan = PLAN_MAP[currentPlan];
  const creditsTotal = plan.credits;
  const progressPct = Math.min(100, Math.round((creditsUsed / creditsTotal) * 100));

  const handleUpgrade = async (targetPlanId: PlanId) => {
    if (targetPlanId === currentPlan) return;

    // Downgrade or cancellation → send to Customer Portal
    const currentIndex = PLANS.findIndex((p) => p.id === currentPlan);
    const targetIndex = PLANS.findIndex((p) => p.id === targetPlanId);
    const isDowngrade = targetIndex < currentIndex;

    if (isDowngrade || targetPlanId === "starter") {
      await openPortal();
      return;
    }

    setLoadingPlan(targetPlanId);

    const prices = PRICE_IDS[targetPlanId];
    let priceId: string | null = null;
    if (prices) {
      priceId = annual ? prices.annual : prices.monthly;
    }

    if (!priceId) {
      setLoadingPlan(null);
      return;
    }

    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId }),
    });

    const data = await res.json() as { url?: string; error?: string };
    if (data.url) {
      globalThis.location.assign(data.url);
    } else {
      setLoadingPlan(null);
    }
  };

  const openPortal = async () => {
    setLoadingPortal(true);
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const data = await res.json() as { url?: string; error?: string };
    if (data.url) {
      globalThis.location.assign(data.url);
    } else {
      setLoadingPortal(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border border-t-2 border-t-emerald-500/40 p-6 mb-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="font-heading text-lg font-semibold text-foreground mb-0.5">
            Subscription
          </h2>
          <p className="text-sm text-muted-foreground">
            Your current plan and monthly credit usage.
          </p>
        </div>
        <button
          onClick={() => setShowUpgrade((v) => !v)}
          className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors shrink-0"
        >
          {showUpgrade ? (
            <>Close <ChevronUp className="w-4 h-4" /></>
          ) : (
            <>Change Plan <ChevronDown className="w-4 h-4" /></>
          )}
        </button>
      </div>

      {/* Current plan */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
          <Zap className="w-5 h-5 text-emerald-500" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-heading text-base font-bold text-foreground">
              {plan.name}
            </span>
            <span
              className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-medium",
                PLAN_BADGE_STYLES[currentPlan]
              )}
            >
              {plan.monthlyPrice === null
                ? "Free"
                : `$${plan.monthlyPrice.toFixed(2)}/mo`}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {plan.credits} credits/month · {plan.maxPages} pages max · {plan.retention} history
          </p>
        </div>
      </div>

      {/* Credit usage */}
      <div className="p-4 rounded-xl bg-muted/60 border border-border/50 mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            Credits used this month
          </span>
          <span className="text-sm font-semibold text-foreground">
            {creditsUsed} / {creditsTotal}
          </span>
        </div>
        <div className="h-2 rounded-full bg-border overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              progressPct >= 90
                ? "bg-red-500"
                : progressPct >= 70
                ? "bg-amber-500"
                : "bg-emerald-500"
            )}
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-muted-foreground">
            {creditsRemaining} remaining
          </span>
          <span className="text-xs text-muted-foreground">
            Resets {formatResetDate(creditsResetAt)}
          </span>
        </div>
      </div>

      {/* Included features (compact) */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
            <span className="text-xs text-muted-foreground">{f}</span>
          </li>
        ))}
      </ul>

      {/* Manage billing button — only for paying users */}
      {hasStripeCustomer && currentPlan !== "starter" && (
        <button
          onClick={openPortal}
          disabled={loadingPortal}
          className="mt-5 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
        >
          {loadingPortal ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <CreditCard className="w-4 h-4" />
          )}
          Manage billing &amp; invoices
        </button>
      )}

      {/* Upgrade section */}
      {showUpgrade && (
        <div className="mt-6 pt-6 border-t border-border">
          {/* Annual toggle */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-foreground">Choose a plan:</p>
            <div className="flex items-center gap-2 p-0.5 rounded-lg bg-muted border border-border">
              <button
                onClick={() => setAnnual(false)}
                className={cn(
                  "px-3 py-1 rounded-md text-xs font-medium transition-all",
                  annual
                    ? "text-muted-foreground"
                    : "bg-background text-foreground shadow-sm"
                )}
              >
                Monthly
              </button>
              <button
                onClick={() => setAnnual(true)}
                className={cn(
                  "px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1.5",
                  annual
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground"
                )}
              >
                {"Annual "}
                <span className="text-[9px] font-semibold px-1 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  -17%
                </span>
              </button>
            </div>
          </div>

          <div className="grid gap-3">
            {PLANS.map((tier) => {
              const isCurrent = tier.id === currentPlan;
              const isLoading = loadingPlan === tier.id;
              const currentIndex = PLANS.findIndex((p) => p.id === currentPlan);
              const tierIndex = PLANS.findIndex((p) => p.id === tier.id);
              const isDowngrade = tierIndex < currentIndex;
              const displayPrice = annual && tier.annualPrice !== null
                ? tier.annualPrice
                : tier.monthlyPrice;

              return (
                <div
                  key={tier.id}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl border transition-all duration-150",
                    isCurrent
                      ? "border-emerald-500/40 bg-emerald-500/5"
                      : "border-border hover:border-emerald-500/20 hover:bg-muted/50"
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-heading text-sm font-semibold text-foreground">
                        {tier.name}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {tier.credits} credits · {tier.maxPages} pages · {tier.retention} history
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-3">
                    <span className="text-sm font-bold text-foreground">
                      {displayPrice === null ? "Free" : `$${displayPrice.toFixed(2)}/mo`}
                    </span>
                    {!isCurrent && (
                      <button
                        onClick={() => handleUpgrade(tier.id)}
                        disabled={!!loadingPlan || loadingPortal}
                        className={cn(
                          "px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 disabled:opacity-50 min-w-[76px] flex items-center justify-center",
                          tier.highlighted
                            ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                            : "border border-border hover:border-emerald-500/30 hover:bg-muted text-foreground"
                        )}
                      >
                        {isLoading ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <span>{isDowngrade || tier.id === "starter" ? "Downgrade" : "Upgrade"}</span>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Upgrades go through Stripe Checkout. Downgrades and cancellations are handled via the billing portal.
          </p>
        </div>
      )}
    </div>
  );
}
