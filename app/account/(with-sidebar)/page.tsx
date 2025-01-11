import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import StatusBar from "@/app/_components/StatusBar";

export const metadata = {
  title: "Account",
};

export default function AccountPage() {
  const itemStatuses = [
    { status: "Available", count: 12, color: "bg-teal-500" },
    { status: "Sold", count: 25, color: "bg-indigo-500" },
    { status: "Reserved", count: 8, color: "bg-gray-400" },
  ];

  const appointmentStatuses = [
    { status: "Pending", count: 5, color: "bg-amber-400" },
    { status: "Completed", count: 18, color: "bg-indigo-500" },
    { status: "Canceled", count: 3, color: "bg-gray-400" },
  ];

  return (
    <div className="flex flex-col gap-6 h-[500px]">
      {/* User Profile Section */}
      <div className="flex items-center gap-4 mb-8">
        <Avatar className="w-16 h-16">
          <AvatarImage src="/placeholder.jpg" alt="User avatar" />
          <AvatarFallback>UN</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl font-semibold">Username</h2>
          <p className="text-sm text-gray-500">ID: 123456789</p>
        </div>
      </div>

      <StatusBar title="Items" items={itemStatuses} type="items" />

      <StatusBar
        title="Appointments"
        items={appointmentStatuses}
        type="appointments"
      />
    </div>
  );
}
