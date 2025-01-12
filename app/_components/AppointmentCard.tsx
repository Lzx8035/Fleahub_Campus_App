import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Check,
  X,
  MessageCircle,
  Clock,
  MapPin,
  User,
  Pencil,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface AppointmentCardProps {
  appointment: {
    id: string;
    title: string;
    description: string;
    image: string;
    price: number;
    date: string;
    meetTime: string;
    location: string;
    partnerId: string;
    partnerName: string;
    status: "pending" | "completed" | "cancelled";
    buyer_id: number;
    current_user_id: number;
  };
}

const statusStyles = {
  pending: "bg-amber-500 ",
  completed: "bg-indigo-500 ",
  cancelled: "bg-gray-400 ",
};

const roleStyles = {
  buy: "bg-pink-400",
  sell: "bg-rose-400",
};

export default function AppointmentCard({ appointment }: AppointmentCardProps) {
  const isCurrentUserBuyer =
    appointment.buyer_id === appointment.current_user_id;

  return (
    <Card className="flex p-4 gap-4 bg-slate-50">
      <div className="w-40 h-40 relative rounded-lg overflow-hidden flex-shrink-0">
        <Image
          src={appointment.image || "/api/placeholder/400/400"}
          alt={appointment.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg">{appointment.title}</h3>
              <p className="text-sm text-slate-500">
                Order ID: {appointment.id}
              </p>
            </div>
            <div className="flex gap-2">
              <Badge
                variant="secondary"
                className={`${
                  roleStyles[isCurrentUserBuyer ? "buy" : "sell"]
                } text-white`}
              >
                {isCurrentUserBuyer ? "Buy" : "Sell"}
              </Badge>
              <Badge
                variant="secondary"
                className={`${statusStyles[appointment.status]} text-white`}
              >
                {appointment.status.charAt(0).toUpperCase() +
                  appointment.status.slice(1)}
              </Badge>
            </div>
          </div>

          <div>
            <p className="text-xl font-bold text-slate-900">
              ${appointment.price.toLocaleString()}
            </p>
            <p className="text-sm text-slate-600 line-clamp-2 mt-1">
              {appointment.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{appointment.meetTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>{appointment.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" />
              <span>
                {isCurrentUserBuyer ? "Seller" : "Buyer"} ID:{" "}
                {appointment.partnerId}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Date: {appointment.date}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 justify-start">
        <Button variant="outline" size="sm" className="w-24" asChild>
          <Link href="/account/my_appointments/edit">
            <Pencil className="w-4 h-4 mr-2" />
            Edit
          </Link>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="w-24"
          disabled={appointment.status !== "pending"}
        >
          <Check className="w-4 h-4 mr-2" />
          Complete
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="w-24"
          disabled={appointment.status !== "pending"}
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>

        <Button variant="outline" size="sm" className="w-24">
          <MessageCircle className="w-4 h-4 mr-2" />
          Message
        </Button>
      </div>
    </Card>
  );
}
