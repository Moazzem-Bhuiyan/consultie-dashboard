"use client";
import CustomCountUp from "@/components/CustomCountUp/CustomCountUp";
import EarningSummary from "./Earnings";
import UserStatistics from "./UserStatics";
import { QuickActions } from "./quick-action";
import { RecentNotifications } from "./recent-notification";
import BussinessAccDetailsTable from "../../account-details/_components/AccDetailsTable";

// Dummy Data
const userStats = [
  {
    key: "users",
    title: "Total Users",
    count: 518,
  },
  {
    key: "Total Experts",
    title: "Total Experts",
    count: 118,
  },
  {
    key: "earning",
    title: "Total Revenue",
    count: 218,
  },
  {
    key: "earning",
    title: "Commission",
    count: 1500,
  },
];

export default function DashboardContainer() {
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
                      $<CustomCountUp end={stat.count} />
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
          <UserStatistics />
          <EarningSummary />
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
