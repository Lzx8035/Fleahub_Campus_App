import React from "react";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow, format } from "date-fns";

import { MyAppointment } from "@/app/_types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  X,
  MessageCircle,
  Clock,
  MapPin,
  User,
  Pencil,
  Handshake,
} from "lucide-react";
import { getImageUrls } from "../_lib/utils";

interface AppointmentCardProps {
  appointment: MyAppointment;
  userId: number;
}

const statusStyles = {
  pending: "bg-amber-500 ",
  completed: "bg-indigo-500 ",
  canceled: "bg-gray-500 ",
};

const roleStyles = {
  buy: "bg-pink-400",
  sell: "bg-emerald-400",
};

export default function AppointmentCard({
  appointment,
  userId,
}: AppointmentCardProps) {
  const isCurrentUserBuyer = appointment.buyer_id === userId;

  return (
    <Card className="flex p-4 gap-4 bg-slate-50">
      <div className="w-40 h-40 relative rounded-lg overflow-hidden flex-shrink-0">
        <Image
          src={
            getImageUrls(appointment.items.images)[0] ||
            "/api/placeholder/400/400"
          }
          alt={appointment.items.title}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg">
                {appointment.items.title}
              </h3>
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
                className={`${
                  statusStyles[appointment.status.overall_status]
                } text-white`}
              >
                {appointment.status!.overall_status.charAt(0).toUpperCase() +
                  appointment.status!.overall_status.slice(1)}
              </Badge>
            </div>
          </div>

          <div>
            <p className="text-xl font-bold text-slate-900">
              ${appointment.items.price}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Handshake className="w-4 h-4 text-slate-400" />
              <span>
                Ordered at: {formatDistanceToNow(appointment.created_at)} ago
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>{appointment.meeting_location}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" />
              <span>
                {isCurrentUserBuyer ? "Seller" : "Buyer"} Name:{" "}
                {isCurrentUserBuyer
                  ? appointment.seller.name
                  : appointment.buyer.name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>
                Date:{" "}
                {format(new Date(appointment.meeting_time), "M/d/yy, h:mm a")}
              </span>
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
          disabled={appointment.status.overall_status !== "pending"}
        >
          <Check className="w-4 h-4 mr-2" />
          Complete
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="w-24"
          disabled={appointment.status.overall_status !== "pending"}
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
