import CustomCountUp from "@/components/CustomCountUp/CustomCountUp";
import React from "react";
import ContentTable from "./ContentTable";

export default function ContentModerationContainer() {
  const userStats = [
    {
      key: "Total Posts",
      title: "Total Posts",
      count: 518,
    },
    {
      key: "Consultants Posted ",
      title: "Consultants Posted",
      count: 118,
    },
  ];
  return (
    <div className="space-y-6">
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
          </div>
        ))}
      </section>
      {/*============= Content Moderation Section table================ */}
      <ContentTable />
    </div>
  );
}
