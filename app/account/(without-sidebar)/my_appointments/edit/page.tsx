import MyAppointmentForm from "@/app/_components/MyAppointmentForm";
import {
  getItemDetail,
  getMyAppointmentDetail,
  getSupabaseUserData,
} from "@/app/_lib/data_service";
import { SearchParams } from "@/app/_types";
import { redirect } from "next/navigation";

export default async function MyAppointmentEditPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const userData = await getSupabaseUserData();

  if (!userData) {
    redirect("/login");
  }

  const { id, itemId } = await searchParams;

  if (id) {
    const appointmentData = await getMyAppointmentDetail(
      Number(id),
      userData.id!
    );

    if (!appointmentData) {
      return <div>Appointment not found</div>;
    }

    return (
      <div className="max-w-3xl mx-auto mt-12 mb-12">
        <h1 className="text-2xl font-bold mb-8">Edit Appointment</h1>
        <MyAppointmentForm
          mode="edit"
          appointmentData={appointmentData}
          userId={userData.id}
        />
      </div>
    );
  }

  if (itemId) {
    const itemData = await getItemDetail(Number(itemId), userData.id);

    if (!itemData) {
      return <div>Item not available</div>;
    }

    return (
      <div className="max-w-3xl mx-auto mt-12 mb-12">
        <h1 className="text-2xl font-bold mb-8">Create New Appointment</h1>
        <MyAppointmentForm
          mode="create"
          itemData={itemData}
          userId={userData.id}
        />
      </div>
    );
  }

  return <div>Invalid request</div>;
}
