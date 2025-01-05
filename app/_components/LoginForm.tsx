"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createBrowserClient } from "@supabase/ssr";
import { useState, useEffect } from "react";
import type { User } from "@supabase/supabase-js";

export function LoginForm() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    checkUser();
  }, [supabase]);

  const handleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${location.origin}/auth/callback`,
          queryParams: {
            prompt: "select_account", // 添加这行
          },
        },
      });

      if (error) {
        console.error("Error signing in:", error.message);
      }
    } catch (error) {
      console.error("Unexpected error during sign-in:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error.message);
      } else {
        setUser(null);
        console.log("Successfully signed out");
      }
    } catch (error) {
      console.error("Unexpected error during sign-out:", error);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          {user ? `Welcome, ${user.email}` : "Welcome to FleaHub"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {user ? (
          <Button variant="outline" className="w-full" onClick={handleSignOut}>
            Sign Out
          </Button>
        ) : (
          <Button variant="outline" className="w-full" onClick={handleSignIn}>
            Continue with Google
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
