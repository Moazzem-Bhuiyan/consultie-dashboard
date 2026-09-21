"use client";

import { useState } from "react";
import {
  Table,
  Tag,
  Input,
  Image,
  Dropdown,
  Modal,
  Input as AntInput,
} from "antd";
import { Eye, Search, MoreVertical } from "lucide-react";
import moment from "moment";
import { useUpdateContentModerationMutation } from "@/redux/api/content-moderationApi";
import toast from "react-hot-toast";

const { TextArea } = AntInput;

const MODERATION_ACTIONS = [
  { key: "restrict", label: "Restrict", color: "red" },
  { key: "activate", label: "Activate", color: "green" },
  { key: "remove", label: "Remove", color: "red" },
  { key: "warn_user", label: "Warn User", color: "orange" },
  { key: "suspend_user", label: "Suspend User", color: "red" },
];

export default function ReportedTable({
  data,
  isLoading,
  currentPage,
  setCurrentPage,
  setSearchText,
  onView,
}) {
  const [reasonModal, setReasonModal] = useState({
    open: false,
    action: null,
    feedId: null,
    label: "",
  });
  const [reason, setReason] = useState("");

  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateContentModerationMutation();

  const reports = data?.data || [];
  const meta = data?.meta;

  const dataSource = reports.map((item) => ({
    key: item._id,
    reportId: item._id,
    feedId: typeof item.feed === "string" ? item.feed : item.feed?._id,
    reporterName:
      `${item.author?.firstName || ""} ${item.author?.lastName || ""}`.trim(),
    reporterImage: item.author?.photoUrl,
    reason: item.reason || "—",
    status: item.status || "pending",
    date: moment(item.createdAt).format("lll"),
  }));

  const openReasonModal = (action, feedId, label) => {
    if (!feedId) {
      toast.error("Feed ID not found for this report");
      return;
    }
    setReasonModal({ open: true, action, feedId, label });
    setReason("");
  };

  const handleConfirmAction = async () => {
    if (!reason.trim()) {
      toast.error("Please provide a reason");
      return;
    }

    try {
      const res = await updateStatus({
        id: reasonModal.feedId,
        data: {
          moderationStatus: reasonModal.action,
          reason: reason.trim(),
        },
      }).unwrap();

      toast.success(res?.message || "Action completed successfully!");
      setReasonModal({ open: false, action: null, feedId: null, label: "" });
      setReason("");
    } catch (error) {
      toast.error(
        error?.data?.message || "An error occurred while updating status.",
      );
    }
  };

  const columns = [
    {
      title: "Reporter",
      key: "reporter",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Image
            src={record.reporterImage}
            alt="Reporter"
            className="aspect-square !h-10 !w-10 rounded-full object-cover"
            fallback="https://via.placeholder.com/40"
          />
          <span className="font-medium">{record.reporterName || "—"}</span>
        </div>
      ),
    },
    {
      title: "Report Reason",
      dataIndex: "reason",
      key: "reason",
      ellipsis: true,
      render: (text) => <span className="text-sm text-gray-700">{text}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={
            status === "pending"
              ? "orange"
              : status === "resolved"
                ? "green"
                : "default"
          }
          className="capitalize"
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Reported At",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Actions",
      key: "actions",
      width: 130,
      render: (_, record) => {
        const menuItems = MODERATION_ACTIONS.map((a) => ({
          key: a.key,
          label: (
            <span
              className={
                a.color === "red"
                  ? "text-red-600"
                  : a.color === "green"
                    ? "text-green-600"
                    : "text-orange-600"
              }
            >
              {a.label}
            </span>
          ),
          onClick: () => openReasonModal(a.key, record.feedId, a.label),
        }));

        return (
          <div className="flex items-center justify-center gap-2">
            <button
              className="rounded border p-[2px] text-xs hover:bg-gray-100"
              onClick={() => onView(record.reportId)}
              title="View report details"
            >
              <Eye size={20} />
            </button>

            <Dropdown
              menu={{ items: menuItems }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <button
                className="rounded border p-[2px] text-xs hover:bg-gray-100"
                title="Moderation actions on feed"
              >
                <MoreVertical size={18} />
              </button>
            </Dropdown>
          </div>
        );
      },
    },
  ];

  return (
    <div className="rounded-xl bg-white p-4 shadow">
      <div className="mb-4 ml-auto w-full sm:w-1/3">
        <Input
          placeholder="Search reports..."
          prefix={<Search className="mr-2 text-black" size={20} />}
          className="h-11 !rounded-lg !border !text-base"
          onChange={(e) => {
            setSearchText(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      <Table
        columns={columns}
        dataSource={dataSource}
        loading={isLoading}
        pagination={{
          current: currentPage,
          pageSize: 10,
          total: meta?.total || 0,
          onChange: (page) => setCurrentPage(page),
          showTotal: (total) => `Total ${total} reports`,
        }}
        rowKey="key"
      />

      {/* Reason Modal */}
      <Modal
        title={`${reasonModal.label} – Confirmation`}
        open={reasonModal.open}
        onCancel={() => {
          setReasonModal({
            open: false,
            action: null,
            feedId: null,
            label: "",
          });
          setReason("");
        }}
        onOk={handleConfirmAction}
        okText={isUpdating ? "Processing..." : "Confirm"}
        okButtonProps={{
          loading: isUpdating,
          danger: ["restrict", "remove", "suspend_user"].includes(
            reasonModal.action,
          ),
        }}
        centered
        destroyOnClose
      >
        <p className="mb-3 text-sm text-gray-600">
          This action will be applied on the reported feed. Please provide a
          reason.
        </p>
        <TextArea
          rows={4}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. Policy violation, spam, harassment..."
          maxLength={300}
          showCount
        />
      </Modal>
    </div>
  );
}
