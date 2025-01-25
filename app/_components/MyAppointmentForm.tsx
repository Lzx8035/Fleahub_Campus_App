"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, Clock, MapPin, Banknote, Loader2 } from "lucide-react";
import type { ItemDetail, MyAppointment, PaymentMethod } from "@/app/_types";
import { getImageUrls } from "@/app/_lib/utils";
import AppointmentTag from "@/app/_components/AppointmentTag";
import { EditOrCreateMyAppointmentAction } from "@/app/_lib/action";
import { toast } from "sonner";

const locations = [
  { value: "student_center", label: "Student Center" },
  { value: "residence", label: "Residence" },
  { value: "library", label: "Library" },
  { value: "book_store", label: "Book Store" },
] as const;

interface AppointmentFormProps {
  mode: "create" | "edit";
  itemData?: ItemDetail;
  appointmentData?: MyAppointment;
  userId: number;
}

export default function MyAppointmentForm({
  mode,
  itemData,
  appointmentData,
  userId,
}: AppointmentFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = mode === "edit";
  const isCurrentUserBuyer = isEditMode
    ? appointmentData?.buyer_id === userId
    : true;

  const displayItem = isEditMode ? appointmentData?.items : itemData!;

  const [meetingDate, setMeetingDate] = useState(() => {
    if (!isEditMode) return "";
    if (!appointmentData?.meeting_time) return "";
    try {
      const date = new Date(appointmentData.meeting_time);
      return date.toISOString().split("T")[0];
    } catch {
      return "";
    }
  });

  const [meetingTime, setMeetingTime] = useState(() => {
    if (!isEditMode) return "";
    if (!appointmentData?.meeting_time) return "";
    try {
      const date = new Date(appointmentData.meeting_time);
      return date.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  });

  const [location, setLocation] = useState(() => {
    if (!isEditMode) return "student_center";
    return appointmentData?.meeting_location || "student_center";
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(() => {
    if (!isEditMode) return "both";
    return (appointmentData?.payment_method as PaymentMethod) || "both";
  });

  if (!displayItem) {
    return <div>No item data available</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingDate || !meetingTime) {
      toast.error("Please select meeting time");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();

      const combinedDateTime = `${meetingDate} ${meetingTime}:00`;
      formData.append("meeting_time", combinedDateTime);
      formData.append("meeting_location", location);
      formData.append("payment_method", paymentMethod);

      if (!isEditMode && itemData?.id) {
        formData.append("item_id", itemData.id.toString());
      } else if (appointmentData?.id) {
        formData.append("id", appointmentData.id.toString());
      }

      const success = await EditOrCreateMyAppointmentAction(formData);
      if (success) {
        router.push("/account/my_appointments");
      } else {
        toast.error("Failed to save appointment");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!displayItem) {
    return <div>No item data available</div>;
  }

  return (
    <>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Item Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-6">
            <div className="w-40 h-40 relative rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={
                  getImageUrls(displayItem?.images)[0] ||
                  "/api/placeholder/400/400"
                }
                alt={displayItem?.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">
                {displayItem?.title}
              </h3>
              <p className="text-2xl font-bold text-slate-900 mb-4">
                ${displayItem?.price}
              </p>
              {isEditMode ? (
                <>
                  <p className="text-sm text-slate-500">
                    {isCurrentUserBuyer ? "Seller" : "Buyer"}:{" "}
                    {isCurrentUserBuyer
                      ? appointmentData?.seller.name
                      : appointmentData?.buyer.name}{" "}
                    ID:{" "}
                    {isCurrentUserBuyer
                      ? appointmentData?.seller_id
                      : appointmentData?.buyer_id}
                  </p>
                  <p className="text-sm text-slate-500">
                    Email:{" "}
                    {isCurrentUserBuyer
                      ? appointmentData?.seller.email
                      : appointmentData?.buyer.email}
                  </p>
                  <AppointmentTag
                    role={isCurrentUserBuyer ? "buy" : "sell"}
                    status={appointmentData?.status.overall_status || "pending"}
                  />
                </>
              ) : (
                <>
                  <p className="text-sm text-slate-500">
                    Seller: {itemData?.seller.name} ID: {itemData?.seller_id}
                  </p>
                  <p className="text-sm text-slate-500">
                    Email: {itemData?.seller.email}
                  </p>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appointment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="meeting-time">Meeting Time</Label>
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="meeting-date"
                    type="date"
                    className="pl-10"
                    value={meetingDate}
                    onChange={(e) => setMeetingDate(e.target.value)}
                  />
                </div>
                <div className="flex-1 relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="meeting-time"
                    type="time"
                    className="pl-10"
                    value={meetingTime}
                    onChange={(e) => setMeetingTime(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Meeting Location</Label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="w-full">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    <SelectValue placeholder="Select meeting location" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {locations.map((loc) => (
                    <SelectItem key={loc.value} value={loc.value}>
                      <div className="flex items-center">{loc.label}</div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select
                value={paymentMethod}
                onValueChange={(value: PaymentMethod) =>
                  setPaymentMethod(value)
                }
              >
                <SelectTrigger className="w-full">
                  <div className="flex items-center">
                    <Banknote className="w-4 h-4 mr-2 text-gray-400" />
                    <SelectValue placeholder="Select payment method" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">
                    <div className="flex items-center">Cash Only</div>
                  </SelectItem>
                  <SelectItem value="emt">
                    <div className="flex items-center">EMT Only</div>
                  </SelectItem>
                  <SelectItem value="both">
                    <div className="flex items-center">Both Cash & EMT</div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                className="bg-indigo-500 hover:bg-indigo-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditMode ? "Updating..." : "Creating..."}
                  </span>
                ) : isEditMode ? (
                  "Update Appointment"
                ) : (
                  "Create Appointment"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
