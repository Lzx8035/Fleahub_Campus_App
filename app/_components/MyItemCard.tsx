"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Pencil, Bookmark, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getImageUrls } from "../_lib/utils";
import { MyItem } from "../_types";
import { formatDistanceToNow } from "date-fns";

interface ItemCardProps {
  myItem: MyItem;
}

const statusStyles = {
  available: "bg-teal-500 hover:bg-teal-500",
  sold: "bg-indigo-500 hover:bg-indigo-500",
  reserved: "bg-gray-400 hover:bg-gray-400",
};

export default function MyItemCard({ myItem }: ItemCardProps) {
  function handleReserve(id: number) {
    console.log(id);
  }
  function handleDelete(id: number) {
    console.log(id);
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
          <h3 className="font-semibold text-lg mb-2">{myItem.title}</h3>
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
        <Button variant="outline" size="sm" className="w-24" asChild>
          <Link href={`/account/my_items/edit?id=${myItem.id}`}>
            <Pencil className="w-4 h-4 mr-2" /> Edit
          </Link>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleReserve(myItem.id)}
          className="w-24"
          disabled={myItem.status === "sold"}
        >
          <Bookmark className="w-4 h-4 mr-2" />
          Reserve
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleDelete(myItem.id)}
          className="w-24 text-rose-500 hover:text-rose-600"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </div>
    </Card>
  );
}
