"use client";

import { useState } from "react";
import { Modal, Table, Input, Tag, Avatar, Empty, Spin } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import moment from "moment";
import Image from "next/image";
import { useGetExpertBookingQuery } from "@/redux/api/bookingsApi";

const statusColors = {
  completed: "success",
  pending: "processing",
  cancelled: "error",
  not_responded: "warning",
  confirmed: "blue",
};

export default function ExpertBookingsModal({
  open,
  setOpen,
  expertId,
  expertName,
}) {
  console.log("🚀 ~ ExpertBookingsModal ~ expertName:", expertId);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchText, setSearchText] = useState(""); // debounced value

  const { data, isLoading, isFetching } = useGetExpertBookingQuery(
    {
      id: expertId,
      page,
      limit: 10,
      search: searchText || undefined,
    },
    { skip: !expertId || !open },
  );

  const bookings = data?.data || [];
  const meta = data?.meta || { page: 1, limit: 10, total: 0, totalPage: 1 };

  const handleSearch = (value) => {
    setSearch(value);
    // simple debounce
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      setSearchText(value);
      setPage(1);
    }, 400);
  };

  const columns = [
    {
      title: "Booking ID",
      dataIndex: "id",
      key: "id",
      width: 130,
      render: (id) => (
        <span className="font-mono text-sm font-medium text-gray-700">
          {id}
        </span>
      ),
    },
    {
      title: "Client",
      key: "user",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar
            src={record.user?.photoUrl}
            size={40}
            className="border border-gray-200"
          >
            {record.user?.firstName?.[0]}
          </Avatar>
          <div>
            <p className="font-medium text-gray-900">
              {record.user?.firstName} {record.user?.lastName}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Date & Time",
      key: "datetime",
      render: (_, record) => (
        <div>
          <p className="font-medium text-gray-900">
            {moment(record.displayDate || record.date).format("MMM D, YYYY")}
          </p>
          <p className="text-sm text-gray-500">
            {record.displayStartTime || record.startTime} –{" "}
            {record.displayEndTime || record.endTime}
          </p>
          <p className="text-xs text-gray-400">
            {record.displayTimezone || record.timezone}
          </p>
        </div>
      ),
    },
    {
      title: "Session",
      key: "session",
      render: (_, record) => (
        <div>
          <p className="capitalize text-gray-800">{record.sessionType}</p>
          <p className="text-sm text-gray-500">{record.sessionDuration} min</p>
        </div>
      ),
    },
    {
      title: "Amount",
      key: "amount",
      render: (_, record) => (
        <div>
          <p className="font-semibold text-gray-900">
            £{record.totalPay ?? record.price}
          </p>
          {record.vat > 0 && (
            <p className="text-xs text-gray-500">VAT: £{record.vat}</p>
          )}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={statusColors[status] || "default"}
          className="rounded-full capitalize"
        >
          {status?.replace("_", " ")}
        </Tag>
      ),
    },
    {
      title: "Question",
      dataIndex: "mainQuestion",
      key: "mainQuestion",
      ellipsis: true,
      width: 180,
      render: (text) => (
        <span className="text-sm text-gray-600" title={text}>
          {text || "—"}
        </span>
      ),
    },
  ];

  return (
    <Modal
      open={open}
      onCancel={() => {
        setOpen(false);
        setSearch("");
        setSearchText("");
        setPage(1);
      }}
      footer={null}
      width={1400}
      centered
      destroyOnClose
      title={
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Bookings of {expertName || "Expert"}
          </h2>
          <p className="text-sm font-normal text-gray-500">
            Total {meta.total} booking{meta.total !== 1 ? "s" : ""}
          </p>
        </div>
      }
    >
      {/* Search */}
      <div className="mb-5">
        <Input
          size="large"
          placeholder="Search by client name, booking ID or question..."
          prefix={<SearchOutlined className="text-gray-400" />}
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          allowClear
          className="max-w-md"
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Spin size="large" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="py-16">
          <Empty description="No bookings found" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={bookings}
          rowKey={(record) => record._id || record.id}
          loading={isFetching}
          pagination={{
            current: meta.page,
            pageSize: meta.limit,
            total: meta.total,
            showSizeChanger: false,
            showTotal: (total) => `Total ${total} bookings`,
            onChange: (p) => setPage(p),
          }}
          scroll={{ x: 1000, y: 600 }}
          className="rounded-xl"
        />
      )}
    </Modal>
  );
}
