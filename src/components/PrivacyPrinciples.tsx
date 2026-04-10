"use client";

import { Shield, Lock, Eye, Trash2, Server, FileCheck } from "lucide-react";
import { motion } from "motion/react";
import AnimateOnScroll from "@/src/components/AnimateOnScroll";

const principles = [
  {
    icon: Lock,
    title: "End-to-End Encryption",
    description:
      "Your documents are encrypted in transit and at rest using AES-256 encryption. We never store raw document data.",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
  },
  {
    icon: Eye,
    title: "No Data Selling",
    description:
      "We will never sell, share, or monetize your financial data. Your information is yours alone.",
    iconBg: "bg-indigo-500/10",
    iconColor: "text-indigo-500",
  },
  {
    icon: Trash2,
    title: "Auto-Delete Option",
    description:
      "Set documents to auto-delete after analysis, or keep them for future reference. You control the retention.",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
  },
  {
    icon: Server,
    title: "Secure Infrastructure",
    description:
      "We run on hardened cloud infrastructure with access logging, intrusion detection, and regular security reviews.",
    iconBg: "bg-indigo-500/10",
    iconColor: "text-indigo-500",
  },
  {
    icon: FileCheck,
    title: "Minimal Data Collection",
    description:
      "We only collect what's needed to analyze your documents. No tracking, no profiling, no unnecessary data.",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
  },
  {
    icon: Shield,
    title: "Open Security Policy",
    description:
      "Our security practices are transparent and documented. We believe trust is built through openness.",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
  },
];

export default function PrivacyPrinciples() {
  return (
    <section className="py-20 sm:py-24 bg-linear-to-b from-background via-muted to-background dark:via-muted/35 relative overflow-hidden">
      {/* Left-side orb */}
      <div
        className="absolute -left-32 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-emerald-500/6 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 relative">
        <AnimateOnScroll direction="up" className="text-center mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Your Privacy, Our Priority
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base leading-relaxed">
            We built FinSplain with privacy as a foundational principle, not an
            afterthought.
          </p>
        </AnimateOnScroll>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {principles.map((p, index) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.4,
                delay: index * 0.08,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="p-6 rounded-2xl border border-border bg-card hover:-translate-y-0.5 hover:shadow-md hover:shadow-emerald-500/5 hover:border-emerald-500/25 transition-all duration-200"
            >
              <div className={`w-10 h-10 rounded-xl ${p.iconBg} flex items-center justify-center mb-4`}>
                <p.icon className={`w-5 h-5 ${p.iconColor}`} />
              </div>
              <h3 className="font-heading text-lg font-semibold text-card-foreground mb-2">
                {p.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {p.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
