"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface CustomAlertDialogProps {
  triggerText: string;
  title: string;
  description: string;
  cancelText?: string;
  confirmText?: string;
  onConfirm: (() => void) | (() => Promise<void>);
  variant?: "default" | "secondary" | "destructive" | "ghost" | "outline";
  buttonClassName?: string;
  buttonSize?: "default" | "sm" | "lg";
  disabled?: boolean;
  icon?: React.ReactNode;
}

export function CustomAlertDialog({
  triggerText,
  title,
  description,
  cancelText = "Cancel",
  confirmText = "Confirm",
  onConfirm,
  variant = "default",
  buttonClassName = "",
  buttonSize = "default",
  disabled = false,
  icon,
}: CustomAlertDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await Promise.resolve(onConfirm());
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant={variant}
          size={buttonSize}
          className={buttonClassName}
          disabled={disabled || isLoading}
        >
          {icon && <span className="mr-1">{icon}</span>}
          {triggerText}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {cancelText}
          </AlertDialogCancel>
          <Button
            variant="default"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : confirmText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
