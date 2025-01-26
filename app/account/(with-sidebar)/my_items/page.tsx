import React, { Suspense } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import OptionBar from "@/app/_components/OptionBar";
import PaginationBar from "@/app/_components/PaginationBar";
import MyItemCard from "@/app/_components/MyItemCard";
import Link from "next/link";
import { getMyItems, getSupabaseUserData } from "@/app/_lib/data_service";
import {
  createMyItemsSortConfig,
  getClientPagination,
  getClientSort,
} from "@/app/_lib/utils";
import { MyItem, SearchParams } from "@/app/_types";

const sortOptions = [
  { label: "All Items", value: "all" },
  { label: "Available", value: "available" },
  { label: "Sold", value: "sold" },
  { label: "Reserved", value: "reserved" },
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
];

export default async function MyItemsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const userData = await getSupabaseUserData();
  const myItems = await getMyItems(userData!.id!);

  const resolvedSearchParams = await searchParams;
  const { sort = "all" } = resolvedSearchParams;

  const sortedItems = getClientSort<MyItem>({
    items: myItems,
    currentSort: sort,
    sortConfig: createMyItemsSortConfig(),
  });

  const { paginatedItems, pageOption, hasMultiplePages } =
    await getClientPagination<MyItem>({
      searchParams: resolvedSearchParams,
      items: sortedItems,
    });

  if (!myItems?.length) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No items yet</h2>
          <p className="text-gray-500 mb-4">
            Start selling by adding your first item!
          </p>
          <Button asChild>
            <Link href="/account/my_items/edit">Add New Item</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <Button
          size="lg"
          variant="outline"
          className="bg-indigo-500 hover:bg-indigo-600 text-white hover:text-white w-full sm:w-auto"
          asChild
        >
          <Link href="/account/my_items/edit">
            <Plus className="mr-2 h-5 w-5" />
            Add New Item
          </Link>
        </Button>
        <Suspense fallback={<div>Loading options...</div>}>
          <div className="w-full sm:w-auto sm:flex-1 sm:max-w-2xl sm:ml-6">
            <OptionBar
              sortOptions={sortOptions}
              currentSort={sort}
              page="account/my_items"
            />
          </div>
        </Suspense>
      </div>

      <Suspense fallback={<div>Loading items...</div>}>
        <div className="space-y-4">
          {paginatedItems.map((item) => (
            <MyItemCard key={item.id} myItem={item} />
          ))}
        </div>
      </Suspense>

      {hasMultiplePages && (
        <Suspense fallback={<div>Loading pagination...</div>}>
          <div className="mt-8 flex justify-center">
            <PaginationBar pageOption={pageOption} page="account/my_items" />
          </div>
        </Suspense>
      )}
    </div>
  );
}
