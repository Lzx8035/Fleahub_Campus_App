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
  searchParams: SearchParams;
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

  const { paginatedItems, pageOption, hasMultiplePages } =
    await getClientPagination<WishlistItem>({
      searchParams,
      items: wishItems,
    });

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="grid grid-cols-1 gap-4 mb-8">
          {paginatedItems.map((item) => (
            <WishlistCard key={item.id} item={item} wishItems={wishItems} />
          ))}
        </div>

        {hasMultiplePages && (
          <PaginationBar pageOption={pageOption} page="wishlist" />
        )}
      </div>
    </div>
  );
}
