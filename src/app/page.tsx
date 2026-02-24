import Footer from "@/src/components/Footer";
import Hero from "@/src/components/Hero";
import Navbar from "@/src/components/Navbar";
import ProcessSteps from "@/src/components/ProcessSteps";
import FeatureShowcase from "@/src/components/FeatureShowcase";
import PrivacyPrinciples from "@/src/components/PrivacyPrinciples";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <ProcessSteps />
      <FeatureShowcase />

      {/* Trust/Stats Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center max-w-4xl mx-auto">
            <div>
              <div className="font-heading text-3xl font-bold text-foreground">
                10K+
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Documents analyzed
              </div>
            </div>
            <div>
              <div className="font-heading text-3xl font-bold text-foreground">
                $2.4M
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Hidden fees found
              </div>
            </div>
            <div>
              <div className="font-heading text-3xl font-bold text-foreground">
                &lt; 30s
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Average analysis time
              </div>
            </div>
            <div>
              <div className="font-heading text-3xl font-bold text-foreground">
                4.9/5
              </div>
              <div className="text-sm text-muted-foreground mt-1">User rating</div>
            </div>
          </div>
        </div>
      </section>

      <PrivacyPrinciples />

      {/* CTA Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Ready to understand your finances?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto text-base leading-relaxed">
            Join thousands of people who have already uncovered hidden fees and
            taken control of their spending.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center px-7 py-3.5 text-white bg-[#10B981] rounded-xl hover:bg-[#059669] transition-all duration-150 text-base font-medium active:scale-[0.98]"
          >
            Get Started Free
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
