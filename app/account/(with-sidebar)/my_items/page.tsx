import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import OptionBar from "@/app/_components/OptionBar";
import PaginationBar from "@/app/_components/PaginationBar";
import MyItemCard from "@/app/_components/MyItemCard";
import Link from "next/link";
import { PageOption } from "@/app/_types";

export default function MyItemsPage() {
  const sampleItems = [
    {
      id: 1,
      title: "Vintage Camera",
      price: 299.99,
      status: "available",
      image: "/api/placeholder/400/400",
    },
    {
      id: 2,
      title: "Classic Watch",
      price: 599.99,
      status: "reserved",
      image: "/api/placeholder/400/400",
    },
    {
      id: 3,
      title: "Antique Vase",
      price: 199.99,
      status: "sold",
      image: "/api/placeholder/400/400",
    },
    {
      id: 4,
      title: "Vintage Record Player",
      price: 449.99,
      status: "available",
      image: "/api/placeholder/400/400",
    },
    {
      id: 5,
      title: "Retro Phone",
      price: 159.99,
      status: "available",
      image: "/api/placeholder/400/400",
    },
  ] as const;

  const sortOptions = [
    { label: "All Items", value: "all" },
    { label: "Available", value: "available" },
    { label: "Sold", value: "sold" },
    { label: "Reserved", value: "reserved" },
  ];

  const itemsPerPage = 4;

  const pageOption: PageOption = {
    currentPage: 1,
    totalPages: 2,
  };

  const startIndex = (pageOption.currentPage - 1) * itemsPerPage;
  const displayedItems = sampleItems.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Top Section */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <Button
          size="lg"
          variant="outline"
          className="bg-indigo-500 hover:bg-indigo-600 text-white w-full sm:w-auto"
          asChild
        >
          <Link href="/account/my_items/edit">
            <Plus className="mr-2 h-5 w-5" />
            Add New Item
          </Link>
        </Button>

        <div className="w-full sm:w-auto sm:flex-1 sm:max-w-2xl sm:ml-6 ">
          <OptionBar
            sortOptions={sortOptions}
            currentSort="all"
            page={"account/my_items"}
          />
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-4">
        {displayedItems.map((item) => (
          <MyItemCard key={item.id} item={item} />
        ))}
      </div>

      {/* Pagination */}
      {sampleItems.length > 4 && (
        <div className="mt-8 flex justify-center">
          <PaginationBar pageOption={pageOption} page="account/my_items" />
        </div>
      )}
    </div>
  );
}
