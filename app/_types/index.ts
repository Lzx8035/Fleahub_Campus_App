import { Database } from "@/database.types";

export type User = Database["public"]["Tables"]["users"]["Row"];
export type Item = Database["public"]["Tables"]["items"]["Row"];
export type Json = Database["public"]["Tables"]["items"]["Row"]["images"];

export interface SortOption {
  value: string;
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

////////////////////////////////////

export interface SearchParams {
  page?: string;
  category?: string;
  sort?: string;
  id?: string;
  itemId?: string;
}

export interface Params {
  id?: string;
  itemId?: string;
}

////////////
// type Seller = {
//   id: Database["public"]["Tables"]["users"]["Row"]["id"];
//   name: Database["public"]["Tables"]["users"]["Row"]["name"];
//   avatar_url: Database["public"]["Tables"]["users"]["Row"]["avatar_url"];
// };

// export type ItemDetail = Database["public"]["Tables"]["items"]["Row"] & {
//   seller: Seller;
// };

export type WishlistItem = {
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
};

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

/////////////////////////////////////////////

export type MyItem = {
  id: number;
  created_at: string;
  update_at: string | null;
  title: string;
  description: string;
  price: number;
  seller_id: number;
  status: "available" | "sold" | "reserved";
  categories: string;
  images: string;
  seller: {
    id: number;
    created_at: string;
    email: string;
    name: string;
    avatar_url: string | null;
  };
};

/////////////////////////////////////////////
export type AppointmentStatusType = "pending" | "completed" | "canceled";

export type AppointmentStatus = {
  buyer_status: "pending" | "approved" | "canceled";
  seller_status: "pending" | "approved" | "canceled";
  overall_status: AppointmentStatusType;
  buyer_confirmed_at: string | null;
  seller_confirmed_at: string | null;
};

export type MyAppointment = Omit<
  Database["public"]["Tables"]["appointments"]["Row"],
  "status"
> & {
  items: Database["public"]["Tables"]["items"]["Row"];
  buyer: Database["public"]["Tables"]["users"]["Row"];
  seller: Database["public"]["Tables"]["users"]["Row"];
  status: AppointmentStatus;
};

/////////////////////////////////////////////
export type ItemDetail = Database["public"]["Tables"]["items"]["Row"] & {
  seller: Database["public"]["Tables"]["users"]["Row"];
};

///////
export type PaymentMethod = "cash" | "emt" | "both";
