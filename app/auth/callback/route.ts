import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // 从请求 URL 中提取认证码
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    // 创建 supabase 路由处理客户端
    const supabase = createRouteHandlerClient({ cookies });
    // 将认证码转换为用户会话
    const {
      data: { user },
    } = await supabase.auth.exchangeCodeForSession(code);
    console.log("User in callback:", user);
  }

  // 认证完成后重定向到首页或dashboard
  return NextResponse.redirect(new URL("/", request.url));
}
