import Navbar from "@/src/components/Navbar"
import Footer from "@/src/components/Footer"
import Link from "next/link"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-20 pb-12 sm:pt-28 sm:pb-16">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h1 className="font-heading text-[40px] sm:text-[48px] font-bold text-foreground mb-4 leading-tight tracking-tight">
            Terms of Service
          </h1>
          <p className="text-sm text-muted-foreground">
            Last updated: February 2026
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="prose prose-sm max-w-none space-y-10 text-foreground">

            <div className="space-y-3">
              <h2 className="font-heading text-xl font-semibold text-foreground">
                1. Acceptance of Terms
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing or using FinSplain (&ldquo;the Service&rdquo;), you agree to be
                bound by these Terms of Service. If you do not agree to these
                terms, please do not use the Service.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-heading text-xl font-semibold text-foreground">
                2. Description of Service
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                FinSplain is a financial document analysis platform that helps
                users understand bank statements, credit card statements, pay
                stubs, and other financial documents. The Service extracts and
                summarizes information to surface fees, subscriptions, spending
                patterns, and anomalies.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The Service is provided for informational purposes only and does
                not constitute financial advice. You should consult a qualified
                financial professional before making any financial decisions.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-heading text-xl font-semibold text-foreground">
                3. User Accounts
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                To access certain features you must create an account. You are
                responsible for maintaining the confidentiality of your
                credentials and for all activity that occurs under your account.
                You must provide accurate information when creating an account
                and keep it up to date.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                You must be at least 18 years old to use the Service. By creating
                an account, you represent that you meet this requirement.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-heading text-xl font-semibold text-foreground">
                4. Acceptable Use
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                You agree not to:
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-muted-foreground leading-relaxed">
                <li>Upload documents that you do not have the right to share</li>
                <li>Use the Service for any unlawful purpose</li>
                <li>
                  Attempt to gain unauthorized access to any part of the Service
                </li>
                <li>
                  Interfere with or disrupt the integrity or performance of the
                  Service
                </li>
                <li>
                  Reverse engineer or attempt to extract the source code of the
                  Service
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="font-heading text-xl font-semibold text-foreground">
                5. Data & Privacy
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Your privacy matters to us. Our{" "}
                <Link
                  href="/privacy"
                  className="text-emerald-500 hover:underline"
                >
                  Privacy Policy
                </Link>{" "}
                explains how we collect, use, and protect your information. By
                using the Service you agree to our data practices as described
                there.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                You retain ownership of all documents and data you upload.
                FinSplain does not sell, share, or monetize your financial data.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-heading text-xl font-semibold text-foreground">
                6. Intellectual Property
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                The Service and its original content (excluding user-uploaded
                documents) are and will remain the exclusive property of FinSplain
                and its licensors. You may not copy, modify, or distribute any
                part of the Service without our prior written permission.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-heading text-xl font-semibold text-foreground">
                7. Disclaimer of Warranties
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                The Service is provided &ldquo;as is&rdquo; and &ldquo;as
                available&rdquo; without warranties of any kind, either express
                or implied. We do not warrant that the Service will be
                uninterrupted, error-free, or completely accurate. Analysis
                results are generated automatically and may contain errors.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-heading text-xl font-semibold text-foreground">
                8. Limitation of Liability
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                To the fullest extent permitted by law, FinSplain shall not be
                liable for any indirect, incidental, special, consequential, or
                punitive damages arising from your use of or inability to use the
                Service, even if we have been advised of the possibility of such
                damages.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-heading text-xl font-semibold text-foreground">
                9. Changes to These Terms
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update these Terms from time to time. When we do, we will
                revise the &ldquo;Last updated&rdquo; date at the top of this
                page. Continued use of the Service after changes constitutes
                acceptance of the updated Terms.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-heading text-xl font-semibold text-foreground">
                10. Contact
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have questions about these Terms, please reach out at{" "}
                <a
                  href="mailto:support@finsplain.net"
                  className="text-emerald-500 hover:underline"
                >
                  support@finsplain.net
                </a>
                .
              </p>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
