"use client";

import { ConfigProvider, Input, Table, Tag, Avatar } from "antd";
import { Search, Eye, UserX } from "lucide-react";
import { useState } from "react";
import dayjs from "dayjs";
import EarningModal from "./EarningModal";
import { useGetTransactionsQuery } from "@/redux/api/transactionApi";

export default function EarningsTable() {
  const [showEarningModal, setShowEarningModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useGetTransactionsQuery({
    limit: 10,
    page: currentPage,
    searchText,
  });

  // ===== Stats from API =====
  const grossBookingValue = data?.data?.grossBookingValue || 0;
  const platformTotalDeduction = data?.data?.platformTotalDeduction || 0;
  const expertPayout = data?.data?.expertPayout || 0;

  // ===== Table Data Mapping =====
  const tableData =
    data?.data?.paymentList?.map((item) => ({
      key: item._id,
      fullData: item,
      id: item.id,
      name: `${item.account?.firstName || ""} ${item.account?.lastName || ""}`.trim(),
      image: item.account?.photoUrl,
      amount: item.amount || item.consultationFee || 0,
      expertPayout: item.expertPayout || item.consultAmount || 0,
      platformFee: item.platformTotalDeduction || item.platformTotal || 0,
      sessionType: item.booking?.sessionType || "-",
      duration: item.booking?.sessionDuration
        ? `${item.booking.sessionDuration} min`
        : "-",
      date: dayjs(item.createdAt).format("DD MMM YYYY, hh:mm A"),
      bookingTime: item.booking?.localStartTime
        ? `${item.booking.localDate} • ${item.booking.localStartTime} - ${item.booking.localEndTime}`
        : "-",
      status: item.status,
      settlementStatus: item.settlementStatus,
    })) || [];

  // ===== Columns =====
  const columns = [
    {
      title: "User",
      width: 200,
      render: (_, record) => (
        <div className="flex items-center gap-3">
          {record.image ? (
            <Avatar src={record.image} size={44} />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100">
              <UserX size={20} className="text-gray-400" />
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate font-medium text-gray-900">{record.name}</p>
            <p className="truncate text-xs text-gray-400">{record.id}</p>
          </div>
        </div>
      ),
    },
    {
      title: "Session",
      width: 140,
      render: (_, record) => (
        <div>
          <p className="font-medium capitalize text-gray-800">
            {record.sessionType.replace("_", " ")}
          </p>
          <p className="text-xs text-gray-500">{record.duration}</p>
        </div>
      ),
    },
    {
      title: "Booking Time",
      dataIndex: "bookingTime",
      width: 180,
      render: (val) => <span className="text-sm text-gray-600">{val}</span>,
    },
    {
      title: "Gross Amount",
      dataIndex: "amount",
      width: 120,
      render: (val) => (
        <Tag color="blue" className="rounded-full px-3">
          £{val}
        </Tag>
      ),
    },
    {
      title: "Expert Payout",
      dataIndex: "expertPayout",
      width: 120,
      render: (val) => (
        <Tag color="green" className="rounded-full px-3">
          £{val}
        </Tag>
      ),
    },
    {
      title: "Platform Fee",
      dataIndex: "platformFee",
      width: 110,
      render: (val) => (
        <span className="text-sm font-medium text-orange-600">£{val}</span>
      ),
    },
    {
      title: "Settlement",
      dataIndex: "settlementStatus",
      width: 140,
      render: (status) => {
        const colorMap = {
          withdrawn: "success",
          pending_session: "warning",
          pending: "default",
        };
        return (
          <Tag
            color={colorMap[status] || "default"}
            className="rounded-full capitalize"
          >
            {status?.replace("_", " ")}
          </Tag>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 100,
      render: (status) => (
        <Tag color="green" className="rounded-full uppercase">
          {status}
        </Tag>
      ),
    },
    {
      title: "Created",
      dataIndex: "date",
      width: 160,
      render: (val) => <span className="text-sm text-gray-500">{val}</span>,
    },
    {
      title: "Action",
      fixed: "right",
      width: 80,
      render: (_, record) => (
        <button
          onClick={() => {
            setSelectedTransaction(record.fullData);
            setShowEarningModal(true);
          }}
          className="rounded-lg p-2 text-gray-500 transition hover:bg-blue-50 hover:text-blue-600"
        >
          <Eye size={18} />
        </button>
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1B70A6",
        },
      }}
    >
      {/* ========== STATS CARDS ========== */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Gross Booking Value */}
        <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-5 shadow-sm">
          <p className="text-sm font-medium text-blue-600">
            Gross Booking Value
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            £ {grossBookingValue}
          </p>
          <p className="mt-1 text-xs text-gray-500">Total session value</p>
        </div>

        {/* Platform Deduction */}
        <div className="rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50 p-5 shadow-sm">
          <p className="text-sm font-medium text-orange-600">
            Platform Deduction
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            £ {platformTotalDeduction}
          </p>
          <p className="mt-1 text-xs text-gray-500">Commission + VAT</p>
        </div>

        {/* Expert Payout */}
        <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 p-5 shadow-sm">
          <p className="text-sm font-medium text-emerald-600">Expert Payout</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            £ {expertPayout}
          </p>
          <p className="mt-1 text-xs text-gray-500">Net amount for experts</p>
        </div>
      </div>

      {/* ========== SEARCH ========== */}
      <div className="mb-4 ml-auto w-full md:w-80">
        <Input
          placeholder="Search by user name..."
          prefix={<Search size={16} className="text-gray-400" />}
          onChange={(e) => {
            setSearchText(e.target.value);
            setCurrentPage(1);
          }}
          allowClear
          className="h-11 rounded-xl"
        />
      </div>

      {/* ========== TABLE ========== */}
      <Table
        loading={isLoading}
        columns={columns}
        dataSource={tableData}
        pagination={{
          total: data?.meta?.total || 0,
          current: currentPage,
          pageSize: 10,
          onChange: (page) => setCurrentPage(page),
          showTotal: (total) => `Total ${total} transactions`,
          showSizeChanger: false,
        }}
        scroll={{ x: 1200 }}
        className="rounded-xl"
        rowClassName="hover:bg-gray-50"
      />

      {/* Modal */}
      <EarningModal
        open={showEarningModal}
        setOpen={setShowEarningModal}
        transaction={selectedTransaction}
      />
    </ConfigProvider>
  );
}
