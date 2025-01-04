import { createServerClient, CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (!code) {
    console.error("No code in callback");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const response = NextResponse.redirect(new URL("/", request.url));

    // 修改这里：等待 cookies() Promise
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            response.cookies.set(name, value, options);
          },
          remove(name: string, options: CookieOptions) {
            response.cookies.set(name, "", { ...options, maxAge: 0 });
          },
        },
      }
    );

    const {
      data: { session },
      error,
    } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Session exchange error:", error);
      return NextResponse.redirect(new URL("/login", request.url));
    }

    console.log("Session created successfully:", !!session);

    return response;
  } catch (error) {
    console.error("Unexpected error in callback:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}
