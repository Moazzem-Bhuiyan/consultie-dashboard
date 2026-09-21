import React from "react";
import PlatformAnalytics from "./_Component/PlatformAnalytics";
import EarningofConsultTable from "./_Component/EarningofConsultTable";
export const metadata = {
  title: "Analytics & Reporting - Admin Dashboard",
  description: "Analytics & Reporting page of the Admin Dashboard",
};
export default function page() {
  return (
    <div className="space-y-6">
      <PlatformAnalytics />
      {/* ======================= Platfrom of earnign table ================== */}
      <EarningofConsultTable />
    </div>
  );
}
