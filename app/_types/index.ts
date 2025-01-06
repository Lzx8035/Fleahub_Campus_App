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

// ???
// export interface ItemDetail {
//   id: number;
//   title: string;
//   price: number;
//   description: string;
//   categories: string;
//   images: string;
//   status: string;
//   created_at: string;
//   update_at: string | null;
//   seller_id: number;
//   seller: {
//     id: number;
//     name: string;
//     avatar_url: string | null;
//   };
// }
