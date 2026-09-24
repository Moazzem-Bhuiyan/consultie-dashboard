"use client";

import {
  Button,
  ConfigProvider,
  Input,
  Table,
  Tag,
  Select,
  DatePicker,
  Tooltip,
  Modal,
  Input as AntInput,
} from "antd";
import { Eye, Search } from "lucide-react";
import { useState } from "react";
import dayjs from "dayjs";
// adjust path if needed
import toast from "react-hot-toast";
import ShowWithDrawRequestModal from "./ShowWithDrawRequestModal";
import { FaPause, FaPlay } from "react-icons/fa6";
import {
  useGetWithdrawalRequestsQuery,
  useManualHoldWithdrawMutation,
  useManualReleaseWithdrawMutation,
} from "@/redux/api/withdrawApi";

const { RangePicker } = DatePicker;
const { TextArea } = AntInput;

export default function WithdrawalRequestTables() {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [status, setStatus] = useState(undefined);
  const [dateRange, setDateRange] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Reason modal state
  const [reasonModal, setReasonModal] = useState({
    open: false,
    type: null, // "hold" | "release"
    id: null,
  });
  const [reason, setReason] = useState("");

  const startDate = dateRange?.[0]?.format("YYYY-MM-DD");
  const endDate = dateRange?.[1]?.format("YYYY-MM-DD");

  const { data: withdrawalData, isLoading } = useGetWithdrawalRequestsQuery({
    searchTerm: searchText || undefined,
    status: status || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    page: currentPage,
    limit: 10,
  });

  const [manualHold, { isLoading: holdLoading }] =
    useManualHoldWithdrawMutation();
  const [manualRelease, { isLoading: releaseLoading }] =
    useManualReleaseWithdrawMutation();

  // ===== Summary =====
  const summary = withdrawalData?.data?.summary || {};
  const totalPendingAmount = summary.totalPendingAmount || 0;
  const awaitingDecisionCount = summary.awaitingDecisionCount || 0;
  const awaitingDecisionAmount = summary.awaitingDecisionAmount || 0;
  const totalPaidAmount = summary.totalPaidAmount || 0;

  // ===== Table Data =====
  const tableData =
    withdrawalData?.data?.withdrawList?.map((item) => ({
      key: item._id,
      id: item._id,
      withdrawId: item.id || item._id,
      name: `${item.user?.firstName || ""} ${item.user?.lastName || ""}`.trim(),
      email: item.user?.email,
      photo: item.user?.photoUrl,
      bookingId: item.booking?.id || item.booking?._id || "-",
      sessionType: item.booking?.sessionType || "-",
      amount: item.amount,
      status: item.status,
      requestedDate: dayjs(item.createdAt).format("DD MMM YYYY, hh:mm A"),
      proceedAt: item.proceedAt
        ? dayjs(item.proceedAt).format("DD MMM YYYY, hh:mm A")
        : "-",
    })) || [];

  // ===== Handle Hold / Release =====
  const openReasonModal = (type, id) => {
    setReason("");
    setReasonModal({ open: true, type, id });
  };

  const handleConfirmReason = async () => {
    if (!reason.trim()) {
      toast.error("Please enter a reason");
      return;
    }

    try {
      if (reasonModal.type === "hold") {
        const res = await manualHold({
          id: reasonModal.id,
          reason: reason.trim(),
        }).unwrap();
        if (res.success) {
          toast.success("Withdrawal held successfully");
        }
      } else {
        const res = await manualRelease({
          id: reasonModal.id,
          reason: reason.trim(),
        }).unwrap();
        if (res.success) {
          toast.success("Withdrawal released successfully");
        }
      }
      setReasonModal({ open: false, type: null, id: null });
      setReason("");
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong!");
    }
  };

  // ===== Columns =====
  const columns = [
    {
      title: "Withdraw ID",
      dataIndex: "withdrawId",
      width: 140,
      render: (val) => <span className="font-medium text-gray-700">{val}</span>,
    },
    {
      title: "Expert",
      width: 180,
      render: (_, record) => (
        <div>
          <p className="font-medium text-gray-900">{record.name}</p>
          <p className="text-xs text-gray-500">{record.email}</p>
        </div>
      ),
    },
    {
      title: "Booking ID",
      dataIndex: "bookingId",
      width: 130,
    },
    {
      title: "Session",
      dataIndex: "sessionType",
      width: 120,
      render: (val) => (
        <span className="capitalize">{val?.replace("_", " ")}</span>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      width: 110,
      render: (value) => (
        <Tag color="blue" className="!text-base font-semibold">
          £{value}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 120,
      render: (status) => {
        const colorMap = {
          completed: "green",
          proceed: "orange",
          hold: "red",
        };
        return (
          <Tag color={colorMap[status] || "default"} className="capitalize">
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Requested",
      dataIndex: "requestedDate",
      width: 170,
    },
    {
      title: "Proceed At",
      dataIndex: "proceedAt",
      width: 170,
    },
    {
      title: "Action",
      fixed: "right",
      width: 140,
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Tooltip title="Show Details">
            <span
              className="cursor-pointer text-gray-600 hover:text-blue-600"
              onClick={() => {
                setSelectedId(record.id);
                setShowDetailsModal(true);
              }}
            >
              <Eye size={20} />
            </span>
          </Tooltip>

          {record.status !== "completed" && (
            <>
              {record.status === "hold" ? (
                <Tooltip title="Release (Manual)">
                  <span
                    className="cursor-pointer text-green-600 hover:text-green-700"
                    onClick={() => openReasonModal("release", record.id)}
                  >
                    <FaPlay size={18} />
                  </span>
                </Tooltip>
              ) : (
                <Tooltip title="Hold (Manual)">
                  <span
                    className="cursor-pointer text-orange-600 hover:text-orange-700"
                    onClick={() => openReasonModal("hold", record.id)}
                  >
                    <FaPause size={18} />
                  </span>
                </Tooltip>
              )}
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1B70A6",
          colorInfo: "#1B70A6",
        },
      }}
    >
      {/* ========== SUMMARY CARDS ========== */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-5 shadow-sm">
          <p className="text-sm font-medium text-blue-600">Total Pending</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            £{totalPendingAmount}
          </p>
        </div>
        <div className="rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50 p-5 shadow-sm">
          <p className="text-sm font-medium text-orange-600">
            Awaiting Decision
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {awaitingDecisionCount}
          </p>
          <p className="text-xs text-gray-500">£{awaitingDecisionAmount}</p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 p-5 shadow-sm">
          <p className="text-sm font-medium text-emerald-600">Total Paid Out</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            £{totalPaidAmount}
          </p>
        </div>
        {/* <div className="flex items-end">
          <Button
            onClick={() => setUpdateHoldPeriod(true)}
            type="primary"
            className="!h-11 w-full"
          >
            Update general settings
          </Button>
        </div> */}
      </div>

      {/* ========== FILTERS ========== */}
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <Select
            placeholder="Filter by Status"
            allowClear
            style={{ width: 160, height: 44 }}
            value={status}
            onChange={(val) => {
              setStatus(val);
              setCurrentPage(1);
            }}
            options={[
              { value: "proceed", label: "Proceed" },
              { value: "hold", label: "Hold" },
              { value: "completed", label: "Completed" },
            ]}
          />

          <RangePicker
            className="h-11"
            format="YYYY-MM-DD"
            placeholder={["Start Date", "End Date"]}
            value={dateRange}
            onChange={(dates) => {
              setDateRange(dates);
              setCurrentPage(1);
            }}
            allowClear
          />
        </div>

        <div className="w-full lg:w-80">
          <Input
            placeholder="Search by name, withdraw ID or booking ID..."
            prefix={<Search className="mr-2 text-gray-400" size={18} />}
            className="h-11 !rounded-lg"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setCurrentPage(1);
            }}
            allowClear
          />
        </div>
      </div>

      {/* ========== TABLE ========== */}
      <Table
        loading={isLoading}
        columns={columns}
        dataSource={tableData}
        scroll={{ x: 1200 }}
        pagination={{
          total: withdrawalData?.meta?.total || 0,
          current: currentPage,
          pageSize: 10,
          onChange: (page) => setCurrentPage(page),
          showTotal: (total) => `Total ${total} requests`,
          showSizeChanger: false,
        }}
        className="rounded-xl"
      />

      {/* Details Modal */}
      <ShowWithDrawRequestModal
        open={showDetailsModal}
        setOpen={setShowDetailsModal}
        id={selectedId}
      />

      {/* Update Hold Period Modal */}
      {/* <UpdateHoldPeriodModal
        open={updateHoldPeriod}
        setOpen={setUpdateHoldPeriod}
      /> */}

      {/* Reason Modal for Hold / Release */}
      <Modal
        title={
          reasonModal.type === "hold"
            ? "Manual Hold Withdrawal"
            : "Manual Release Withdrawal"
        }
        open={reasonModal.open}
        onCancel={() => {
          setReasonModal({ open: false, type: null, id: null });
          setReason("");
        }}
        onOk={handleConfirmReason}
        confirmLoading={holdLoading || releaseLoading}
        okText={reasonModal.type === "hold" ? "Hold" : "Release"}
        okButtonProps={{
          danger: reasonModal.type === "hold",
        }}
        centered
      >
        <p className="mb-2 text-sm text-gray-600">
          Please provide a reason for this action:
        </p>
        <TextArea
          rows={4}
          placeholder="Enter reason..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </Modal>
    </ConfigProvider>
  );
}
