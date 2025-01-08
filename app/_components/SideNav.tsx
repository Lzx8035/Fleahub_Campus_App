"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

const sideNavItems = [
  { name: "Personal Info", href: "/account" },
  { name: "Orders", href: "/account/orders" },
  { name: "My Items", href: "/account/my_items" },
  { name: "Settings", href: "/account/settings" },
];

export default function SideNav() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0">
      <nav className="space-y-2">
        {sideNavItems.map((item) => (
          <Button
            key={item.name}
            variant="ghost"
            className={`w-full justify-start ${
              pathname === item.href ? "bg-slate-200" : ""
            }`}
            asChild
          >
            <Link href={item.href}>{item.name}</Link>
          </Button>
        ))}
      </nav>
    </aside>
  );
}
