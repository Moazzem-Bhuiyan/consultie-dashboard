"use client";
import React, { useState } from "react";
import {
  Table,
  Input,
  Select,
  DatePicker,
  Button,
  Space,
  Tag,
  Avatar,
  Card,
} from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import {
  BOOKING_STATUS,
  useGetAllBookingsQuery,
} from "@/redux/api/bookingsApi";
import BookingDetailsModal from "./BookingDetailsModal";

const { RangePicker } = DatePicker;
const { Option } = Select;

const statusColor = {
  completed: "green",
  cancelled: "red",
  pending: "orange",
  confirmed: "blue",
  running: "cyan",
  declined: "volcano",
  not_responded: "default",
};

const BookingsTable = () => {
  // Filters
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("");
  const [dateRange, setDateRange] = useState([]);

  // Modal
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const startDate = dateRange?.[0]
    ? dayjs(dateRange[0]).format("YYYY-MM-DD")
    : "";
  const endDate = dateRange?.[1]
    ? dayjs(dateRange[1]).format("YYYY-MM-DD")
    : "";

  const { data, isLoading, isFetching, refetch } = useGetAllBookingsQuery({
    page,
    limit,
    searchTerm,
    status,
    startDate,
    endDate,
  });

  const bookings = data?.data?.bookings || [];
  const meta = data?.meta || { total: 0, totalPage: 1 };
  const stats = data?.data?.stats;

  const handleView = (record) => {
    setSelectedBookingId(record._id);
    setModalOpen(true);
  };

  const handleReset = () => {
    setSearchTerm("");
    setStatus("");
    setDateRange([]);
    setPage(1);
  };

  const columns = [
    {
      title: "Booking ID",
      dataIndex: "id",
      key: "id",
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Client",
      key: "user",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Avatar size={32} src={record.user?.photoUrl}>
            {record.user?.firstName?.[0]}
          </Avatar>
          <span>
            {record.user?.firstName} {record.user?.lastName}
          </span>
        </div>
      ),
    },
    {
      title: "Expert",
      key: "consult",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Avatar size={32} src={record.consult?.photoUrl}>
            {record.consult?.firstName?.[0]}
          </Avatar>
          <span>
            {record.consult?.firstName} {record.consult?.lastName}
          </span>
        </div>
      ),
    },
    {
      title: "Date & Time",
      key: "datetime",
      render: (_, record) => (
        <div>
          <div>{record.displayDate}</div>
          <div className="text-xs text-gray-500">
            {record.displayStartTime} - {record.displayEndTime}
          </div>
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "sessionType",
      key: "sessionType",
      render: (text) => (
        <Tag color={text === "deep_drive" ? "purple" : "blue"}>
          {text === "deep_drive" ? "Deep Drive" : "Introduction"}
        </Tag>
      ),
    },
    {
      title: "Duration",
      dataIndex: "sessionDuration",
      key: "sessionDuration",
      render: (val) => `${val} min`,
    },
    {
      title: "Amount",
      dataIndex: "totalPay",
      key: "totalPay",
      render: (val) => `$${val}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={statusColor[status] || "default"}>
          {status?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button type="link" onClick={() => handleView(record)}>
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6">
      {/* Stats Cards */}
      {stats && (
        <div className="mb-6 grid grid-cols-4 gap-4">
          <Card>
            <p className="text-sm text-gray-500">Total Bookings</p>
            <p className="text-2xl font-bold">{stats.totalBooking}</p>
          </Card>
          <Card>
            <p className="text-sm text-gray-500">Completed</p>
            <p className="text-2xl font-bold text-green-600">
              {stats.completedBooking}
            </p>
          </Card>
          <Card>
            <p className="text-sm text-gray-500">Cancelled</p>
            <p className="text-2xl font-bold text-red-600">
              {stats.cancelledBooking}
            </p>
          </Card>
          <Card>
            <p className="text-sm text-gray-500">This Month</p>
            <p className="text-2xl font-bold">{stats.thisMonthBooking}</p>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Search by Booking ID / Name..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            allowClear
            style={{ width: 260 }}
          />

          <Select
            placeholder="Status"
            value={status || undefined}
            onChange={(val) => {
              setStatus(val || "");
              setPage(1);
            }}
            allowClear
            style={{ width: 160 }}
          >
            {Object.values(BOOKING_STATUS).map((s) => (
              <Option key={s} value={s}>
                {s.replace("_", " ").toUpperCase()}
              </Option>
            ))}
          </Select>

          <RangePicker
            value={dateRange}
            onChange={(dates) => {
              setDateRange(dates || []);
              setPage(1);
            }}
            format="YYYY-MM-DD"
          />

          <Button icon={<ReloadOutlined />} onClick={handleReset}>
            Reset
          </Button>

          <Button onClick={() => refetch()} loading={isFetching}>
            Refresh
          </Button>
        </div>
      </Card>

      {/* Table */}
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={bookings}
        loading={isLoading || isFetching}
        pagination={{
          current: page,
          pageSize: limit,
          total: meta.total,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} bookings`,
          onChange: (p, pageSize) => {
            setPage(p);
            setLimit(pageSize);
          },
        }}
      />

      {/* Modal */}
      <BookingDetailsModal
        bookingId={selectedBookingId}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedBookingId(null);
        }}
      />
    </div>
  );
};

export default BookingsTable;
