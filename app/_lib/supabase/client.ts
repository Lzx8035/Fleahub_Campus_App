import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/app/_lib/database.types";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// 这是 Next.js App Router 和 Supabase 新的最佳实践,根据运行环境分开了 client 和 server:

// 1. Server 环境 (`server.ts`):
//    - 用于服务器端组件(Server Components)
//    - 用于 API 路由
//    - 数据预取
//    - 可以访问所有环境变量
//    - 主要用于读取数据操作

// 2. Client 环境 (`client.ts`):
//    - 用于客户端组件(`'use client'`)
//    - 用户交互(点击、提交等)
//    - 实时订阅
//    - 只能访问 `NEXT_PUBLIC_` 环境变量
//    - 主要用于写入数据操作

// 这种分离带来的好处:
// - 更好的安全性(敏感操作在服务器端)
// - 更好的性能(减少客户端请求)
// - 更清晰的代码架构
// - 更好的类型安全性

// 所以我们之前写的那些数据获取函数都放在了 server 端,因为它们主要是用于页面渲染时的数据读取。而用户交互相关的操作,比如点赞、评论等,就会用到 client 端的代码。
