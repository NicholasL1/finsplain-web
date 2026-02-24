"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { ThemeSwitcher } from "@/src/components/ThemeSwitcher";

interface MobileNavProps {
  isAuthenticated: boolean;
}

export default function MobileNav({ isAuthenticated }: Readonly<MobileNavProps>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-accent transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="w-5 h-5 text-muted-foreground" />
        ) : (
          <Menu className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-background border-b border-border shadow-[0_4px_12px_rgba(0,0,0,0.08)] z-50">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard/upload"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-foreground hover:bg-accent rounded-xl transition-colors"
                >
                  Upload
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-foreground hover:bg-accent rounded-xl transition-colors"
                >
                  Documents
                </Link>
                <Link
                  href="/dashboard/account"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-foreground hover:bg-accent rounded-xl transition-colors"
                >
                  Account
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/how-it-works"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-foreground hover:bg-accent rounded-xl transition-colors"
                >
                  How It Works
                </Link>
                <Link
                  href="/privacy"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-foreground hover:bg-accent rounded-xl transition-colors"
                >
                  Privacy
                </Link>
                <Link
                  href="/sign-in"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-foreground hover:bg-accent rounded-xl transition-colors"
                >
                  Sign In
                </Link>
                <div className="pt-2 px-4">
                  <Link href="/sign-up" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-xl">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </>
            )}
            <div className="px-4 pt-2 pb-1 flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Theme</span>
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
