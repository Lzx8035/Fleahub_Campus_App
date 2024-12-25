import supabase from "./supabase";
import { Database } from "@/app/_lib/database.types";

type User = Database["public"]["Tables"]["users"]["Row"];

// User
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
