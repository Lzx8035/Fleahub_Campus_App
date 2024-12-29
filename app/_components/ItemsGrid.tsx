"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { Database } from "@/app/_lib/database.types";

type Json = Database["public"]["Tables"]["items"]["Row"]["images"];
type Item = Database["public"]["Tables"]["items"]["Row"];

interface ItemsGridProps {
  items: Item[];
}

export default function ItemsGrid({ items }: ItemsGridProps) {
  function getImageUrls(imageJson: Json): string[] {
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {items.map((item) => (
        <Card key={item.id} className="w-full">
          <div className="p-4">
            <div className="aspect-square bg-gray-100 rounded-md mb-2 overflow-hidden">
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
            <h3 className="font-semibold">{item.title}</h3>
            <p className="text-lg font-bold text-[#2a2f33] mt-1">
              ${item.price}
            </p>
            <p className="text-gray-500 text-sm">Posted 2 days ago</p>
            <div className="flex gap-2 mt-3">
              <Button variant="outline" size="sm" className="w-full">
                Details
              </Button>
              <Button size="sm" className="w-full">
                Wishlist
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
