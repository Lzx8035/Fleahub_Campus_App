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

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const publicNavigation = [
    { name: "Home", href: "/" },
    { name: "Items", href: "/items" },
  ];

  const protectedNavigation = [
    { name: "My Wishlist", href: "/wishlist" },
    { name: "My Account", href: "/account" },
  ];

  const navigation = session
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
            {session ? (
              <UserMenu user={session.user} />
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
                {session ? (
                  <UserMenu user={session.user} />
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
