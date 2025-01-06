import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";
import Link from "next/link";
import PaginationBar from "../_components/PaginationBar";
import { getImageUrls } from "../_lib/utils";
import { getUserWishlist } from "../_lib/data_service";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";

export const metadata = {
  title: "Wishlist",
};

const ITEMS_PER_PAGE = 4; // 每页显示的项目数量

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
      <div className="p-8 text-center mt-20">
        <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
        <p className="text-gray-500 mb-4">
          Find something you like and add it to your wishlist!
        </p>
        <Button asChild>
          <Link href="/items">Browse Items</Link>
        </Button>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-4 mb-8">
        {paginatedItems.map((item) => (
          <Card key={item.id} className="flex flex-row w-full">
            <div className="w-48 min-w-[12rem] p-4">
              <div className="relative aspect-square bg-gray-100 rounded-md overflow-hidden">
                <Image
                  src={
                    item.items?.images
                      ? getImageUrls(item.items.images)[0] ||
                        "/api/placeholder/400/400"
                      : "/api/placeholder/400/400"
                  }
                  alt={item.items?.title || "Product image"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 200px, 200px"
                />
              </div>
            </div>

            <div className="flex-1 p-4 flex flex-col justify-between pl-0">
              <div>
                <CardTitle
                  className={`text-lg mb-2 ${
                    item.items?.status === "sold" ||
                    item.items?.status === "reserved"
                      ? "text-gray-500"
                      : ""
                  }`}
                >
                  {item.items?.title}
                </CardTitle>
                <p
                  className={`text-2xl font-bold ${
                    item.items?.status === "sold" ||
                    item.items?.status === "reserved"
                      ? "text-gray-500"
                      : "text-[#2a2f33]"
                  }`}
                >
                  ${item.items?.price}
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Added{" "}
                  {formatDistanceToNow(new Date(item.created_at), {
                    addSuffix: true,
                  })}
                </p>
              </div>

              <div className="flex gap-4 mt-4">
                {item.items?.status === "sold" ? (
                  <Button
                    variant="outline"
                    disabled
                    className="text-gray-500 w-20"
                  >
                    Sold
                  </Button>
                ) : item.items?.status === "reserved" ? (
                  <Button
                    variant="outline"
                    disabled
                    className="text-gray-500 w-20"
                  >
                    Reserved
                  </Button>
                ) : (
                  <Button variant="outline" className="w-20" asChild>
                    <Link href={`/items/${item.items?.id}`}>Details</Link>
                  </Button>
                )}
                <Button>Delete from Wishlist</Button>
              </div>
            </div>

            <div className="hidden md:block w-1/3 p-4 border-l border-gray-200">
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-600 line-clamp-4 overflow-hidden">
                {item.items?.description || "No description available"}
              </p>
            </div>
          </Card>
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
  );
}
