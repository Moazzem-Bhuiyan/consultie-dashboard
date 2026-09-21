"use client";

import { useState } from "react";
import { useGetReportedContentQuery } from "@/redux/api/reportedContentApi";
import ReportedTable from "./ReportedTable";
import ReportDetailModal from "./ReportDetailModal";

export default function ReportedContainer() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const { data, isLoading, isFetching } = useGetReportedContentQuery({
    limit: 10,
    page: currentPage,
    searchText,
  });

  const handleView = (reportId) => {
    setSelectedReportId(reportId);
    setDetailOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Reported Content</h1>
          <p className="mt-1 text-sm text-gray-500">
            Review user reports and take moderation actions on feeds
          </p>
        </div>

        <ReportedTable
          data={data}
          isLoading={isLoading || isFetching}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          setSearchText={setSearchText}
          onView={handleView}
        />

        <ReportDetailModal
          open={detailOpen}
          onClose={() => {
            setDetailOpen(false);
            setSelectedReportId(null);
          }}
          reportId={selectedReportId}
        />
      </div>
    </div>
  );
}
