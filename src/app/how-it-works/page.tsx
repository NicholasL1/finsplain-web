import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import ProcessSteps from "@/src/components/ProcessSteps";
import PageHero from "@/src/components/PageHero";
import WhatWeAnalyze from "@/src/components/WhatWeAnalyze";
import CTASection from "@/src/components/CTASection";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <PageHero
        title="How FinSplain Works"
        subtitle="From upload to insight in under 30 seconds. No sign-up required to try it out."
        badge="Simple 3-Step Process"
      />

      <ProcessSteps />

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
