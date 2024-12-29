import supabase from "./supabase";
import { Database } from "@/app/_lib/database.types";

import { CategoryCount } from "../_types";

type User = Database["public"]["Tables"]["users"]["Row"];
type Item = Database["public"]["Tables"]["items"]["Row"];

////// User
export async function getUser(id: number): Promise<User | null> {
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return user;
}

/////// Items
// Get items by page
export async function getItemByPage(page: number = 1): Promise<Item[] | null> {
  const pageSize = 16;

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data: items, error } = await supabase
    .from("items")
    .select("*")
    .range(from, to);

  if (error) {
    console.error(error);
    return null;
  }

  console.log(items);
  return items;
}

// get mian Item Count
export async function getMainCategoriesCount(): Promise<
  CategoryCount[] | null
> {
  const { data: itemCount, error } = await supabase.rpc(
    "get_main_categories_count"
  );

  if (error) {
    console.error(error);
    return null;
  }

  return itemCount;
}

export async function getItemBySearchParams(
  page: number = 1,
  category: string = "all",
  sort: string = "newest"
): Promise<{ items: Item[] | null; totalPages: number }> {
  const pageSize = 16;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase.from("items").select("*", { count: "exact" });

  if (category !== "all") {
    query = query.ilike("categories", `${category}/%`);
  }

  switch (sort) {
    case "price-low":
      query = query.order("price", { ascending: true });
      break;
    case "price-high":
      query = query.order("price", { ascending: false });
      break;
    case "newest":
    default:
      query = query.order("created_at", { ascending: false });
  }

  const { data: items, error, count } = await query.range(from, to);

  if (error) {
    console.error(error);
    return { items: null, totalPages: 0 };
  }

  const totalPages = Math.ceil((count || 0) / pageSize);

  return {
    items,
    totalPages,
  };
}
