"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Item, WishlistItems } from "../_types";
import Link from "next/link";
import { getImageUrls } from "../_lib/utils";
import { formatDistanceToNow } from "date-fns";
import WishlistButton from "./WishlistButton";

interface ItemsGridProps {
  items: Item[];
  initialWishlistItems: WishlistItems;
}

export default function ItemsGrid({
  items,
  initialWishlistItems,
}: ItemsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {items.map((item) => {
        return (
          <Card key={item.id} className="w-full">
            <div className="p-4 flex flex-col h-full">
              <div className="aspect-square bg-gray-100 rounded-md mb-2 overflow-hidden flex-shrink-0">
                {getImageUrls(item.images)[0] && (
                  <Image
                    src={getImageUrls(item.images)[0]}
                    alt={item.title}
                    width={400}
                    height={400}
                    priority
                    className="object-cover w-full h-full"
                  />
                )}
              </div>
              <div className="flex-grow">
                <h3 className="font-semibold">{item.title}</h3>
              </div>
              <div>
                <p className="text-lg font-bold text-[#2a2f33] mb-2">
                  ${item.price}
                </p>
                <p className="text-gray-500 text-sm mb-2">
                  {formatDistanceToNow(new Date(item.created_at), {
                    addSuffix: true,
                  })}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    asChild
                  >
                    <Link href={`/items/${item.id}`}>Details</Link>
                  </Button>
                  <WishlistButton
                    itemId={item.id}
                    initialWishlistItems={initialWishlistItems}
                    size="sm"
                  />
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
