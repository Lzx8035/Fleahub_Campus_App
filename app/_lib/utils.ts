import { Json, WishlistItems } from "../_types";

export function getImageUrls(imageJson: Json): string[] {
  if (!imageJson) return [];

  try {
    if (typeof imageJson === "string") {
      return JSON.parse(imageJson) as string[];
    }

    if (Array.isArray(imageJson)) {
      return imageJson as string[];
    }

    return [];
  } catch (error) {
    console.error("Error parsing image JSON:", error);
    return [];
  }
}

export function isItemInWishlist(itemId: number, wishlistItems: WishlistItems) {
  return wishlistItems.some((wishItem) => wishItem.items?.id === itemId);
}
