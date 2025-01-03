import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 保护需要登录的路由
  if (["/wishlist", "/account"].includes(req.nextUrl.pathname) && !session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 如果已登录，访问登录页则重定向到首页
  if (req.nextUrl.pathname === "/login" && session) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return res;
}
