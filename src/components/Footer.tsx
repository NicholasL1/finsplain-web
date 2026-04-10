import Link from "next/link"
import Logo from "@/src/components/Logo"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-background border-none">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="mb-4 flex items-center gap-2">
              <Logo size={22} />
              <span className="font-heading text-foreground text-lg font-bold">
                Fin<span className="text-emerald-500">Splain</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Transform complex financial documents into clear, actionable
              insights.
            </p>
          </div>

          <div>
            <h3 className="font-heading text-foreground mb-4 text-sm font-semibold">
              Product
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/how-it-works"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-150 hover:underline hover:underline-offset-2"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-150 hover:underline hover:underline-offset-2"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/sign-up"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-150 hover:underline hover:underline-offset-2"
                >
                  Get Started
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-foreground mb-4 text-sm font-semibold">
              Legal
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-150 hover:underline hover:underline-offset-2"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-150 hover:underline hover:underline-offset-2"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-150 hover:underline hover:underline-offset-2"
                >
                  Security
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-foreground mb-4 text-sm font-semibold">
              Support
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-150 hover:underline hover:underline-offset-2"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-150 hover:underline hover:underline-offset-2"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-150 hover:underline hover:underline-offset-2"
                >
                  Status
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-border flex flex-col items-center justify-between border-t pt-8 md:flex-row">
          <div className="text-muted-foreground text-sm">
            © {currentYear} FinSplain. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
