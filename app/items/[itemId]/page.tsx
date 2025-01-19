/* eslint-disable @next/next/no-img-element */
import AppointmentButton from "@/app/_components/AppointmentButton";
import BackButton from "@/app/_components/BackButton";
import ImageCarousel from "@/app/_components/ImageCarousel";
import WishlistButton from "@/app/_components/WishlistButton";
import { getItemDetail, getUserWishlist } from "@/app/_lib/data_service";
import { createClient } from "@/app/_lib/supabase/server";
import { getImageUrls } from "@/app/_lib/utils";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle } from "lucide-react";
import { notFound } from "next/navigation";
import { CircleX } from "lucide-react";

export default async function ItemDetailPage({
  params,
}: {
  params: { itemId: string };
}) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const isLoggedIn = !!session;

  const { itemId } = await params;
  const item = await getItemDetail(parseInt(itemId));
  const wishlistItems = await getUserWishlist();

  if (!item) {
    notFound();
  }

  const images = getImageUrls(item.images);

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="min-h-full flex flex-col sm:flex-row gap-8 pt-8">
          <div className="w-full sm:w-1/2 flex-shrink-0">
            {images.length > 0 && <ImageCarousel images={images} />}
          </div>

          <div className="w-full sm:w-1/2">
            <div className="space-y-6 pb-8">
              <div>
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl sm:text-3xl font-bold">
                    {item.title}
                  </h1>
                  <BackButton>
                    <CircleX className="w-9 h-9 text-slate-400 mr-8" />
                  </BackButton>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-[#2a2f33] mt-4">
                  ${item.price}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {item?.seller?.avatar_url ? (
                  <img
                    src={item.seller.avatar_url}
                    alt={`${item.seller.name}`}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 bg-gray-200 rounded-full" />
                )}
                <div>
                  <p className="font-medium">{item?.seller?.name}</p>
                  <p className="text-sm text-gray-500">
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
                <AppointmentButton
                  itemId={item.id}
                  size="default"
                  isLoggedIn={isLoggedIn}
                />

                <WishlistButton
                  itemId={item.id}
                  initialWishlistItems={wishlistItems || []}
                  size="default"
                  isLoggedIn={isLoggedIn}
                />
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
