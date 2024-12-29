export interface SortOption {
  value: "newest" | "price-low" | "price-high";
  label: string;
}

export interface PageOption {
  currentPage: number;
  totalPages: number;
}

export type CategoryCount = {
  main_category: string;
  count: number;
};
