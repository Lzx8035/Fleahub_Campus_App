"use client";

import { useState } from "react";

import React from "react";
import Link from "next/link";
import Image from "next/image";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Bookmark, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { getImageUrls } from "@/app/_lib/utils";
import { MyItem } from "@/app/_types";
import {
  deleteMyItemAction,
  toggleMyItemReserveAction,
} from "@/app/_lib/action";
import { toast } from "sonner";
import { CustomAlertDialog } from "./CustomAlertDialog";

interface ItemCardProps {
  myItem: MyItem;
}

const statusStyles = {
  available: "bg-teal-500 hover:bg-teal-500",
  sold: "bg-indigo-500 hover:bg-indigo-500",
  reserved: "bg-gray-400 hover:bg-gray-400",
};

export default function MyItemCard({ myItem }: ItemCardProps) {
  const [status, setStatus] = useState(myItem.status);
  const [isPending, setIsPending] = useState(false);

  async function handleReserve(id: number) {
    const previousStatus = status;

    try {
      setIsPending(true);

      const newStatus = status === "reserved" ? "available" : "reserved";
      setStatus(newStatus);

      const success = await toggleMyItemReserveAction(id);

      if (success) {
        toast.success(
          newStatus === "reserved"
            ? "Item has been reserved"
            : "Item is now available"
        );
      } else {
        setStatus(previousStatus);
        toast.error("Failed to update item status");
      }
    } catch (error) {
      console.error("Failed to toggle reserve status:", error);
      setStatus(previousStatus);
      toast.error("Failed to update item status");
    } finally {
      setIsPending(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      const success = await deleteMyItemAction(id);

      if (success) {
        toast.success("Item deleted successfully");
      } else {
        toast.error("Failed to delete item");
      }
    } catch (error) {
      console.error("Failed to delete item:", error);
      toast.error("Failed to delete item");
    }
  }

  return (
    <Card className="flex p-4 gap-4  bg-slate-50">
      {/* Left Section: Image */}
      <div className="w-40 h-40 relative rounded-lg overflow-hidden flex-shrink-0">
        <Image
          src={getImageUrls(myItem.images)[0] || "/api/placeholder/400/400"}
          alt={myItem.title}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Middle Section: Info */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <Link
            href={`/items/${myItem.id}`}
            className="font-semibold text-lg mb-2 hover:text-stone-600 hover:underline"
          >
            {myItem.title}
          </Link>

          <p className="text-2xl font-bold text-slate-900 mb-3">
            ${myItem.price.toLocaleString()}
          </p>
          <Badge
            variant="secondary"
            className={`${statusStyles[myItem.status]} text-white`}
          >
            {myItem.status.charAt(0).toUpperCase() + myItem.status.slice(1)}
          </Badge>
        </div>
        <p className=" text-slate-500 mb-3">
          Created at {formatDistanceToNow(myItem.created_at)} ago
        </p>
      </div>

      {/* Right Section: Actions */}
      <div className="flex flex-col gap-2 justify-start">
        {myItem.status === "sold" || isPending ? (
          <Button variant="outline" size="sm" className="w-28" disabled>
            <Pencil className="w-4 h-4 mr-2" /> Edit
          </Button>
        ) : (
          <Button variant="outline" size="sm" className="w-28" asChild>
            <Link href={`/account/my_items/edit?id=${myItem.id}`}>
              <Pencil className="w-4 h-4 mr-2" /> Edit
            </Link>
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleReserve(myItem.id)}
          className="w-28"
          disabled={myItem.status === "sold" || isPending}
        >
          {isPending ? (
            "Loading..."
          ) : (
            <>
              <Bookmark className="w-4 h-4 mr-2" />
              {status === "reserved" ? "Unreserve" : "Reserve"}
            </>
          )}
        </Button>

        <CustomAlertDialog
          triggerText="Delete"
          title="Delete Item"
          description="Are you sure you want to delete this item? This action cannot be undone."
          confirmText="Delete"
          onConfirm={() => handleDelete(myItem.id)}
          buttonClassName="w-28 text-rose-500 hover:text-rose-600"
          buttonSize="sm"
          variant="outline"
          icon={<Trash2 className="w-4 h-4" />}
        />
      </div>
    </Card>
  );
}
