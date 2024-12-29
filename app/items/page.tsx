import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Search } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { getItemByPage } from "../_lib/data_service";
import CategoriesBar from "../_components/CategoriesBar";
import Image from "next/image";

import { Database } from "@/app/_lib/database.types";
type Json = Database["public"]["Tables"]["items"]["Row"]["images"];

export const metadata = {
  title: "Items",
};

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
];

////// reference
// const categories = {
//   'books': ['textbooks', 'academic_books', 'fiction', 'magazines', 'study_guides', 'research_papers'],
//   'electronics': ['laptops', 'smartphones', 'tablets', 'headphones', 'monitors', 'computer_accessories'],
//   'furniture': ['chairs', 'desks', 'shelves', 'lamps', 'storage', 'bed_accessories'],
//   'clothing': ['winter_wear', 'summer_wear', 'formal_wear', 'shoes', 'bags', 'accessories'],
//   'supplies': ['stationery', 'art_supplies', 'lab_equipment', 'sports_equipment', 'kitchen_supplies', 'cleaning_supplies'],
//   'others': ['collectibles', 'instruments', 'board_games', 'bike', 'decorations']
// };

export default async function ItemsPage() {
  const items = await getItemByPage();
  if (!items) {
    return <div>Failed to load items</div>;
  }

  function getImageUrls(imageJson: Json): string[] {
    if (!imageJson) return [];

    try {
      const cleanJson =
        typeof imageJson === "string"
          ? imageJson
              .replace(/^{/, "[")
              .replace(/}$/, "]")
              .replace(/"{2,}/g, '"')
          : JSON.stringify(imageJson);

      const parsed = JSON.parse(cleanJson);
      return (Array.isArray(parsed) ? parsed : [parsed]) as string[];
    } catch (error) {
      console.error("Error parsing image JSON:", error);
      return [];
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row gap-12 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input placeholder="Search items..." className="pl-10" />
        </div>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <CategoriesBar />

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {items.map((item) => (
          <Card key={item.id} className="w-full">
            <div className="p-4">
              <div className="aspect-square bg-gray-100 rounded-md mb-2 overflow-hidden">
                {getImageUrls(item.images).map((url, index) => (
                  <Image
                    key={url}
                    src={url}
                    alt={`${item.title} - ${index + 1}`}
                    width={400}
                    height={400}
                  />
                ))}
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

      {/* Pagination */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
