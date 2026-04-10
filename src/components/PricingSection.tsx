"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Zap } from "lucide-react";
import { motion } from "motion/react";
import AnimateOnScroll from "@/src/components/AnimateOnScroll";

interface PricingTier {
  name: string;
  description: string;
  monthlyPrice: number | null;
  annualPrice: number | null;
  credits: number;
  maxPages: number;
  retention: string;
  features: string[];
  cta: string;
  ctaHref: string;
  highlighted: boolean;
  badge?: string;
}

const tiers: PricingTier[] = [
  {
    name: "Starter",
    description: "Perfect for occasional use — try FinSplain at no cost.",
    monthlyPrice: null,
    annualPrice: null,
    credits: 5,
    maxPages: 5,
    retention: "30 days",
    features: [
      "5 document credits / month",
      "Up to 5 pages per document",
      "Full AI insights dashboard",
      "Spending breakdown & charts",
      "Fee & subscription detection",
      "30-day document history",
    ],
    cta: "Get Started Free",
    ctaHref: "/sign-up",
    highlighted: false,
  },
  {
    name: "Pro",
    description: "For individuals who review finances regularly.",
    monthlyPrice: 9.99,
    annualPrice: 8.33,
    credits: 30,
    maxPages: 10,
    retention: "90 days",
    features: [
      "30 document credits / month",
      "Up to 10 pages per document",
      "Full AI insights dashboard",
      "Spending breakdown & charts",
      "Fee & subscription detection",
      "90-day document history",
      "PDF & CSV export",
      "Priority processing",
    ],
    cta: "Start Pro",
    ctaHref: "/sign-up",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Business",
    description: "For power users, freelancers, and small teams.",
    monthlyPrice: 24.99,
    annualPrice: 20.83,
    credits: 100,
    maxPages: 10,
    retention: "1 year",
    features: [
      "100 document credits / month",
      "Up to 10 pages per document",
      "Full AI insights dashboard",
      "Spending breakdown & charts",
      "Fee & subscription detection",
      "1-year document history",
      "PDF & CSV export",
      "Priority processing",
      "Bulk upload (5 docs at once)",
      "Email alerts for fees & anomalies",
      "Dedicated support",
    ],
    cta: "Start Business",
    ctaHref: "/sign-up",
    highlighted: false,
  },
];

function CreditPill({ credits }: { credits: number }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
        <Zap className="w-3.5 h-3.5 text-emerald-500" />
        <span className="text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
          {credits} credits / mo
        </span>
      </div>
    </div>
  );
}

export default function PricingSection() {
  const [annual, setAnnual] = useState(false);

  return (
    <section
      id="pricing"
      className="py-20 sm:py-28 bg-linear-to-b from-background via-muted to-background dark:via-muted/35 relative overflow-hidden"
    >
      {/* Background orbs */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-emerald-500/5 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 -right-40 w-[400px] h-[400px] rounded-full bg-indigo-500/8 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <AnimateOnScroll direction="up" className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
              Simple Pricing
            </span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Pay for what you use
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base leading-relaxed">
            Each credit analyzes one document — no surprise bills, no hidden
            limits. Unused credits reset monthly.
          </p>
        </AnimateOnScroll>

        {/* Billing toggle */}
        <AnimateOnScroll direction="up" delay={0.05} className="flex justify-center mb-12">
          <div className="flex items-center gap-3 p-1 rounded-xl bg-muted border border-border">
            <button
              onClick={() => setAnnual(false)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                !annual
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                annual
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Annual
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold leading-none">
                2 months free
              </span>
            </button>
          </div>
        </AnimateOnScroll>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.4,
                delay: index * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className={`relative flex flex-col p-7 rounded-2xl border transition-all duration-200 ${
                tier.highlighted
                  ? "border-emerald-500/50 bg-card shadow-xl shadow-emerald-500/8 scale-[1.02]"
                  : "border-border bg-card hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/5 hover:border-emerald-500/20"
              }`}
            >
              {/* Popular badge */}
              {tier.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-500/30">
                    {tier.badge}
                  </span>
                </div>
              )}

              {/* Tier name & description */}
              <div className="mb-5">
                <h3 className="font-heading text-lg font-bold text-card-foreground mb-1">
                  {tier.name}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {tier.description}
                </p>
              </div>

              {/* Credits pill */}
              <CreditPill credits={tier.credits} />

              {/* Price */}
              <div className="mb-6">
                {tier.monthlyPrice === null ? (
                  <div className="flex items-end gap-1">
                    <span className="font-heading text-4xl font-bold text-card-foreground">
                      Free
                    </span>
                  </div>
                ) : (
                  <div className="flex items-end gap-1">
                    <span className="font-heading text-4xl font-bold text-card-foreground">
                      ${annual ? tier.annualPrice?.toFixed(2) : tier.monthlyPrice.toFixed(2)}
                    </span>
                    <span className="text-muted-foreground text-sm mb-1.5">/mo</span>
                  </div>
                )}
                {annual && tier.monthlyPrice !== null && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Billed annually —{" "}
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                      save ${((tier.monthlyPrice - (tier.annualPrice ?? 0)) * 12).toFixed(0)}/yr
                    </span>
                  </p>
                )}
                {!annual && tier.monthlyPrice !== null && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Or{" "}
                    <button
                      onClick={() => setAnnual(true)}
                      className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline underline-offset-2"
                    >
                      ${tier.annualPrice?.toFixed(2)}/mo
                    </button>{" "}
                    billed annually
                  </p>
                )}
              </div>

              {/* Limits */}
              <div className="flex gap-4 mb-6 p-3 rounded-xl bg-muted/60 border border-border/50">
                <div className="text-center flex-1">
                  <p className="text-xs text-muted-foreground mb-0.5">Max pages</p>
                  <p className="text-sm font-semibold text-card-foreground">{tier.maxPages}</p>
                </div>
                <div className="w-px bg-border" />
                <div className="text-center flex-1">
                  <p className="text-xs text-muted-foreground mb-0.5">History</p>
                  <p className="text-sm font-semibold text-card-foreground">{tier.retention}</p>
                </div>
              </div>

              {/* CTA */}
              <Link
                href={tier.ctaHref}
                className={`w-full inline-flex items-center justify-center px-5 py-3 rounded-xl text-sm font-medium transition-all duration-150 active:scale-[0.98] mb-6 ${
                  tier.highlighted
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                    : "border border-border hover:border-emerald-500/30 hover:bg-muted text-foreground"
                }`}
              >
                {tier.cta}
              </Link>

              {/* Divider */}
              <div className="border-t border-border mb-5" />

              {/* Features */}
              <ul className="space-y-3 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check
                      className={`w-4 h-4 mt-0.5 shrink-0 ${
                        tier.highlighted ? "text-emerald-500" : "text-emerald-500/70"
                      }`}
                    />
                    <span className="text-sm text-muted-foreground leading-relaxed">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Footer note */}
        <AnimateOnScroll direction="up" delay={0.2} className="text-center mt-10">
          <p className="text-sm text-muted-foreground">
            All plans include end-to-end encryption and our full privacy commitment.{" "}
            <Link
              href="/privacy"
              className="text-emerald-600 dark:text-emerald-400 hover:underline underline-offset-2"
            >
              Learn more
            </Link>
          </p>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
