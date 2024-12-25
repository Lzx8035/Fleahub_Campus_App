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

export const metadata = {
  title: "Items",
};

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
];

const categories = [
  { id: "all", name: "All", count: 160 },
  { id: "textbooks", name: "Textbooks", count: 45 },
  { id: "electronics", name: "Electronics", count: 32 },
  { id: "furniture", name: "Furniture", count: 28 },
  { id: "clothing", name: "Clothing", count: 25 },
  { id: "supplies", name: "School Supplies", count: 20 },
  { id: "others", name: "Others", count: 10 },
];

export default function ItemsPage() {
  const list = [...Array(16)].map((_, i) => i + 1);
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

      {/* Categories Bar */}
      <div className="top-16 bg-white border-b z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={category.id === "all" ? "default" : "outline"}
                className="shrink-0"
              >
                <span>{category.name}</span>
                <span className="ml-2 text-xs bg-gray-400 px-2 py-0.5 rounded-full">
                  {category.count}
                </span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {list.map((item) => (
          <Card key={item} className="w-full">
            <div className="p-4">
              <div className="aspect-square bg-gray-100 rounded-md mb-2" />
              <h3 className="font-semibold">Item Name</h3>
              <p className="text-lg font-bold text-[#2a2f33] mt-1">$99</p>
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
