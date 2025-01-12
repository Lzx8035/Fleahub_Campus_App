import React from "react";
import OptionBar from "@/app/_components/OptionBar";
import AppointmentCard from "@/app/_components/AppointmentCard";
import PaginationBar from "@/app/_components/PaginationBar";

export default function AppointmentsPage() {
  const sortOptions = [
    { label: "All Appointments", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
  ];

  const sampleAppointments = [
    {
      id: "APT001",
      title: "Vintage Camera",
      description: "Meeting to check the camera condition and discuss details.",
      image: "/api/placeholder/400/400",
      price: 299.99,
      date: "2024-01-15",
      meetTime: "14:30",
      location: "Campus Center",
      partnerId: "USER123",
      partnerName: "John Doe",
      status: "pending",
    },
    {
      id: "APT002",
      title: "Textbooks Bundle",
      description: "Exchange textbooks for next semester.",
      image: "/api/placeholder/400/400",
      price: 150.0,
      date: "2024-01-16",
      meetTime: "11:00",
      location: "Library Entrance",
      partnerId: "USER456",
      partnerName: "Jane Smith",
      status: "completed",
    },
    {
      id: "APT003",
      title: "Desk Lamp",
      description: "Pickup the study lamp.",
      image: "/api/placeholder/400/400",
      price: 45.0,
      date: "2024-01-17",
      meetTime: "15:45",
      location: "Student Union",
      partnerId: "USER789",
      partnerName: "Mike Johnson",
      status: "cancelled",
    },
  ] as const;

  const pageOption = {
    currentPage: 1,
    totalPages: 2,
    itemsPerPage: 4,
  };

  return (
    <div className="space-y-6">
      <div className="w-full">
        <OptionBar
          sortOptions={sortOptions}
          currentSort="all"
          page="account/my_appointments"
        />
      </div>

      <div className="space-y-4">
        {sampleAppointments.map((appointment) => (
          <AppointmentCard key={appointment.id} appointment={appointment} />
        ))}
      </div>

      {sampleAppointments.length > 4 && (
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
