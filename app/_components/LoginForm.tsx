"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { signInWithGoogle } from "@/app/_lib/auth";
import { useSearchParams } from "next/navigation";

export function LoginForm() {
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect");

  const handleSignIn = async () => {
    const { error } = await signInWithGoogle(redirectPath || undefined);
    if (error) {
      console.error("Failed to sign in");
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          Welcome to FleaHub
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="outline" className="w-full" onClick={handleSignIn}>
          Continue with Google
        </Button>
      </CardContent>
    </Card>
  );
}
