"use client";

import React from "react";
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
import { CalendarIcon, Clock, MapPin, Banknote } from "lucide-react";

export default function AppointmentEditPage() {
  const router = useRouter();

  // 示例数据
  const appointmentData = {
    item: {
      id: 1,
      title: "Vintage Camera",
      price: 299.99,
      image: "/api/placeholder/400/400",
      seller: {
        id: "SELLER123",
        name: "John Doe",
      },
    },
    appointment: {
      id: "APT001",
      meeting_time: "2024-01-15T14:30",
      meeting_location: "Campus Center",
      payment_method: "cash",
    },
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 mb-12">
      <h1 className="text-2xl font-bold mb-8">My Appointment</h1>

      {/* 商品信息卡片 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Item Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-6">
            <div className="w-40 h-40 relative rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={appointmentData.item.image}
                alt={appointmentData.item.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">
                {appointmentData.item.title}
              </h3>
              <p className="text-2xl font-bold text-slate-900 mb-4">
                ${appointmentData.item.price.toLocaleString()}
              </p>
              <p className="text-sm text-slate-500">
                Seller: {appointmentData.item.seller.name}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 约会编辑表单 */}
      <Card>
        <CardHeader>
          <CardTitle>Appointment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            {/* 见面时间 */}
            <div className="space-y-2">
              <Label htmlFor="meeting-time">Meeting Time</Label>
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input id="meeting-date" type="date" className="pl-10" />
                </div>
                <div className="flex-1 relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input id="meeting-time" type="time" className="pl-10" />
                </div>
              </div>
            </div>

            {/* 见面地点 */}
            <div className="space-y-2">
              <Label htmlFor="location">Meeting Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="location"
                  className="pl-10"
                  placeholder="Enter meeting location"
                  defaultValue={appointmentData.appointment.meeting_location}
                />
              </div>
            </div>

            {/* 支付方式 */}
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select defaultValue="cash">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">
                    <div className="flex items-center">
                      <Banknote className="w-4 h-4 mr-2" />
                      Cash
                    </div>
                  </SelectItem>
                  <SelectItem value="bank_transfer">
                    <div className="flex items-center">
                      <Banknote className="w-4 h-4 mr-2" />
                      Bank Transfer
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 按钮组 */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                className="bg-indigo-500 hover:bg-indigo-600"
              >
                Save Changes
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
