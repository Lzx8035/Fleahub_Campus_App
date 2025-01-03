/* eslint-disable @next/next/no-img-element */
import getItemDetail from "@/app/_lib/data_service";
import { notFound } from "next/navigation";
import { Heart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ImageCarousel from "@/app/_components/ImageCarousel";
import { getImageUrls } from "@/app/_lib/utils";
import { formatDistanceToNow } from "date-fns";

export default async function ItemDetailPage({
  params,
}: {
  params: { itemId: string };
}) {
  const { itemId } = await params;
  const item = await getItemDetail(parseInt(itemId));

  if (!item) {
    notFound();
  }

  const images = getImageUrls(item.images);

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-full flex flex-col lg:flex-row gap-8 pt-8">
          <div className="w-full lg:w-1/2 flex-shrink-0">
            {images.length > 0 && <ImageCarousel images={images} />}
          </div>

          <div className="w-full lg:w-1/2 overflow-y-auto">
            <div className="space-y-6 pb-8">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold">{item.title}</h1>
                <p className="text-xl lg:text-2xl font-bold text-[#2a2f33] mt-4">
                  ${item.price}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {item.seller.avatar_url ? (
                  <img
                    src={item.seller.avatar_url}
                    alt={item.seller.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 bg-gray-200 rounded-full" />
                )}
                <div>
                  <p className="font-medium">{item.seller.name}</p>
                  <p className="text-sm text-gray-500">
                    {" "}
                    {formatDistanceToNow(new Date(item.created_at), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>

              <div>
                <h2 className="font-semibold mb-2">Description</h2>
                <p className="text-gray-600">{item.description}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="flex-1">Make Appointment</Button>
                <Button variant="outline" className="flex-1">
                  <Heart className="mr-2 h-4 w-4" />
                  Add to Wishlist
                </Button>
              </div>

              <Card className="p-4">
                <div className="flex items-center gap-2 text-gray-500">
                  <MessageCircle className="h-5 w-5" />
                  <p>Please login to chat with seller</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
