import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const redirect_to = requestUrl.searchParams.get("redirect_to");

  const redirectTo = redirect_to || "/dashboard";
  const response = NextResponse.redirect(new URL(redirectTo, requestUrl.origin));

  if (code) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            // Write session cookies onto the redirect response so the browser
            // receives them. For recovery flows we overwrite these below.
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    if (redirectTo.includes("/reset-password")) {
      // Password recovery flow:
      //  1. Exchange the code to get the access token
      //  2. Manually delete auth-session cookies from the response so the browser
      //     never receives an active session (no signOut — calling signOut revokes
      //     the session in Supabase's DB, which also invalidates the access token
      //     and causes the subsequent password-update REST call to return 401)
      //  3. Store only the short-lived access token in a secure httpOnly cookie
      const { data: { session } } = await supabase.auth.exchangeCodeForSession(code);

      if (session?.access_token) {
        // Derive the cookie name prefix from the Supabase project ref.
        const projectRef = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).hostname.split(".")[0];
        const base = `sb-${projectRef}-auth-token`;

        // Delete the session cookies Supabase just wrote onto the response.
        // Supabase chunks large JWTs, so delete the base name and up to 5 chunks.
        [base, ...Array.from({ length: 5 }, (_, i) => `${base}.${i}`)].forEach(
          (name) => response.cookies.delete(name)
        );

        response.cookies.set("password_reset_token", session.access_token, {
          httpOnly: true,
          path: "/",
          maxAge: 600, // 10 minutes — must complete reset within this window
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
        });
      }
    } else {
      // Normal sign-in / sign-up confirmation flow.
      await supabase.auth.exchangeCodeForSession(code);
    }
  }

  return response;
}
