import React from "react";
import BookingsTable from "./_Component/BookingContainer";

export const metadata = {
  title: "Booking Details - Admin Dashboard",
  description: "Booking Details page of the Admin Dashboard",
};

export default function page() {
  return (
    <div>
      <BookingsTable />
    </div>
  );
}
