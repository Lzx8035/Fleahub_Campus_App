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

////// reference
// const categories = {
//   'books': ['textbooks', 'academic_books', 'fiction', 'magazines', 'study_guides', 'research_papers'],
//   'electronics': ['laptops', 'smartphones', 'tablets', 'headphones', 'monitors', 'computer_accessories'],
//   'furniture': ['chairs', 'desks', 'shelves', 'lamps', 'storage', 'bed_accessories'],
//   'clothing': ['winter_wear', 'summer_wear', 'formal_wear', 'shoes', 'bags', 'accessories'],
//   'supplies': ['stationery', 'art_supplies', 'lab_equipment', 'sports_equipment', 'kitchen_supplies', 'cleaning_supplies'],
//   'others': ['collectibles', 'instruments', 'board_games', 'bike', 'decorations']
// };

export default async function ItemsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
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

  const pageOptions: PageOption = {
    currentPage: page,
    totalPages: totalPages,
  };

  if (!items || !itemsCount) {
    return <div>Failed to load items</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <OptionBar sortOptions={sortOptions} currentSort={sort} />
      <CategoriesBar currentCategory={category} itemsCount={itemsCount} />
      <ItemsGrid items={items} initialWishlistItems={wishlistItems || []} />
      <PaginationBar pageOption={pageOptions} page={"items"} />
    </div>
  );
}
