import React from "react";
import { redirect } from "next/navigation";
import OptionBar from "@/app/_components/OptionBar";
import MyAppointmentCard from "@/app/_components/MyAppointmentCard";
import PaginationBar from "@/app/_components/PaginationBar";
import {
  getMyAppointments,
  getSupabaseUserData,
} from "@/app/_lib/data_service";
import { getClientPagination } from "@/app/_lib/utils";
import { getClientSort } from "@/app/_lib/utils";
import { createAppointmentSortConfig } from "@/app/_lib/utils";
import { MyAppointment, SearchParams } from "@/app/_types";

const sortOptions = [
  { label: "All Appointments", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Completed", value: "completed" },
  { label: "Canceled", value: "canceled" },
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
];

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const userData = await getSupabaseUserData();

  if (!userData) {
    redirect("/login");
  }

  const myAppointments = await getMyAppointments(userData.id!);
  const { sort } = await searchParams;
  const currentSort = sort || "all";

  if (!myAppointments?.length) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No appointments yet</h2>
          <p className="text-gray-500 mb-4">
            You don&apos;t have any appointments at the moment.
          </p>
        </div>
      </div>
    );
  }

  const sortedItems = getClientSort<MyAppointment>({
    items: myAppointments,
    currentSort,
    sortConfig: createAppointmentSortConfig(),
  });

  const { paginatedItems, pageOption, hasMultiplePages } =
    await getClientPagination<MyAppointment>({
      searchParams,
      items: sortedItems,
    });

  return (
    <div className="space-y-6">
      <div className="w-full">
        <OptionBar
          sortOptions={sortOptions}
          currentSort={currentSort}
          page="account/my_appointments"
        />
      </div>

      <div className="space-y-4">
        {paginatedItems.map((appointment) => (
          <MyAppointmentCard
            key={appointment.id}
            appointment={appointment}
            userId={userData.id!}
          />
        ))}
      </div>

      {hasMultiplePages && (
        <div className="mt-8 flex justify-center">
          <PaginationBar
            pageOption={pageOption}
            page="account/my_appointments"
            showEdges={true}
            siblingCount={1}
          />
        </div>
      )}
    </div>
  );
}
