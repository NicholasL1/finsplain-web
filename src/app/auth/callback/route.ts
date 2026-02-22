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
      // Password recovery flow — we do NOT want to leave the user with a full
      // authenticated session. Instead:
      //  1. Exchange the code (establishes session internally + sets cookies above)
      //  2. Immediately sign out to clear those session cookies from the response
      //  3. Store only the short-lived access token in a secure httpOnly cookie
      // The reset-password page uses this token to make a one-time API call.
      const { data: { session } } = await supabase.auth.exchangeCodeForSession(code);

      if (session?.access_token) {
        // Revoke the refresh token and clear session cookies from the response.
        await supabase.auth.signOut({ scope: "global" });

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
