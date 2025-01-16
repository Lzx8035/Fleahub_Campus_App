import {
  getDashboardStats,
  getSupabaseUserData,
} from "@/app/_lib/data_service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import StatusBar from "@/app/_components/StatusBar";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Account",
};

export default async function AccountPage() {
  const userData = await getSupabaseUserData();

  if (!userData) {
    redirect("/login");
  }

  const stats = await getDashboardStats(userData.id);

  const initials =
    userData.name?.slice(0, 2).toUpperCase() ||
    userData.email?.slice(0, 2).toUpperCase() ||
    "UN";

  const itemStatuses = [
    { status: "Available", count: stats.items.Available, color: "bg-teal-500" },
    { status: "Sold", count: stats.items.Sold, color: "bg-indigo-500" },
    { status: "Reserved", count: stats.items.Reserved, color: "bg-gray-400" },
  ];

  const appointmentStatuses = [
    {
      status: "Pending",
      count: stats.appointments.Pending,
      color: "bg-amber-400",
    },
    {
      status: "Completed",
      count: stats.appointments.Completed,
      color: "bg-indigo-500",
    },
    {
      status: "Canceled",
      count: stats.appointments.Canceled,
      color: "bg-gray-400",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4 mb-8">
        <Avatar className="w-16 h-16">
          <AvatarImage
            src={userData.avatar_url || ""}
            alt={`${userData.email}'s avatar`}
          />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl font-semibold">
            {userData.name || userData.email?.split("@")[0]}
          </h2>
          <p className="text-sm text-gray-500">{userData.email}</p>
        </div>
      </div>

      <div className="space-y-6">
        <StatusBar title="My Items" items={itemStatuses} type="items" />

        <StatusBar
          title="My Appointments"
          items={appointmentStatuses}
          type="appointments"
        />
      </div>
    </div>
  );
}
