"use client";

import { useRouter } from "next/navigation";
import type { WishlistItems } from "@/app/_types";
import { Button } from "@/components/ui/button";
import { useState } from "react";

import { ToggleWishlistItemAction } from "../_lib/action";
import { CustomAlertDialog } from "./CustomAlertDialog";
import { isItemInWishlist } from "../_lib/utils";

interface WishlistButtonProps {
  itemId: number;
  initialWishlistItems: WishlistItems;
  className?: string;
  size?: "default" | "sm" | "lg";
  onlyDelete?: boolean;
  onDeleteSuccess?: () => void;
  isLoggedIn?: boolean;
}

export default function WishlistButton({
  itemId,
  initialWishlistItems,
  className = "",
  size = "sm",
  onlyDelete = false,
  onDeleteSuccess,
  isLoggedIn = false,
}: WishlistButtonProps) {
  const [wishlistItems, setWishlistItems] = useState(initialWishlistItems);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const inWishlist = isItemInWishlist(itemId, wishlistItems);

  const handleWishlistToggle = async () => {
    if (!isLoggedIn && !onlyDelete) {
      return;
    }

    try {
      setIsPending(true);
      const isAdded = await ToggleWishlistItemAction(itemId);

      if (!isAdded) {
        setWishlistItems((prev) =>
          prev.filter((item) => item.item_id !== itemId)
        );
        onDeleteSuccess?.();
      } else if (!onlyDelete) {
        setWishlistItems((prev) => [
          ...prev,
          {
            id: Date.now(),
            created_at: new Date().toISOString(),
            item_id: itemId,
            user_id: null,
            items: {
              id: itemId,
              title: "",
              price: 0,
              images: "",
              status: "",
              description: "",
            },
          },
        ]);
      }
    } catch (error) {
      console.error("Failed to toggle wishlist status:", error);
    } finally {
      setIsPending(false);
    }
  };

  if (onlyDelete) {
    return (
      <CustomAlertDialog
        triggerText={isPending ? "Loading..." : "Delete from Wishlist"}
        title="Are you sure?"
        description="This will remove the item from your wishlist."
        confirmText="Delete"
        onConfirm={handleWishlistToggle}
        buttonClassName={`w-auto ${className}`}
        buttonSize={size}
        disabled={isPending}
      />
    );
  }

  if (!isLoggedIn) {
    return (
      <CustomAlertDialog
        triggerText="Add to Wishlist"
        title="Login Required"
        description="Please login to add items to your wishlist."
        confirmText="Login"
        onConfirm={() =>
          router.push(
            `/login?redirect=${encodeURIComponent(window.location.pathname)}`
          )
        }
        buttonClassName={`w-full ${className}`}
        buttonSize={size}
      />
    );
  }

  return (
    <Button
      size={size}
      variant={inWishlist ? "secondary" : "default"}
      className={`w-full ${className}`}
      onClick={handleWishlistToggle}
      disabled={isPending}
    >
      {isPending ? "Loading..." : inWishlist ? "Remove" : "Add to Wishlist"}
    </Button>
  );
}
