import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { CategoryCount, Item, User } from "../_types";

async function getSupabaseClient() {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options)
        );
      },
    },
  });
}

export async function getUser(id: number): Promise<User | null> {
  const supabase = await getSupabaseClient();

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
export async function getMainCategoriesCount(): Promise<
  CategoryCount[] | null
> {
  const supabase = await getSupabaseClient();

  const { data: itemCount, error } = await supabase.rpc(
    "get_main_categories_count"
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
  const supabase = await getSupabaseClient();
  const pageSize = 16;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
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

// TODO
export async function getItemDetail(id: number) {
  const supabase = await getSupabaseClient();

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
    .eq("status", "available")
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return item;
}
