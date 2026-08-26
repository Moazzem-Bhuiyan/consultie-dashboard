"use client";

import CustomCountUp from "@/components/CustomCountUp/CustomCountUp";
import EarningSummary from "./Earnings";
import UserStatistics from "./UserStatics";
import BussinessAccDetailsTable from "../../account-details/_components/AccDetailsTable";
import { useState } from "react";
import { useGetDashboardDataQuery } from "@/redux/api/dashboardApi";
import SkeletonCard from "@/components/SkeletonCard/SkeletonCard";

export default function DashboardContainer() {
  const [earning_year, setEarningYear] = useState(null);
  const [revenue_year, setRevenueYear] = useState(null);

  const { data, isLoading } = useGetDashboardDataQuery({
    revenue_year,
    earning_year,
  });

  const dashboard = data?.data || {};

  // Primary stats (top row)
  const primaryStats = [
    {
      key: "consults",
      title: "Total Consultants",
      count: dashboard.totalConsultCount || 0,
      isMoney: false,
    },
    {
      key: "experts",
      title: "Total Experts",
      count: dashboard.totalExpertCount || 0,
      isMoney: false,
    },
    {
      key: "earnings",
      title: "Total Earnings",
      count: dashboard.totalEarnings || 0,
      isMoney: true,
    },
    {
      key: "gross",
      title: "Gross Booking Value",
      count: dashboard.grossBookingValue || 0,
      isMoney: true,
    },
  ];

  // Financial breakdown stats
  const financialStats = [
    {
      key: "commission",
      title: "Platform Commission",
      count: dashboard.platformCommission || dashboard.totalCommission || 0,
      isMoney: true,
    },
    {
      key: "vat",
      title: "Platform VAT",
      count: dashboard.platformVat || 0,
      isMoney: true,
    },
    {
      key: "deduction",
      title: "Total Deduction",
      count: dashboard.platformTotalDeduction || 0,
      isMoney: true,
    },
    {
      key: "payout",
      title: "Expert Payout",
      count: dashboard.expertPayout || 0,
      isMoney: true,
    },
    {
      key: "fee",
      title: "Platform Fee",
      count: dashboard.platformFeePercentage || 0,
      isMoney: false,
      suffix: "%",
    },
  ];

  const handleEarningYearChange = (year) => {
    setEarningYear(year);
  };

  const handleRevenueYearChange = (year) => {
    setRevenueYear(year);
  };

  if (isLoading) {
    return (
      <div className="space-y-20">
        <div className="flex gap-10">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <div className="flex gap-10">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <div className="flex justify-between gap-10">
          <SkeletonCard width={600} rows={10} />
          <SkeletonCard width={600} rows={10} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-gray-500">
          Get a snapshot of your platform&apos;s performance. Track key metrics,
          user activity, and recent updates to stay informed.
        </p>
      </div>

      {/* ========== Primary Stats ========== */}
      <section className="grid grid-cols-2 gap-5 md:grid-cols-4">
        {primaryStats.map((stat) => (
          <div
            key={stat.key}
            className="rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <p className="font-dmSans text-sm font-medium text-gray-500">
              {stat.title}
            </p>
            <h5 className="mt-2 text-3xl font-semibold text-gray-900">
              {stat.isMoney ? (
                <span>
                  £ <CustomCountUp end={stat.count} />
                </span>
              ) : (
                <CustomCountUp end={stat.count} />
              )}
            </h5>
          </div>
        ))}
      </section>

      {/* ========== Financial Breakdown ========== */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          Financial Breakdown
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {financialStats.map((stat) => (
            <div
              key={stat.key}
              className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                {stat.title}
              </p>
              <h5 className="mt-2 text-2xl font-semibold text-gray-900">
                {stat.isMoney ? (
                  <span>
                    £ <CustomCountUp end={stat.count} />
                  </span>
                ) : (
                  <span>
                    <CustomCountUp end={stat.count} />
                    {stat.suffix || ""}
                  </span>
                )}
              </h5>
            </div>
          ))}
        </div>
      </section>

      {/* ========== Charts ========== */}
      <section>
        <div className="flex w-full flex-col gap-10 lg:flex-row">
          <UserStatistics
            earningOverview={dashboard.earningOverview}
            onYearChange={handleEarningYearChange}
          />
          <EarningSummary
            revenueVsCommission={dashboard.revenueVsCommission}
            onYearChange={handleRevenueYearChange}
          />
        </div>
      </section>

      {/* ========== Recent Users / Accounts ========== */}
      <section>
        <BussinessAccDetailsTable limit={5} />
      </section>
    </div>
  );
}
