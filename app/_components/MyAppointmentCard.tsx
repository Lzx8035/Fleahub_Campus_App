"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow, format } from "date-fns";

import { MyAppointment } from "@/app/_types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { getImageUrls } from "@/app/_lib/utils";
import AppointmentTag from "@/app/_components/AppointmentTag";
import { toast } from "sonner";
import { updateMyAppointmentStatusAction } from "@/app/_lib/action";

interface MyAppointmentCardProps {
  appointment: MyAppointment;
  userId: number;
}

export default function MyAppointmentCard({
  appointment,
  userId,
}: MyAppointmentCardProps) {
  const isCurrentUserBuyer = appointment.buyer_id === userId;
  const [currentUserStatus, setCurrentUserStatus] = useState(
    isCurrentUserBuyer
      ? appointment.status.buyer_status
      : appointment.status.seller_status
  );

  const [isPending, setIsPending] = useState(false);
  const [appointmentStatus, setAppointmentStatus] = useState(
    appointment.status
  );

  async function handleStatusUpdate(status: "approved" | "canceled") {
    try {
      setIsPending(true);
      const { success, updatedStatus } = await updateMyAppointmentStatusAction(
        appointment.id,
        isCurrentUserBuyer,
        status,
        status === "canceled" ? appointment.items.id : undefined
      );

      if (success && updatedStatus) {
        setAppointmentStatus(updatedStatus);
        setCurrentUserStatus(status);
        toast.success(
          status === "approved"
            ? "Appointment approved"
            : "Appointment canceled"
        );
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    } finally {
      setIsPending(false);
    }
  }

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
              <Link
                href={`/items/${appointment.items.id}`}
                className="font-semibold text-lg hover:text-stone-600 hover:underline"
              >
                {appointment.items.title}
              </Link>

              <p className="text-sm text-slate-500">
                Order ID: {appointment.id}
              </p>
            </div>
            <AppointmentTag
              role={isCurrentUserBuyer ? "buy" : "sell"}
              status={appointmentStatus.overall_status}
            />
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
              <span>
                {appointment.meeting_location
                  .split("_")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </span>
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
        {currentUserStatus !== "pending" ||
        isPending ||
        appointment.status.overall_status === "canceled" ? (
          <Button variant="outline" size="sm" className="w-28" disabled>
            <Pencil className="w-4 h-4 mr-2" />
            Edit
          </Button>
        ) : (
          <Button variant="outline" size="sm" className="w-28" asChild>
            <Link href={`/account/my_appointments/edit?id=${appointment.id}`}>
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </Link>
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          className="w-28"
          onClick={() => handleStatusUpdate("approved")}
          disabled={
            currentUserStatus !== "pending" ||
            isPending ||
            appointment.status.overall_status === "canceled"
          }
        >
          <Check className="w-4 h-4 mr-2" />
          {currentUserStatus === "approved" ? "Approved" : "Approve"}
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="w-28"
          onClick={() => handleStatusUpdate("canceled")}
          disabled={
            currentUserStatus !== "pending" ||
            isPending ||
            appointment.status.overall_status === "canceled"
          }
        >
          <X className="w-4 h-4 mr-2" />
          {currentUserStatus === "canceled" ? "Canceled" : "Cancel"}
        </Button>

        <Button variant="outline" size="sm" className="w-28">
          <MessageCircle className="w-4 h-4 mr-2" />
          Message
        </Button>
      </div>
    </Card>
  );
}
