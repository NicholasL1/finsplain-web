import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import PageHero from "@/src/components/PageHero";
import StepsSection from "@/src/components/StepsSection";
import HowItWorksDemo from "@/src/components/HowItWorksDemo";
import WhatWeAnalyze from "@/src/components/WhatWeAnalyze";
import CTASection from "@/src/components/CTASection";
import AnimateOnScroll from "@/src/components/AnimateOnScroll";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <PageHero
        title="How FinSplain Works"
        subtitle="From upload to insight in under 30 seconds. No sign-up required to try it out."
        badge="Simple 3-Step Process"
      />


      <StepsSection />

      {/* Interactive Demo ─────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 relative">
        {/* Radial emerald glow — same pattern as FeatureShowcase */}
        <div
          className="absolute inset-0 bg-radial from-emerald-500/6 via-transparent to-transparent pointer-events-none"
          aria-hidden="true"
        />
        {/* Indigo orb — right side */}
        <div
          className="absolute top-1/2 -right-40 -translate-y-1/2 w-[380px] h-[380px] rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        {/* Emerald orb — bottom left */}
        <div
          className="absolute bottom-0 -left-32 w-[300px] h-[300px] rounded-full bg-emerald-500/8 blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="container mx-auto px-4 max-w-3xl relative">
          <AnimateOnScroll direction="up" className="text-center mb-10">
            <div className="flex justify-center mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                Interactive Demo
              </span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-3">
              See it in action
            </h2>
            <p className="text-muted-foreground text-base">
              Watch the complete analysis process with a real sample document —
              no sign-up needed.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll direction="up" delay={0.15}>
            {/* Glow halo behind the demo — same technique as Hero */}
            <div className="relative">
              <div
                className="absolute -inset-4 rounded-3xl bg-linear-to-br from-emerald-500/8 to-indigo-500/8 blur-2xl pointer-events-none"
                aria-hidden="true"
              />
              <div className="relative">
                <HowItWorksDemo />
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      <WhatWeAnalyze />

      <CTASection
        heading="Ready to try it?"
        subtext="Sign up in seconds and upload your first document. No credit card required."
        primaryHref="/sign-up"
        primaryLabel="Get Started Free"
        secondaryHref="/privacy"
        secondaryLabel="View Privacy Policy"
      />

      <Footer />
    </div>
  );
}
