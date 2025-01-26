import {
  Json,
  MyAppointment,
  MyItem,
  SearchParams,
  WishlistItems,
} from "@/app/_types";

export function getImageUrls(imageJson: Json): string[] {
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

export function isItemInWishlist(itemId: number, wishlistItems: WishlistItems) {
  return wishlistItems.some((wishItem) => wishItem.items?.id === itemId);
}

/////////////////////
export const ITEMS_PER_PAGE = 4;

export interface ClientPaginationParams<T> {
  searchParams: SearchParams;
  items: T[];
}

export async function getClientPagination<T>({
  searchParams,
  items,
}: ClientPaginationParams<T>) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const totalPages = Math.ceil((items?.length || 0) / ITEMS_PER_PAGE);

  const paginatedItems = items?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const pageOption = {
    currentPage,
    totalPages,
  };

  return {
    paginatedItems,
    pageOption,
    hasMultiplePages: totalPages > 1,
  };
}

///////////////////////////////////
export interface ClientSortParams<T> {
  items: T[];
  currentSort: string;
  sortConfig: {
    [key: string]: (items: T[]) => T[];
  };
}

export function getClientSort<T>({
  items,
  currentSort,
  sortConfig,
}: ClientSortParams<T>) {
  if (!items?.length) return items;

  const sortFunction = sortConfig[currentSort];
  if (!sortFunction) return items;

  return sortFunction(items);
}

export function createMyItemsSortConfig() {
  return {
    all: (items: MyItem[]) => items,
    available: (items: MyItem[]) =>
      items.filter((item) => item.status === "available"),
    sold: (items: MyItem[]) => items.filter((item) => item.status === "sold"),
    reserved: (items: MyItem[]) =>
      items.filter((item) => item.status === "reserved"),
    newest: (items: MyItem[]) =>
      [...items].sort(
        (a, b) =>
          new Date(b.created_at || "").getTime() -
          new Date(a.created_at || "").getTime()
      ),
    oldest: (items: MyItem[]) =>
      [...items].sort(
        (a, b) =>
          new Date(a.created_at || "").getTime() -
          new Date(b.created_at || "").getTime()
      ),
  };
}

export function createAppointmentSortConfig() {
  return {
    all: (items: MyAppointment[]) => items,
    pending: (items: MyAppointment[]) =>
      items.filter((item) => item.status.overall_status === "pending"),
    completed: (items: MyAppointment[]) =>
      items.filter((item) => item.status.overall_status === "completed"),
    canceled: (items: MyAppointment[]) =>
      items.filter((item) => item.status.overall_status === "canceled"),
    newest: (items: MyAppointment[]) =>
      [...items].sort(
        (a, b) =>
          new Date(b.created_at || "").getTime() -
          new Date(a.created_at || "").getTime()
      ),
    oldest: (items: MyAppointment[]) =>
      [...items].sort(
        (a, b) =>
          new Date(a.created_at || "").getTime() -
          new Date(b.created_at || "").getTime()
      ),
  };
}
