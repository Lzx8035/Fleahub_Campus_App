import MyItemForm from "@/app/_components/MyItemForm";
import { getMyItemDetail, getSupabaseUserData } from "@/app/_lib/data_service";
import { Item } from "@/app/_types";
import { redirect } from "next/navigation";

export default async function MyItemEditPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  let initialData: Item | null = null;

  const userData = await getSupabaseUserData();

  if (!userData) {
    redirect("/login");
  }

  const { id } = await searchParams;

  console.log(id);

  if (id) {
    initialData = await getMyItemDetail(Number(id), userData.id!);
  }

  console.log(initialData);

  return (
    <div className="max-w-3xl mx-auto mt-12 mb-12">
      <h1 className="text-2xl font-bold mb-8">
        {id ? "Edit Item" : "Create New Item"}
      </h1>
      <MyItemForm initialData={initialData || null} />
    </div>
  );
}
