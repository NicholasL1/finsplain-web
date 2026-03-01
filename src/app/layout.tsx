import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/src/components/ThemeProvider";
import { Toaster } from "sonner";
import { Suspense } from "react";
import { UrlToast } from "@/src/components/UrlToast";
import { createClient } from "@/supabase/server";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "FinSplain — Understand Your Finances",
  description:
    "Transform complex financial documents into clear, actionable insights. Understand fees, subscriptions, and spending patterns without decoding jargon.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const savedTheme = (user?.user_metadata?.theme as string) || "system";

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme={savedTheme}
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Suspense>
            <UrlToast />
          </Suspense>
          <Toaster
            position="top-right"
            richColors
            toastOptions={{
              style: { fontFamily: "var(--font-inter)" },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
