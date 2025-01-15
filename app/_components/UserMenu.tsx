"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signOut } from "@/app/_lib/auth";
import { CustomAlertDialog } from "./CustomAlertDialog";
import { LogOut } from "lucide-react";

interface UserData {
  id: number;
  email: string;
  name: string;
  avatar_url: string | null;
}

export default function UserMenu({ userData }: { userData: UserData }) {
  const router = useRouter();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      router.refresh();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={userData?.avatar_url || ""}
              alt={userData.email}
            />
            <AvatarFallback>
              {userData.email?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <Link href="/account/my_items/edit" className="w-full">
            Add new items to sell
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/account/my_items" className="w-full">
            My items
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/account/my_appointments" className="w-full">
            My appointments
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <CustomAlertDialog
            triggerText="Sign Out"
            title="Sign Out"
            description="Are you sure you want to sign out?"
            onConfirm={handleSignOut}
            variant="ghost"
            buttonClassName="w-full justify-start text-sm"
            icon={<LogOut className="h-4 w-4" />}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
