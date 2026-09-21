import React from "react";
import EarningsTable from "../earnings/_components/EarningsTable";
export const metadata = {
  title: "Payment & Transaction - Admin Dashboard",
  description: "Payment & Transaction page of the Admin Dashboard",
};
export default function page() {
  return (
    <div>
      <EarningsTable />
    </div>
  );
}
