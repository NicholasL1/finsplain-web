import Footer from "@/src/components/Footer";
import Hero from "@/src/components/Hero";
import Navbar from "@/src/components/Navbar";
import ProcessSteps from "@/src/components/ProcessSteps";
import FeatureShowcase from "@/src/components/FeatureShowcase";
import PrivacyPrinciples from "@/src/components/PrivacyPrinciples";
import CTASection from "@/src/components/CTASection";
import { createClient } from "@/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const firstName = (user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? "")
    .trim()
    .split(" ")[0];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero firstName={firstName || undefined} />

      <ProcessSteps />
      <FeatureShowcase />
      <PrivacyPrinciples />

      <CTASection
        heading="Ready to understand your finances?"
        subtext="Join thousands of people who have already uncovered hidden fees and taken control of their spending."
        primaryHref="/sign-up"
        primaryLabel="Get Started Free"
      />

      <Footer />
    </div>
  );
}
