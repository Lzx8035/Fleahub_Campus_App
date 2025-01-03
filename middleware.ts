import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          res.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          res.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  // 获取session
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

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
