import {
  getItemsBySearchParams,
  getMainCategoriesCount,
  getUserWishlist,
} from "../_lib/data_service";

import ItemsGrid from "../_components/ItemsGrid";
import CategoriesBar from "../_components/CategoriesBar";
import OptionBar from "../_components/OptionBar";
import PaginationBar from "../_components/PaginationBar";

import { SortOption, PageOption } from "../_types";
import { createClient } from "../_lib/supabase/server";

export const metadata = {
  title: "Items",
};

const sortOptions: Array<SortOption> = [
  { value: "newest", label: "Newest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
];

interface SearchParams {
  page?: string;
  category?: string;
  sort?: string;
}

export default async function ItemsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const isLoggedIn = !!session;

  const awaitedSearchParams = await searchParams;

  function getParams() {
    return {
      page: Number(awaitedSearchParams?.page) || 1,
      category: awaitedSearchParams?.category || "all",
      sort: awaitedSearchParams?.sort || "newest",
    };
  }

  const { page, category, sort } = await getParams();

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
      <OptionBar sortOptions={sortOptions} currentSort={sort} page="items" />
      <CategoriesBar currentCategory={category} itemsCount={itemsCount} />
      <ItemsGrid
        items={items}
        initialWishlistItems={wishlistItems || []}
        isLoggedIn={isLoggedIn}
      />
      <PaginationBar pageOption={pageOption} page={"items"} />
    </div>
  );
}
