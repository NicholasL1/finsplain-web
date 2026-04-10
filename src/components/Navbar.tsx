import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import MobileNav from "@/src/components/MobileNav";
import UserProfile from "@/src/components/UserProfile";
import { createClient } from "@/supabase/server";
import { ThemeSwitcher } from "@/src/components/ThemeSwitcher";
import Logo from "@/src/components/Logo";

export default async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 flex justify-between items-center h-16">
        <Link
          href="/"
          prefetch
          className="flex items-center gap-2.5 hover:opacity-90 transition-opacity duration-150"
        >
          <Logo size={28} />
          <span className="text-xl font-heading font-bold tracking-tight text-foreground">
            Fin<span className="text-emerald-500">Splain</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex gap-1 items-center">
          {user ? (
            <>
              <ThemeSwitcher />
              <Link
                href="/dashboard/upload"
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Upload
              </Link>
              <Link
                href="/dashboard"
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Documents
              </Link>
              <Link
                href="/dashboard/account"
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Account
              </Link>
              <UserProfile userName={user.user_metadata?.full_name ?? user.user_metadata?.name ?? ""} />
            </>
          ) : (
            <>
              <ThemeSwitcher />
              <Link
                href="/how-it-works"
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                How It Works
              </Link>
              <Link
                href="/pricing"
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/privacy"
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy
              </Link>
              <Link href="/sign-in">
                <Button
                  variant="ghost"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-xl px-5">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile nav */}
        <MobileNav isAuthenticated={!!user} />
      </div>
    </nav>
  );
}
