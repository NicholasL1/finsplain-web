"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AnimateOnScroll from "@/src/components/AnimateOnScroll";

interface CTASectionProps {
  readonly heading: string;
  readonly subtext: string;
  readonly primaryHref: string;
  readonly primaryLabel: string;
  readonly secondaryHref?: string;
  readonly secondaryLabel?: string;
}

export default function CTASection({
  heading,
  subtext,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: CTASectionProps) {
  return (
    <section className="py-20 relative overflow-hidden bg-linear-to-b from-background via-emerald-500/6 to-background dark:via-emerald-500/4">
      <div className="container mx-auto px-4 relative">
        <AnimateOnScroll direction="up">
          <div className="max-w-xl mx-auto text-center p-10 rounded-3xl border border-emerald-500/15 bg-background/60 backdrop-blur-sm shadow-xl shadow-emerald-500/5">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4 leading-tight">
              {heading}
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">{subtext}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href={primaryHref}
                className="group inline-flex items-center justify-center px-7 py-3.5 text-white bg-emerald-500 rounded-xl hover:bg-emerald-600 transition-all duration-150 text-base font-medium active:scale-[0.98]"
              >
                {primaryLabel}
                <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-150 group-hover:translate-x-0.5" />
              </Link>
              {secondaryHref && secondaryLabel && (
                <Link
                  href={secondaryHref}
                  className="group inline-flex items-center justify-center px-7 py-3.5 text-foreground border border-border rounded-xl hover:border-emerald-500/40 hover:bg-muted transition-all duration-150 text-base font-medium active:scale-[0.98]"
                >
                  {secondaryLabel}
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-150 group-hover:translate-x-0.5" />
                </Link>
              )}
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
