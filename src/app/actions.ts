"use server";

import { encodedRedirect } from "@/src/utils/utils";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "../../supabase/server";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const fullName = formData.get("full_name")?.toString() || '';
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required",
    );
  }

  const { data: { user }, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        full_name: fullName,
        email: email,
      }
    },
  });

  console.log("After signUp", error);


  if (error) {
    console.error(error.code + " " + error.message);
    const message =
      error.message.toLowerCase().includes("already registered") ||
      error.message.toLowerCase().includes("already been registered")
        ? "An account with this email already exists — try signing in instead."
        : error.message;
    return encodedRedirect("error", "/sign-up", message);
  }

  if (user) {
    try {
      const { error: updateError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          name: fullName,
          full_name: fullName,
          email: email,
          user_id: user.id,
          token_identifier: user.id,
          created_at: new Date().toISOString()
        });

      if (updateError) {
        console.error('Error updating user profile:', updateError);
      }
    } catch (err) {
      console.error('Error in user profile creation:', err);
    }
  }

  return redirect("/sign-in?toast=signed-up");
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/dashboard");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/reset-password`,
  });

  if (error) {
    console.error(error.message);
    const isRateLimit =
      (error as { status?: number }).status === 429 ||
      error.message?.toLowerCase().includes("security purposes") ||
      error.message?.toLowerCase().includes("rate limit");
    // For rate limits, surface Supabase's message directly — it contains the
    // actual wait time (e.g. "after 300 seconds"), which we don't want to guess.
    const message = isRateLimit
      ? error.message
      : "Unable to send the reset email. Please check the address and try again.";
    return encodedRedirect("error", "/forgot-password", message);
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return redirect("/forgot-password?toast=reset-sent");
};

export const resetPasswordAction = async (formData: FormData) => {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    return encodedRedirect(
      "error",
      "/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    return encodedRedirect(
      "error",
      "/reset-password",
      "Passwords do not match",
    );
  }

  const cookieStore = await cookies();
  const resetToken = cookieStore.get("password_reset_token")?.value;

  if (!resetToken) {
    return encodedRedirect(
      "error",
      "/reset-password",
      "Reset link expired. Please request a new password reset.",
    );
  }

  // Use the token to update the password via the Supabase REST API.
  // The user has no active session — this is a one-time authenticated call
  // using the short-lived access token stored from the reset email link.
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${resetToken}`,
        "Content-Type": "application/json",
        apikey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
      },
      body: JSON.stringify({ password }),
    },
  );

  if (!res.ok) {
    let message = "Password update failed — please try again.";
    if (res.status === 401 || res.status === 403) {
      message = "Your reset link has expired. Please request a new one.";
    } else {
      try {
        const body = await res.json();
        // Supabase validation errors (e.g. password too weak) surface a msg field
        if (res.status === 422 && body?.msg) message = body.msg;
      } catch { /* ignore parse errors */ }
    }
    return encodedRedirect("error", "/reset-password", message);
  }

  cookieStore.delete("password_reset_token");

  return redirect("/sign-in?toast=password-reset");
};

export type SignInState = { error: string; attempts: number }

export const signInActionWithState = async (
  prevState: SignInState | null,
  formData: FormData
): Promise<SignInState> => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();
  const prevAttempts = prevState?.attempts ?? 0;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    const status = (error as { status?: number }).status;
    let message = error.message;
    if (error.message === "Invalid login credentials") {
      message = "Incorrect email or password.";
    } else if (status === 429 || error.message.toLowerCase().includes("rate limit")) {
      message = "Too many sign-in attempts — please wait a moment and try again.";
    } else if (error.message.toLowerCase().includes("email not confirmed")) {
      message = "Please verify your email address before signing in.";
    }
    return { error: message, attempts: prevAttempts + 1 };
  }

  return redirect("/dashboard?toast=signed-in") as never;
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in?toast=signed-out");
};

export const updateThemeAction = async (theme: string) => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.auth.updateUser({ data: { theme } });
};