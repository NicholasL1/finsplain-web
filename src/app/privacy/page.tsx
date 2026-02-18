import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import PrivacyPrinciples from "@/src/components/PrivacyPrinciples";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-20 pb-12 sm:pt-28 sm:pb-16">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h1 className="font-heading text-[40px] sm:text-[48px] font-bold text-[#1F2937] mb-4 leading-tight tracking-tight">
            Privacy & Security
          </h1>
          <p className="text-lg text-[#6B7280] leading-relaxed">
            Your financial data is sensitive. Here's exactly how we protect it.
          </p>
        </div>
      </section>

      <PrivacyPrinciples />

      {/* Detailed Privacy Policy */}
      <section className="py-20 sm:py-24 bg-[#F9FAFB]">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1F2937] mb-8">
            Our Privacy Commitments
          </h2>
          <div className="space-y-8">
            {[
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
                  "Our infrastructure runs on SOC 2 compliant cloud providers with regular security audits. All data is encrypted at rest (AES-256) and in transit (TLS 1.3). We maintain comprehensive access logs and intrusion detection.",
              },
            ].map((section) => (
              <div key={section.title}>
                <h3 className="font-heading text-lg font-semibold text-[#1F2937] mb-2">
                  {section.title}
                </h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl font-bold text-[#1F2937] mb-4">
            Feel confident about your data
          </h2>
          <p className="text-[#6B7280] mb-8 max-w-md mx-auto text-base leading-relaxed">
            Start analyzing your financial documents with the peace of mind that
            your data is safe.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center px-7 py-3.5 text-white bg-[#10B981] rounded-xl hover:bg-[#059669] transition-all duration-150 text-base font-medium active:scale-[0.98]"
            >
              Get Started Free
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-7 py-3.5 text-[#1F2937] border border-[#E5E7EB] rounded-xl hover:bg-[#F9FAFB] transition-all duration-150 text-base font-medium"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
