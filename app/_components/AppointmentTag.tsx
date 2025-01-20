// app/_components/StatusBadges.tsx
import { Badge } from "@/components/ui/badge";

const roleStyles = {
  buy: "bg-pink-400",
  sell: "bg-emerald-400",
} as const;

const statusStyles = {
  pending: "bg-amber-500",
  completed: "bg-indigo-500",
  canceled: "bg-gray-500",
} as const;

interface AppointmentTagProps {
  role: "buy" | "sell";
  status: "pending" | "completed" | "canceled";
}

export default function AppointmentTag({ role, status }: AppointmentTagProps) {
  return (
    <div className="flex gap-2 items-center m-1.5">
      <Badge variant="secondary" className={`${roleStyles[role]} text-white`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
      <Badge
        variant="secondary"
        className={`${statusStyles[status]} text-white`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    </div>
  );
}
