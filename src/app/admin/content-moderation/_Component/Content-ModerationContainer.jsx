"use client";
import CustomCountUp from "@/components/CustomCountUp/CustomCountUp";
import React, { useState } from "react";
import ContentTable from "./ContentTable";
import { useGetContentModerationQuery } from "@/redux/api/content-moderationApi";
import SkeletonCard from "@/components/SkeletonCard/SkeletonCard";
import TableSkeleton from "@/components/SkeletonCard/TableSkeleton";

export default function ContentModerationContainer() {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  // get all feed from api
  const { data: feeds, isLoading } = useGetContentModerationQuery({
    limit: 10,
    page: currentPage,
    searchText,
  });

  const userStats = [
    {
      key: "Total Posts",
      title: "Active Posts",
      count: feeds?.data?.activeFeed || 0,
    },
    {
      key: " Restricted Posts",
      title: "Restricted Posts",
      count: feeds?.data?.restrictFeed || 0,
    },
  ];

  if (isLoading) {
    return (
      <div div className="space-y-20">
        <div className="flex gap-10">
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <div>
          <TableSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Stats Section */}
      <section className="grid grid-cols-2 gap-5 md:grid-cols-4 2xl:grid-cols-4">
        {userStats?.map((stat, index) => (
          <div
            key={stat.key}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-[1px] shadow-lg transition-all duration-300 hover:scale-[1.03]"
          >
            {/* inner card */}
            <div className="h-full rounded-2xl bg-white p-5">
              {/* glow circle */}
              <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-purple-300 opacity-20 blur-2xl"></div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </p>

                  <h5 className="mt-2 text-3xl font-bold text-gray-800">
                    {stat.key !== "earning" ? (
                      <CustomCountUp end={stat.count} />
                    ) : (
                      <span>
                        $<CustomCountUp end={stat.count} />
                      </span>
                    )}
                  </h5>
                </div>

                {/* icon */}
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-md">
                  {index === 0 ? "📊" : "🚫"}
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>
      {/*============= Content Moderation Section table================ */}
      <ContentTable
        setSearchText={setSearchText}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        data={feeds}
      />
    </div>
  );
}
