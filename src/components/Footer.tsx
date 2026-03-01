import Link from "next/link";
import Logo from "@/src/components/Logo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <Link
              href="/"
              className="flex items-center gap-2 mb-4"
            >
              <Logo size={22} />
              <span className="text-lg font-heading font-bold text-foreground">
                Fin<span className="text-emerald-500">Splain</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Transform complex financial documents into clear, actionable
              insights.
            </p>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-foreground mb-4 text-sm">
              Product
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/how-it-works"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/sign-up"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Get Started
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-foreground mb-4 text-sm">
              Legal
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Security
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-foreground mb-4 text-sm">
              Support
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Status
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border">
          <div className="text-sm text-muted-foreground">
            © {currentYear} FinSplain. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
