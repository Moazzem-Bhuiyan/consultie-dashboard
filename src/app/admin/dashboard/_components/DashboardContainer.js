"use client";
import CustomCountUp from "@/components/CustomCountUp/CustomCountUp";
import EarningSummary from "./Earnings";
import UserStatistics from "./UserStatics";
import { QuickActions } from "./quick-action";
import { RecentNotifications } from "./recent-notification";
import BussinessAccDetailsTable from "../../account-details/_components/AccDetailsTable";
import { useState } from "react";
import { useGetDashboardDataQuery } from "@/redux/api/dashboardApi";
import SkeletonCard from "@/components/SkeletonCard/SkeletonCard";

export default function DashboardContainer() {
  const [earning_year, setEarningYear] = useState(null);
  const [revenue_year, setRevenueYear] = useState(null);

  // get dashbaord data from api

  const { data, isLoading } = useGetDashboardDataQuery({
    revenue_year,
    earning_year,
  });

  const userStats = [
    {
      key: "users",
      title: "Total Consult ",
      count: data?.data?.totalConsultCount || 0,
    },
    {
      key: "Total Experts",
      title: "Total Experts",
      count: data?.data?.totalExpertCount || 0,
    },
    {
      key: "earning",
      title: "Total Earnings",
      count: data?.data?.totalEarnings || 0,
    },
    {
      key: "earning",
      title: "Commission",
      count: data?.data?.totalCommission || 0,
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
      <div div className="space-y-20">
        <div className="flex gap-10">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>

        <div className="justyfy-between flex gap-10">
          <SkeletonCard width={600} rows={10} />
          <SkeletonCard width={600} rows={10} />
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-20">
      <h1>
        Get a snapshot of your platform&nbsp;s performance. Track key metrics,
        user activity, and recent updates to stay informed
      </h1>
      {/* User Stats Section */}
      <section className="grid grid-cols-2 gap-5 md:grid-cols-4 2xl:grid-cols-4">
        {userStats?.map((stat) => (
          <div
            key={stat.key}
            className="gap-x-4 rounded-2xl bg-[#FFFFFF] p-5 text-black shadow-sm"
          >
            <div className="flex justify-between gap-4">
              <div>
                <p className="font-dmSans text-lg font-medium">{stat.title}</p>
                <h5 className="mt-0.5 text-3xl font-semibold text-black">
                  {stat.key !== "earning" ? (
                    <CustomCountUp end={stat.count} />
                  ) : (
                    <span>
                      $ <CustomCountUp end={stat.count} />
                    </span>
                  )}
                </h5>
              </div>
            </div>

            {/* <div className="flex items-center gap-5">
              <h1 className=" text-[#4BB54B] text-xl font-bold flex items-center gap-2 bg-[#4BB54B1A] p-1 mt-2 rounded-lg">
                <span><PiArrowsOutSimple /></span>
                <span>4%</span>
              </h1>
              <h1 className=" text-xl">From the last month</h1>
            </div> */}
          </div>
        ))}
      </section>

      {/* Charts */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-6">
        <div className="col-span-4 space-y-5">
          <UserStatistics
            earningOverview={data?.data?.earningOverview}
            onYearChange={handleEarningYearChange}
          />
          <EarningSummary
            revenueVsCommission={data?.data?.revenueVsCommission}
            onYearChange={handleRevenueYearChange}
          />
        </div>
        <div className="col-span-2 w-full space-y-5">
          <QuickActions />
          <RecentNotifications />
        </div>
      </section>

      {/* Recent Users Table */}
      <section>
        {/* <RecentUserTable />
         */}
        <BussinessAccDetailsTable />
      </section>
    </div>
  );
}
