import { CategoryCount, Item, User } from "../_types";
import { createClient as createBrowserClient } from "./supabase/client";
import { createClient as createServerClient } from "./supabase/server";

const supabaseClient = createBrowserClient();
const supabaseServer = await createServerClient();

export async function getUser(id: number): Promise<User | null> {
  const { data: user, error } = await supabaseClient
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
export async function getMainCategoriesCount(): Promise<
  CategoryCount[] | null
> {
  const { data: itemCount, error } = await supabaseClient.rpc(
    "get_main_categories_count" as never
  );

  if (error) {
    console.error(error);
    return null;
  }

  return itemCount;
}

export async function getItemsBySearchParams(
  page: number = 1,
  category: string = "all",
  sort: string = "newest"
): Promise<{ items: Item[] | null; totalPages: number }> {
  const pageSize = 16;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabaseClient
    .from("items")
    .select("*", { count: "exact" })
    .eq("status", "available");

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

export async function getItemDetail(id: number) {
  const { data: item, error } = await supabaseClient
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
    .eq("status", "available")
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return item;
}

export async function getUserWishlist() {
  const {
    data: { user },
    error: userError,
  } = await supabaseServer.auth.getUser();

  if (!user?.email) {
    console.error("No authenticated user or email found");
    return null;
  }

  if (userError) {
    console.error("There are some error with user");
    return null;
  }

  if (!user) {
    console.error("No authenticated user found");
    return null;
  }

  const { data: existingUser, error: userDbError } = await supabaseServer
    .from("users")
    .select("id")
    .eq("email", user.email)
    .single();

  if (userDbError) {
    console.error("There are some error with user database");
    return null;
  }

  if (!existingUser) {
    console.error("User not found in database");
    return null;
  }

  const { data: wishlistItems, error } = await supabaseServer
    .from("wishlist")
    .select(
      `
      id,
      created_at,
      item_id,
      user_id,
      items:item_id (
        id,
        title,
        price,
        images,
        status
      )
    `
    )
    .eq("user_id", existingUser.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching wishlist:", error);
    return null;
  }

  return wishlistItems;
}
