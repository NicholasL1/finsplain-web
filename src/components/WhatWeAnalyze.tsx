"use client";

import { DollarSign, RefreshCw, TrendingUp, AlertTriangle } from "lucide-react";
import { motion } from "motion/react";
import AnimateOnScroll from "@/src/components/AnimateOnScroll";

const items = [
  {
    icon: DollarSign,
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-500",
    title: "Hidden Fees",
    description:
      "We scan every line for maintenance fees, ATM charges, wire transfer costs, and other fees that banks bury in the fine print.",
  },
  {
    icon: RefreshCw,
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
    title: "Active Subscriptions",
    description:
      "Identify every recurring charge — from streaming services to gym memberships — so you know exactly where your money goes each month.",
  },
  {
    icon: TrendingUp,
    iconBg: "bg-indigo-500/10",
    iconColor: "text-indigo-500",
    title: "Spending Patterns",
    description:
      "Understand your spending habits with clear breakdowns by category, time period, and trend analysis compared to previous periods.",
  },
  {
    icon: AlertTriangle,
    iconBg: "bg-red-500/10",
    iconColor: "text-red-500",
    title: "Unusual Activity",
    description:
      "Flag duplicate charges, unrecognized transactions, and anomalies that could indicate errors or unauthorized access.",
  },
];

export default function WhatWeAnalyze() {
  return (
    <section className="py-20 sm:py-24 bg-linear-to-b from-background via-muted to-background dark:via-muted/55 relative overflow-hidden">
      <div
        className="absolute inset-0 bg-radial from-emerald-500/4 via-transparent to-transparent pointer-events-none"
        aria-hidden="true"
      />
      <div className="container mx-auto px-4 max-w-4xl relative">
        <AnimateOnScroll direction="up" className="text-center mb-12">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
            What We Analyze
          </h2>
        </AnimateOnScroll>
        <div className="grid md:grid-cols-2 gap-6">
          {items.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.4,
                delay: index * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="p-6 rounded-2xl border border-border bg-card hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/5 transition-all duration-200"
            >
              <div className={`w-10 h-10 rounded-xl ${item.iconBg} flex items-center justify-center mb-4`}>
                <item.icon className={`w-5 h-5 ${item.iconColor}`} />
              </div>
              <h3 className="font-heading text-lg font-semibold text-card-foreground mb-2">
                {item.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
