"use client";

import { useRouter } from "next/navigation";
import { ReactNode } from "react";

interface BackButtonProps {
  children: ReactNode;
}

export default function BackButton({ children }: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return <button onClick={handleBack}>{children}</button>;
}
