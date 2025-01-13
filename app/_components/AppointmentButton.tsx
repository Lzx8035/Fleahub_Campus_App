"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { CustomAlertDialog } from "@/app/_components/CustomAlertDialog";

interface AppointmentButtonProps {
  itemId: number;
  className?: string;
  size?: "default" | "sm" | "lg";
  isLoggedIn?: boolean;
}

export default function AppointmentButton({
  itemId,
  className = "",
  size = "sm",
  isLoggedIn = false,
}: AppointmentButtonProps) {
  const router = useRouter();

  if (!isLoggedIn) {
    return (
      <CustomAlertDialog
        triggerText="Make Appointment"
        title="Login Required"
        description="Please login to make appointments."
        confirmText="Login"
        onConfirm={() =>
          router.push(
            `/login?redirect=${encodeURIComponent(window.location.pathname)}`
          )
        }
        buttonClassName={className}
        buttonSize={size}
      />
    );
  }

  return (
    <Button className={`flex-1 ${className}`} size={size} asChild>
      <Link href={`/account/my_appointments/edit?itemId=${itemId}`}>
        Make Appointment
      </Link>
    </Button>
  );
}
