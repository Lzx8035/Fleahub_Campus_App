"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import { getImageUrls } from "@/app/_lib/utils";
import WishlistButton from "@/app/_components/WishlistButton";
import type { WishlistItems } from "@/app/_types";

interface WishlistCardProps {
  item: WishlistItems[0];
  wishItems: WishlistItems;
}

export default function WishlistCard({ item, wishItems }: WishlistCardProps) {
  return (
    <Card className="flex flex-row w-full  bg-slate-50">
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
            priority
            className="object-cover"
            sizes="(max-width: 768px) 200px, 200px"
          />
        </div>
      </div>

      <div className="flex-1 p-4 flex flex-col justify-between pl-0">
        <div>
          <CardTitle
            className={`text-lg mb-2 ${
              item.items?.status === "sold" || item.items?.status === "reserved"
                ? "text-gray-500"
                : ""
            }`}
          >
            {item.items?.title}
          </CardTitle>
          <p
            className={`text-2xl font-bold ${
              item.items?.status === "sold" || item.items?.status === "reserved"
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
            <Button variant="outline" disabled className="text-gray-500 w-32">
              Sold
            </Button>
          ) : item.items?.status === "reserved" ? (
            <Button variant="outline" disabled className="text-gray-500 w-32">
              Reserved
            </Button>
          ) : (
            <Button variant="outline" className="w-32" asChild>
              <Link href={`/items/${item.items?.id}`}>Details</Link>
            </Button>
          )}
          <WishlistButton
            itemId={item.items?.id || 0}
            initialWishlistItems={wishItems}
            onlyDelete
            size="default"
          />
        </div>
      </div>

      <div className="hidden md:block w-1/3 p-4 border-l border-gray-200">
        <h3 className="font-semibold mb-2">Description</h3>
        <p className="text-gray-600 line-clamp-4 overflow-hidden">
          {item.items?.description || "No description available"}
        </p>
      </div>
    </Card>
  );
}
