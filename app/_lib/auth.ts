"use client";

import { createClient } from "@/app/_lib/supabase/client";

export async function signInWithGoogle(redirectPath?: string) {
  const supabase = createClient();

  try {
    const callbackURL = new URL(`${location.origin}/auth/callback`);
    if (redirectPath) {
      callbackURL.searchParams.set("redirect", redirectPath);
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: callbackURL.toString(),
        queryParams: {
          prompt: "select_account",
        },
      },
    });

    if (error) {
      console.error("Error signing in:", error.message);
      return { error };
    }
    return { error: null };
  } catch (error) {
    console.error("Unexpected error during sign-in:", error);
    return { error };
  }
}

export async function signOut() {
  const supabase = createClient();

  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
      return { error };
    }
    return { error: null };
  } catch (error) {
    console.error("Unexpected error during sign-out:", error);
    return { error };
  }
}
