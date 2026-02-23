"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

const TOASTS: Record<string, { message: string; type: "success" | "error" | "info" }> = {
  "signed-in":      { message: "Welcome back!", type: "success" },
  "signed-out":     { message: "Signed out successfully.", type: "success" },
  "signed-up":      { message: "Account created! Check your email to verify before signing in.", type: "success" },
  "reset-sent":     { message: "Check your email for a password reset link.", type: "success" },
  "password-reset": { message: "Password updated. You can now sign in.", type: "success" },
};

export function UrlToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const key = searchParams.get("toast");
    if (!key) return;

    const config = TOASTS[key];
    if (config) {
      if (config.type === "error") {
        toast.error(config.message);
      } else if (config.type === "info") {
        toast.info(config.message);
      } else {
        toast.success(config.message);
      }
    }

    // Clean the param from the URL without a re-render or scroll jump.
    const params = new URLSearchParams(searchParams.toString());
    params.delete("toast");
    const next = params.size > 0 ? `${pathname}?${params}` : pathname;
    router.replace(next, { scroll: false });
  }, [searchParams, router, pathname]);

  return null;
}
