import MyAppointmentForm from "@/app/_components/MyAppointmentForm";
import {
  getMyAppointmentDetail,
  getSupabaseUserData,
} from "@/app/_lib/data_service";
import { redirect } from "next/navigation";

// BUG
export default async function MyAppointmentEditPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const userData = await getSupabaseUserData();

  if (!userData) {
    redirect("/login");
  }

  const { id } = await searchParams;

  const initialData = await getMyAppointmentDetail(Number(id), userData.id!);

  console.log(initialData);

  return (
    <div className="max-w-3xl mx-auto mt-12 mb-12">
      <h1 className="text-2xl font-bold mb-8">
        {id ? "Edit Appointment" : "Create New Appointment"}
      </h1>
      <MyAppointmentForm initialData={initialData} userId={userData.id} />
    </div>
  );
}
