import { Button } from "@/components/ui/button";
import { getMainCategoriesCount } from "../_lib/data_service";

export default async function CategoriesBar() {
  const itemsCount = await getMainCategoriesCount();

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
              variant={category.main_category === "all" ? "default" : "outline"}
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
