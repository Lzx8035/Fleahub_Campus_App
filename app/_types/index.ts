import { Database } from "@/database.types";

export type User = Database["public"]["Tables"]["users"]["Row"];
export type Item = Database["public"]["Tables"]["items"]["Row"];
export type Json = Database["public"]["Tables"]["items"]["Row"]["images"];

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

////////////
// type Seller = {
//   id: Database["public"]["Tables"]["users"]["Row"]["id"];
//   name: Database["public"]["Tables"]["users"]["Row"]["name"];
//   avatar_url: Database["public"]["Tables"]["users"]["Row"]["avatar_url"];
// };

// export type ItemDetail = Database["public"]["Tables"]["items"]["Row"] & {
//   seller: Seller;
// };

export type WishlistItems = {
  id: number;
  created_at: string;
  item_id: number | null;
  user_id: number | null;
  items: {
    id: number;
    title: string;
    price: number;
    images: string;
    status: string;
    description: string;
  } | null;
}[];
