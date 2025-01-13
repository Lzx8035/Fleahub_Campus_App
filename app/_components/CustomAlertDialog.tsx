"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface CustomAlertDialogProps {
  triggerText: string;
  title: string;
  description: string;
  cancelText?: string;
  confirmText?: string;
  onConfirm: () => void;
  variant?: "default" | "secondary" | "destructive" | "ghost";
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
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={variant}
          size={buttonSize}
          className={buttonClassName}
          disabled={disabled}
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
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
