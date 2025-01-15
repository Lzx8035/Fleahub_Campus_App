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

// 1. 在 server-side 的数据服务层（使用 server.ts）:
// - 只负责数据操作
// - 返回数据或 null/错误
// - 不应该处理重定向（redirect）
// - 不应该包含路由逻辑

// 2. 在页面组件或路由处理中：
// - 负责处理数据服务返回的结果
// - 决定重定向逻辑
// - 处理用户界面相关的状态

// 这样的分层可以：
// - 避免循环重定向
// - 保持代码职责清晰
// - 使数据服务更容易复用
// - 让路由逻辑集中在一处管理

// 这也符合关注点分离（Separation of Concerns）的原则。
