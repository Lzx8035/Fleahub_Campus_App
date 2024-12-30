import supabase from "./supabase";

import { CategoryCount, Item, ItemDetail, User } from "../_types";

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

////// Items
// use in category bar
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

// used in items page
export async function getItemsBySearchParams(
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

// use in item details
// TODO: Include all info in items details, like messages, seller id and avatar, appointment, whether in wishlist or not
export default async function getItemDetail(
  id: number
): Promise<ItemDetail | null> {
  const { data: item, error } = await supabase
    .from("items")
    .select(
      `
    *,
    seller:users!seller_id (
      id,
      name,
      avatar_url
    )
  `
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return item;
}
