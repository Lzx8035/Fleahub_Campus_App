"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ToggleWishlistItemAction } from "../_lib/action";
import type { WishlistItems } from "@/app/_types";
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
import { isItemInWishlist } from "../_lib/utils";

interface WishlistButtonProps {
  itemId: number;
  initialWishlistItems: WishlistItems;
  className?: string;
  size?: "default" | "sm" | "lg";
  onlyDelete?: boolean; // 新增属性
  onDeleteSuccess?: () => void; // 新增回调函数
}

export default function WishlistButton({
  itemId,
  initialWishlistItems,
  className = "",
  size = "sm",
  onlyDelete = false,
  onDeleteSuccess,
}: WishlistButtonProps) {
  const [wishlistItems, setWishlistItems] = useState(initialWishlistItems);
  const [isPending, setIsPending] = useState(false);
  const inWishlist = isItemInWishlist(itemId, wishlistItems);

  const handleWishlistToggle = async () => {
    try {
      setIsPending(true);
      const isAdded = await ToggleWishlistItemAction(itemId);

      if (!isAdded) {
        setWishlistItems((prev) =>
          prev.filter((item) => item.item_id !== itemId)
        );
        onDeleteSuccess?.(); // 调用删除成功的回调
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
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="default"
            size={size}
            className={`w-auto ${className}`}
            disabled={isPending}
          >
            {isPending ? "Loading..." : "Delete from Wishlist"}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the item from your wishlist.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleWishlistToggle}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
