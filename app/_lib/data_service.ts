import supabase from "./supabase";
import { Database } from "@/app/_lib/database.types";

type User = Database["public"]["Tables"]["users"]["Row"];
type Item = Database["public"]["Tables"]["items"]["Row"];
type CategoryCount = {
  main_category: string;
  count: number;
};

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
