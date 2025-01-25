"use client";

import { useRouter } from "next/navigation";
import type { WishlistItems } from "@/app/_types";
import { Button } from "@/components/ui/button";
import { useState } from "react";

import { toast } from "sonner";
import { ToggleWishlistItemAction } from "@/app/_lib/action";
import { CustomAlertDialog } from "@/app/_components/CustomAlertDialog";
import { isItemInWishlist } from "@/app/_lib/utils";

interface WishlistButtonProps {
  itemId: number;
  initialWishlistItems: WishlistItems;
  className?: string;
  size?: "default" | "sm" | "lg";
  onlyDelete?: boolean;
  isLoggedIn?: boolean;
  isDisabled?: boolean;
}

export default function WishlistButton({
  itemId,
  initialWishlistItems,
  className = "",
  size = "sm",
  onlyDelete = false,
  isLoggedIn = false,
  isDisabled = false,
}: WishlistButtonProps) {
  const [wishlistItems, setWishlistItems] = useState(initialWishlistItems);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const inWishlist = isItemInWishlist(itemId, wishlistItems);

  const handleWishlistToggle = async () => {
    if (!isLoggedIn && !onlyDelete) {
      return;
    }

    const previousItems = wishlistItems;

    try {
      setIsPending(true);

      // optimistic update
      if (inWishlist || onlyDelete) {
        setWishlistItems((prev) =>
          prev.filter((item) => item.item_id !== itemId)
        );
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

      const isAdded = await ToggleWishlistItemAction(itemId);

      if (!isAdded) {
        toast.success("Item removed from wishlist");
      } else if (!onlyDelete) {
        toast.success("Item added to wishlist");
      }
    } catch (error) {
      console.error("Failed to toggle wishlist status:", error);
      setWishlistItems(previousItems);
      toast.error("Failed to update wishlist");
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

  if (isDisabled) {
    return (
      <Button size={size} className={`w-full ${className}`} disabled>
        Add to Wishlist
      </Button>
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
