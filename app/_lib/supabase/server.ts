import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "@/database.types";

// 创建 Supabase 客户端
export async function createClient() {
  // 获取 cookies
  const cookieStore = await cookies();

  // 检查环境变量
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
      "Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY) are missing."
    );
  }

  return createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch (error) {
          console.warn(
            "The `setAll` method encountered an issue, likely due to being called from a Server Component. This can be ignored if middleware refreshes sessions.",
            error
          );
        }
      },
    },
  });
}
