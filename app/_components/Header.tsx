import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import UserMenu from "./UserMenu";

export default async function Header() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
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
    }
  );

  // 修改 1: 获取 session 和 user
  const [
    {
      data: { user },
    },
  ] = await Promise.all([supabase.auth.getUser()]);

  const publicNavigation = [
    { name: "Home", href: "/" },
    { name: "Items", href: "/items" },
  ];

  const protectedNavigation = [
    { name: "My Wishlist", href: "/wishlist" },
    { name: "My Account", href: "/account" },
  ];

  // 修改 2: 使用 user 来判断是否登录
  const navigation = user
    ? [...publicNavigation, ...protectedNavigation]
    : publicNavigation;

  return (
    <header className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-gray-900">
                FleaHub Campus
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                {item.name}
              </Link>
            ))}
            {/* 修改 3: 传递 user 而不是 session.user */}
            {user ? (
              <UserMenu user={user} />
            ) : (
              <Button asChild>
                <Link href="/login">Login</Link>
              </Button>
            )}
          </nav>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col gap-4 mt-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-sm font-medium text-gray-600 hover:text-gray-900"
                  >
                    {item.name}
                  </Link>
                ))}
                {/* 修改 4: 这里也使用 user */}
                {user ? (
                  <UserMenu user={user} />
                ) : (
                  <Button asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
