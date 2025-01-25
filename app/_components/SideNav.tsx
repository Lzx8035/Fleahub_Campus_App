"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CustomAlertDialog } from "./CustomAlertDialog";
import { signOut } from "@/app/_lib/auth";
import { LogOut } from "lucide-react";

const sideNavItems = [
  { name: "Personal Info", href: "/account" },
  { name: "My Items", href: "/account/my_items" },
  { name: "My Appointments", href: "/account/my_appointments" },
  { name: "Settings", href: "/account/settings" },
];

export default function SideNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      router.refresh();
    }
  };

  return (
    <aside className="w-64 shrink-0">
      <nav className="space-y-2 flex flex-col gap-2">
        {sideNavItems.map((item) => (
          <Button
            key={item.name}
            variant="ghost"
            className={`w-full justify-start text-base ${
              pathname === item.href ? "bg-slate-200" : ""
            }`}
            asChild
          >
            <Link href={item.href}>{item.name}</Link>
          </Button>
        ))}

        <div>
          <CustomAlertDialog
            triggerText="Sign Out"
            title="Sign Out"
            description="Are you sure you want to sign out?"
            onConfirm={handleSignOut}
            variant="ghost"
            buttonClassName="w-full justify-start text-base"
            icon={<LogOut className="h-6 w-6" />}
          />
        </div>
      </nav>
    </aside>
  );
}
