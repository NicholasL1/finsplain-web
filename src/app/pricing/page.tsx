import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import PageHero from "@/src/components/PageHero";
import PricingSection from "@/src/components/PricingSection";
import CTASection from "@/src/components/CTASection";

export const metadata = {
  title: "Pricing — FinSplain",
  description:
    "Simple, credit-based pricing. Analyze financial documents at a cost that works for you.",
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <PageHero
        title="Simple, Transparent Pricing"
        subtitle="Each credit analyzes one document. No subscriptions that drain your wallet — pay for what you actually use."
        badge="Pricing"
      />

      <PricingSection />

      <CTASection
        heading="Start for free, upgrade when ready"
        subtext="5 free credits every month. No credit card required to get started."
        primaryHref="/sign-up"
        primaryLabel="Create Free Account"
        secondaryHref="/how-it-works"
        secondaryLabel="See How It Works"
      />

      <Footer />
    </div>
  );
}
