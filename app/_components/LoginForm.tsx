"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState, useEffect } from "react";
// TODO
import type { User } from "@supabase/auth-helpers-nextjs";

export function LoginForm() {
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // TODO
    const checkUser = async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      setUser(currentUser);
    };
    checkUser();
  }, [supabase.auth]);

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        // prompt: "select_account", //!!!???NONOBUG
        redirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("Error:", error.message);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      setUser(null);
      console.log("Successfully signed out");
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
