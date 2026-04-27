"use client";

import { ConfigProvider, Input, Table, Tag, Avatar } from "antd";
import { Search, Eye } from "lucide-react";
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

  // 🔥 API Data
  const earning = data?.data?.totalEarnings || 0;
  const consult = data?.data?.consultAmount || 0;
  const notifications = data?.data?.notifications || [];

  // 🔥 Table Mapping
  const tableData =
    data?.data?.paymentList?.map((item) => ({
      key: item._id,
      fullData: item, // puri API object
      id: item.id,
      name: `${item.account?.firstName} ${item.account?.lastName}`,
      image: item.account?.photoUrl,
      amount: item.amount,
      consultAmount: item.consultAmount,
      accNumber: item.paymentIntentId,
      date: dayjs(item.createdAt).format("DD MMM YYYY, hh:mm A"),
      status: item.status,
    })) || [];

  // 🔥 Columns
  const columns = [
    {
      title: "User",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Avatar src={record.image} />
          <span>{record.name}</span>
        </div>
      ),
    },
    {
      title: "Transaction ID",
      dataIndex: "id",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (val) => <Tag color="blue">${val}</Tag>,
    },
    {
      title: "Consult Earn",
      dataIndex: "consultAmount",
      render: (val) => <Tag color="green">${val}</Tag>,
    },
    {
      title: "Date",
      dataIndex: "date",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => <Tag color="green">{status.toUpperCase()}</Tag>,
    },
    {
      title: "Action",
      render: (_, record) => (
        <button
          onClick={() => {
            setSelectedTransaction(record.fullData);
            setShowEarningModal(true);
          }}
        >
          <Eye size={20} />
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
      {/* 🔥 TOP SECTION */}
      <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* ✅ Earnings Stats (Left) */}
        <div className="rounded-xl bg-gradient-to-r from-pink-500 to-indigo-600 p-5 text-white shadow">
          <h2 className="text-lg font-medium">Total Earnings</h2>
          <p className="mt-2 text-3xl font-bold">${earning}</p>

          <div className="mt-4 flex justify-between text-sm opacity-90">
            <span>Consult Earn:</span>
            <span>${consult}</span>
          </div>
        </div>

        {/* ✅ Notifications (Right) */}
        <div className="rounded-xl bg-white p-5 shadow">
          <h2 className="mb-3 text-lg font-semibold">Notifications</h2>

          {notifications.length > 0 ? (
            notifications.map((note) => (
              <div
                key={note._id}
                className="mb-2 rounded-lg border p-3 hover:bg-gray-50"
              >
                <p className="font-medium">{note.message}</p>
                <p className="text-sm text-gray-500">{note.description}</p>
                <p className="mt-1 text-xs text-gray-400">
                  {dayjs(note.date).format("DD MMM YYYY")}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No notifications</p>
          )}
        </div>
      </div>

      {/* 🔍 Search */}
      <div className="mb-4 ml-auto h-12 w-full md:w-1/3">
        <Input
          placeholder="Search user..."
          prefix={<Search size={18} />}
          onChange={(e) => setSearchText(e.target.value)}
          className="h-11"
        />
      </div>

      {/* 📊 TABLE */}
      <Table
        loading={isLoading}
        columns={columns}
        dataSource={tableData}
        pagination={{
          total: data?.meta?.total,
          current: currentPage,
          onChange: (page) => setCurrentPage(page),
          showTotal: (total) => `Total ${total} items`,
        }}
        scroll={{ x: true }}
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
