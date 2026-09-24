"use client";

import CustomCountUp from "@/components/CustomCountUp/CustomCountUp";
import EarningSummary from "./Earnings";
import UserStatistics from "./UserStatics";
import BussinessAccDetailsTable from "../../account-details/_components/AccDetailsTable";
import { useState } from "react";
import { useGetDashboardDataQuery } from "@/redux/api/dashboardApi";
import SkeletonCard from "@/components/SkeletonCard/SkeletonCard";
import { DatePicker, Select, Space } from "antd";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const FILTER_OPTIONS = [
  { label: "Last 7 Days", value: "last_7_days" },
  { label: "Last 30 Days", value: "last_30_days" },
  { label: "This Quarter", value: "this_quarter" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
  { label: "Custom Range", value: "custom" },
];

export default function DashboardContainer() {
  // Filter state
  const [filterType, setFilterType] = useState("last_30_days");
  const [year, setYear] = useState(dayjs().year());
  const [month, setMonth] = useState(dayjs().month() + 1);
  const [weekStart, setWeekStart] = useState(null);
  const [dateRange, setDateRange] = useState(null);

  // Build query params based on selected filter
  const queryParams = {
    filterType,
    ...(filterType === "yearly" && { year }),
    ...(filterType === "monthly" && { year, month }),
    ...(filterType === "weekly" && weekStart && { weekStart }),
    ...(filterType === "custom" &&
      dateRange?.[0] &&
      dateRange?.[1] && {
        startDate: dateRange[0].format("YYYY-MM-DD"),
        endDate: dateRange[1].format("YYYY-MM-DD"),
      }),
  };

  const { data, isLoading, isFetching } = useGetDashboardDataQuery(queryParams);

  const dashboard = data?.data || {};

  // Primary stats
  const primaryStats = [
    {
      key: "consults",
      title: "Total Consultees",
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

  // Financial breakdown
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
      {/* Header + Filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-gray-500">
            Get a snapshot of your platform&apos;s performance. Track key
            metrics, user activity, and recent updates to stay informed.
          </p>
        </div>

        {/* ========== Global Filter ========== */}
        <Space wrap size="middle">
          <Select
            value={filterType}
            onChange={(value) => {
              setFilterType(value);
              // reset secondary filters
              setWeekStart(null);
              setDateRange(null);
            }}
            options={FILTER_OPTIONS}
            style={{ width: 160 }}
          />

          {/* Yearly */}
          {filterType === "yearly" && (
            <DatePicker
              picker="year"
              value={dayjs().year(year)}
              onChange={(date) => setYear(date ? date.year() : dayjs().year())}
              allowClear={false}
            />
          )}

          {/* Monthly */}
          {filterType === "monthly" && (
            <DatePicker
              picker="month"
              value={dayjs(`${year}-${month}`, "YYYY-M")}
              onChange={(date) => {
                if (date) {
                  setYear(date.year());
                  setMonth(date.month() + 1);
                }
              }}
              allowClear={false}
            />
          )}

          {/* Weekly */}
          {filterType === "weekly" && (
            <DatePicker
              picker="week"
              onChange={(date) => {
                if (date) {
                  // weekStart should be the Monday of that week
                  setWeekStart(date.startOf("week").format("YYYY-MM-DD"));
                } else {
                  setWeekStart(null);
                }
              }}
              placeholder="Select Week"
            />
          )}

          {/* Custom Range */}
          {filterType === "custom" && (
            <RangePicker
              value={dateRange}
              onChange={(dates) => setDateRange(dates)}
              format="YYYY-MM-DD"
            />
          )}
        </Space>
      </div>

      {/* Loading overlay when refetching */}
      <div className={isFetching ? "pointer-events-none opacity-60" : ""}>
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
        <section className="mt-10">
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
        <section className="mt-10">
          <div className="flex w-full flex-col gap-10 lg:flex-row">
            <UserStatistics earningOverview={dashboard.earningOverview} />
            <EarningSummary
              revenueVsCommission={dashboard.revenueVsCommission}
            />
          </div>
        </section>

        {/* ========== Recent Users / Accounts ========== */}
        <section className="mt-10">
          <BussinessAccDetailsTable limit={5} />
        </section>
      </div>
    </div>
  );
}
