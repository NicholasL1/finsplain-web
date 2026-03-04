"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import HowItWorksDemo from "@/src/components/HowItWorksDemo";

export default function Hero({ firstName }: { firstName?: string }) {
  const [demoExpanded, setDemoExpanded] = useState(false);
  return (
    <section className="relative overflow-hidden bg-background">
      {/* Full-section diagonal gradient overlay */}
      <div
        className="absolute inset-0 bg-linear-to-br from-emerald-500/10 via-transparent to-indigo-500/8 pointer-events-none"
        aria-hidden="true"
      />
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-emerald-500/50 to-transparent pointer-events-none"
        aria-hidden="true"
      />
      {/* Decorative gradient orbs */}
      <div
        className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-emerald-500/15 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-indigo-500/12 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative pt-16 pb-16 sm:pt-20 sm:pb-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-12 lg:gap-16 items-start">

            {/* Left column: headline + CTA */}
            <div className="max-w-xl lg:pt-10">
              {/* Brand badge */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium mb-5">
                  <Sparkles className="w-3 h-3" />
                  AI-Powered Financial Analysis
                </span>
              </motion.div>

              {firstName && (
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="text-sm font-medium text-emerald-500 mb-4 tracking-wide"
                >
                  Welcome back, {firstName}!
                </motion.p>
              )}

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="font-heading text-[40px] sm:text-[52px] lg:text-[52px] font-bold text-foreground mb-6 leading-[1.15] tracking-tight"
              >
                Understand your finances,{" "}
                <span className="bg-linear-to-r from-emerald-500 via-emerald-400 to-teal-300 bg-clip-text text-transparent">
                  without the jargon
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="text-lg sm:text-xl text-muted-foreground mb-10 leading-relaxed"
              >
                Upload any financial document and get clear, actionable insights
                about fees, subscriptions, spending patterns, and unusual
                activity — in seconds.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="flex flex-col sm:flex-row gap-4"
              >
                {firstName ? (
                  <Link
                    href="/dashboard"
                    className="group inline-flex items-center px-7 py-3.5 text-white bg-emerald-500 rounded-xl hover:bg-emerald-600 transition-all duration-150 text-base font-medium active:scale-[0.98]"
                  >
                    Go to Dashboard
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-150 group-hover:translate-x-0.5" />
                  </Link>
                ) : (
                  <Link
                    href="/sign-up"
                    className="group inline-flex items-center px-7 py-3.5 text-white bg-emerald-500 rounded-xl hover:bg-emerald-600 transition-all duration-150 text-base font-medium active:scale-[0.98]"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-150 group-hover:translate-x-0.5" />
                  </Link>
                )}
              </motion.div>

              {/* Benefit bullets — revealed only after the demo expands */}
              <motion.ul
                initial={{ opacity: 0, y: 16 }}
                animate={demoExpanded ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="mt-8 space-y-3"
              >
                {[
                  "No credit card required — free to start",
                  "Results in under 30 seconds",
                  "Works with PDF, CSV, Excel, and images",
                  "Bank-level encryption on every upload",
                  "Delete your data anytime",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </motion.ul>

              {/* Social proof — revealed only after the demo expands */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={demoExpanded ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="mt-8 pt-6 border-t border-border/60"
              >
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">10,000+</span> documents analyzed
                  {" · "}
                  <span className="font-semibold text-foreground">$2.4M</span> in hidden fees uncovered
                </p>
              </motion.div>
            </div>

            {/* Right column: inline animated demo */}
            <div className="w-full lg:pt-10 relative">
              {/* Glow behind demo */}
              <div
                className="absolute inset-0 rounded-2xl bg-linear-to-br from-emerald-500/5 to-indigo-500/5 blur-xl -z-10"
                aria-hidden="true"
              />
              <HowItWorksDemo
                compact
                onExpanded={() => setDemoExpanded(true)}
                onReset={() => setDemoExpanded(false)}
              />
            </div>

          </div>
        </div>
      </div>

      {/* Bottom fade — dissolves orb ambient into the next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-28 bg-linear-to-b from-transparent to-background pointer-events-none"
        aria-hidden="true"
      />
    </section>
  );
}
