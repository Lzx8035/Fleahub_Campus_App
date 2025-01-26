import React, { Suspense } from "react";
import {
  getItemsBySearchParams,
  getMainCategoriesCount,
  getUserWishlist,
} from "@/app/_lib/data_service";

import ItemsGrid from "@/app/_components/ItemsGrid";
import OptionBar from "@/app/_components/OptionBar";
import CategoriesBar from "@/app/_components/CategoriesBar";
import PaginationBar from "@/app/_components/PaginationBar";

import { SortOption, PageOption, SearchParams } from "@/app/_types";
import { createClient } from "@/app/_lib/supabase/server";

export const metadata = {
  title: "Items",
};

const sortOptions: Array<SortOption> = [
  { value: "newest", label: "Newest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
];

export default async function ItemsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const isLoggedIn = !!session;

  const awaitedSearchParams = await searchParams;
  const page = Number(awaitedSearchParams?.page) || 1;
  const category = awaitedSearchParams?.category || "all";
  const sort = awaitedSearchParams?.sort || "newest";

  const { items, totalPages } = await getItemsBySearchParams(
    page,
    category,
    sort
  );
  const itemsCount = await getMainCategoriesCount();
  const wishlistItems = await getUserWishlist();

  const pageOption: PageOption = {
    currentPage: page,
    totalPages: totalPages,
  };

  if (!items || !itemsCount) {
    return <div>Failed to load items</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Suspense fallback={<div>Loading options...</div>}>
        <OptionBar sortOptions={sortOptions} currentSort={sort} page="items" />
      </Suspense>
      <Suspense fallback={<div>Loading categories...</div>}>
        <CategoriesBar currentCategory={category} itemsCount={itemsCount} />
      </Suspense>
      <ItemsGrid
        items={items}
        initialWishlistItems={wishlistItems || []}
        isLoggedIn={isLoggedIn}
      />
      <Suspense fallback={<div>Loading pagination...</div>}>
        <PaginationBar pageOption={pageOption} page={"items"} />
      </Suspense>
    </div>
  );
}
