"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";

import { CategoryCount } from "../_types";

interface CategoriesBarProps {
  currentCategory: string;
  itemsCount: CategoryCount[];
}

export default function CategoriesBar({
  currentCategory,
  itemsCount,
}: CategoriesBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCategoryChange = (newCategory: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", newCategory);
    params.set("page", "1");
    router.push(`/items?${params.toString()}`);
  };

  if (!itemsCount) {
    return <div>Failed to load items</div>;
  }

  const totalNum = itemsCount.reduce((sum, cat) => sum + Number(cat.count), 0);
  const itemsCountAll = [
    { main_category: "all", count: totalNum },
    ...itemsCount,
  ];

  return (
    <div className="top-16 bg-white border-b z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
          {itemsCountAll.map((category) => (
            <Button
              key={category.main_category}
              variant={
                currentCategory === category.main_category
                  ? "default"
                  : "outline"
              }
              onClick={() => handleCategoryChange(category.main_category)}
              className="shrink-0"
            >
              <span>{category.main_category}</span>
              <span className="ml-2 text-xs bg-gray-400 px-2 py-0.5 rounded-full">
                {category.count}
              </span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
