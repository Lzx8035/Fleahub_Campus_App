import React, { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import Link from "next/link";
import PaginationBar from "@/app/_components/PaginationBar";
import WishlistCard from "@/app/_components/WishlistCard";
import { getUserWishlist } from "@/app/_lib/data_service";
import { getClientPagination } from "@/app/_lib/utils";
import { WishlistItem } from "@/app/_types";

export const metadata = {
  title: "Wishlist",
};

interface SearchParams {
  page?: string;
}

export default async function WishlistPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const wishItems = await getUserWishlist();

  if (!wishItems?.length) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-4">
            Find something you like and add it to your wishlist!
          </p>
          <Button asChild>
            <Link href="/items">Browse Items</Link>
          </Button>
        </div>
      </div>
    );
  }

  const resolvedSearchParams = await searchParams;

  const { paginatedItems, pageOption, hasMultiplePages } =
    await getClientPagination<WishlistItem>({
      searchParams: resolvedSearchParams,
      items: wishItems,
    });

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="grid grid-cols-1 gap-4 mb-8">
          <Suspense fallback={<div>Loading wishlist...</div>}>
            {paginatedItems.map((item) => (
              <WishlistCard key={item.id} item={item} wishItems={wishItems} />
            ))}
          </Suspense>
        </div>

        {hasMultiplePages && (
          <Suspense fallback={<div>Loading pagination...</div>}>
            <PaginationBar pageOption={pageOption} page="wishlist" />
          </Suspense>
        )}
      </div>
    </div>
  );
}
