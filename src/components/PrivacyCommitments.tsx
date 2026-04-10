"use client";

import { motion } from "motion/react";

const commitments = [
  {
    title: "Data Processing",
    content:
      "Your documents are processed in isolated, encrypted environments. Analysis results are generated on-the-fly and we never store the raw content of your financial documents. Only structured insights are retained for your viewing.",
  },
  {
    title: "Third-Party Access",
    content:
      "We do not share, sell, or provide access to your data to any third parties. Our analysis engine runs entirely within our own infrastructure. No external APIs receive your financial information.",
  },
  {
    title: "Data Retention",
    content:
      "You control how long we keep your data. Delete individual documents or your entire account at any time. When you delete data, it's permanently removed from all our systems within 48 hours.",
  },
  {
    title: "Authentication & Access",
    content:
      "All accounts are protected with industry-standard authentication. We support email/password with secure hashing. Your session tokens are encrypted and expire automatically.",
  },
  {
    title: "Infrastructure Security",
    content:
      "Our infrastructure runs on hardened cloud providers with regular internal security reviews. All data is encrypted at rest (AES-256) and in transit (TLS 1.3). We maintain comprehensive access logs and intrusion detection.",
  },
];

export default function PrivacyCommitments() {
  return (
    <section className="py-20 sm:py-24 bg-linear-to-b from-background via-muted to-background dark:via-muted/55 relative overflow-hidden">
      {/* Left accent line */}
      <div
        className="absolute left-0 inset-y-0 w-1 bg-linear-to-b from-transparent via-emerald-500/20 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 max-w-3xl relative">
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-8">
          Our Privacy Commitments
        </h2>
        <div className="space-y-8">
          {commitments.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{
                duration: 0.4,
                delay: index * 0.08,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="relative pl-6 border-l-2 border-emerald-500/30"
            >
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                {section.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
