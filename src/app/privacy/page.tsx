import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import PrivacyPrinciples from "@/src/components/PrivacyPrinciples";
import PageHero from "@/src/components/PageHero";
import PrivacyCommitments from "@/src/components/PrivacyCommitments";
import CTASection from "@/src/components/CTASection";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <PageHero
        title="Privacy & Security"
        subtitle="Your financial data is sensitive. Here's exactly how we protect it."
        badge="Privacy First"
      />

      <PrivacyPrinciples />

      <PrivacyCommitments />

      <CTASection
        heading="Feel confident about your data"
        subtext="Start analyzing your financial documents with the peace of mind that your data is safe."
        primaryHref="/sign-up"
        primaryLabel="Get Started Free"
        secondaryHref="/"
        secondaryLabel="Back to Home"
      />

      <Footer />
    </div>
  );
}
