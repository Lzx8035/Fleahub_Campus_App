import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import Link from "next/link";
import PaginationBar from "../_components/PaginationBar";
import WishlistCard from "../_components/WishlistCard";
import { getUserWishlist } from "../_lib/data_service";

export const metadata = {
  title: "Wishlist",
};

const ITEMS_PER_PAGE = 4; // 每页显示的项目数量
// app/wishlist/page.tsx
export default async function ItemsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const awaitedSearchParams = await searchParams;
  const wishItems = await getUserWishlist();
  const currentPage = Number(awaitedSearchParams.page) || 1;
  const totalPages = Math.ceil((wishItems?.length || 0) / ITEMS_PER_PAGE);
  const paginatedItems = wishItems?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (wishItems?.length === 0 || !paginatedItems)
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

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="grid grid-cols-1 gap-4 mb-8">
          {paginatedItems.map((item) => (
            <WishlistCard
              key={item.id}
              item={item}
              wishItems={wishItems || []}
            />
          ))}
        </div>

        {totalPages > 1 && (
          <PaginationBar
            pageOption={{
              currentPage,
              totalPages,
            }}
            page={"wishlist"}
          />
        )}
      </div>
    </div>
  );
}
