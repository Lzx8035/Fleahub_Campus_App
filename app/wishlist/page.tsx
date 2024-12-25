import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export const metadata = {
  title: "Wishlist",
};

export default function ItemsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Items Grid */}
      <div className="grid grid-cols-1 gap-4 mb-8">
        {[1, 2, 3, 4].map((item) => (
          <Card key={item} className="flex flex-row w-full">
            {/* 左侧图片 */}
            <div className="w-48 p-4">
              <div className="aspect-square bg-gray-100 rounded-md" />
            </div>

            {/* 右侧内容 */}
            <div className="flex-1 p-4 flex flex-col justify-between">
              <div>
                <CardTitle className="text-lg mb-2">Item Name</CardTitle>
                <p className="text-2xl font-bold text-[#2a2f33]">$99</p>
                <p className="text-gray-500 text-sm mt-2">Posted 2 days ago</p>
              </div>

              <div className="flex gap-4 mt-4">
                <Button variant="outline">Details</Button>
                <Button>Delete from Wishlist</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
