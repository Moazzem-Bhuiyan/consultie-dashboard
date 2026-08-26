"use client";

import {
  Table,
  Tag,
  Input,
  Image,
  Dropdown,
  Modal,
  Input as AntInput,
} from "antd";
import { Eye, Filter, Search, MoreVertical, UserX } from "lucide-react";
import React, { useState } from "react";
import ViolationModal from "./ContentViewModal";
import moment from "moment";
import { useUpdateContentModerationMutation } from "@/redux/api/content-moderationApi";
import toast from "react-hot-toast";

const { TextArea } = AntInput;

const MODERATION_ACTIONS = [
  {
    key: "restrict",
    label: "Restrict",
    color: "red",
    showWhen: (r) => r.status === "active",
  },
  {
    key: "activate",
    label: "Activate",
    color: "green",
    showWhen: (r) => r.status === "restrict",
  },
  {
    key: "remove",
    label: "Remove",
    color: "red",
    showWhen: () => true,
  },
  {
    key: "warn_user",
    label: "Warn User",
    color: "orange",
    showWhen: () => true,
  },
  {
    key: "suspend_user",
    label: "Suspend User",
    color: "red",
    showWhen: () => true,
  },
];

export default function ContentTable({
  data: feeds,
  setSearchText,
  setCurrentPage,
  currentPage,
}) {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // Reason modal state
  const [reasonModal, setReasonModal] = useState({
    open: false,
    action: null,
    recordKey: null,
    label: "",
  });
  const [reason, setReason] = useState("");

  const [updateStatus, { isLoading }] = useUpdateContentModerationMutation();

  const dataSource =
    feeds?.data?.feedList?.map((item) => ({
      key: item._id,
      contentTitle: item.description
        ? item.description.slice(0, 40) +
          (item.description.length > 40 ? "..." : "")
        : "—",
      fullDescription: item.description,
      userName:
        `${item.author?.firstName || ""} ${item.author?.lastName || ""}`.trim(),
      userImage: item.author?.photoUrl,
      date: moment(item.createdAt).format("lll"),
      status: item.status,
      moderationStatus: item.moderationStatus,
      likes: item.contentMeta?.like ?? 0,
      comments: item.contentMeta?.comment ?? 0,
      mediaCount: item.content?.length ?? 0,
      isReported: item.isFoundReported,
    })) || [];

  const openReasonModal = (action, recordKey, label) => {
    setReasonModal({ open: true, action, recordKey, label });
    setReason("");
  };

  const handleConfirmAction = async () => {
    if (!reason.trim()) {
      toast.error("Please provide a reason");
      return;
    }

    try {
      const payload = {
        moderationStatus: reasonModal.action,
        reason: reason.trim(),
      };
      const res = await updateStatus({
        id: reasonModal.recordKey,
        data: payload,
      }).unwrap();

      if (res?.success !== false) {
        toast.success(res?.message || "Action completed successfully!");
      }

      setReasonModal({ open: false, action: null, recordKey: null, label: "" });
      setReason("");
    } catch (error) {
      toast.error(
        error?.data?.message || "An error occurred while updating the status.",
      );
    }
  };

  const columns = [
    {
      title: "User",
      key: "user",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          {record?.userImage ? (
            <Image
              src={record?.userImage}
              alt="User avatar"
              width={52}
              height={52}
              className="aspect-square rounded-full"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
              {" "}
              <UserX size={24} color="#9CA3AF" />
            </div>
          )}
          <span>{record.userName || "—"}</span>
        </div>
      ),
    },
    // {
    //   title: "Content",
    //   dataIndex: "contentTitle",
    //   key: "contentTitle",
    // },
    {
      title: "Media",
      dataIndex: "mediaCount",
      key: "mediaCount",
    },
    {
      title: "Likes",
      dataIndex: "likes",
      key: "likes",
    },
    {
      title: "Comments",
      dataIndex: "comments",
      key: "comments",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Moderation Status",
      dataIndex: "moderationStatus",
      key: "moderationStatus",
      filters: [
        { text: "Active", value: "active" },
        { text: "Restricted", value: "restrict" },
      ],
      filterIcon: (filtered) => (
        <Filter
          size={16}
          color={filtered ? "#1B70A6" : "#000000"}
          style={{ cursor: "pointer" }}
        />
      ),
      onFilter: (value, record) => record.moderationStatus === value,
      render: (status) => (
        <Tag
          color={
            status === "activate" || status === "warn_user" ? "yellow" : "red"
          }
        >
          {(status || "—").toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Account Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Active", value: "active" },
        { text: "Restricted", value: "restrict" },
      ],
      filterIcon: (filtered) => (
        <Filter
          size={16}
          color={filtered ? "#1B70A6" : "#000000"}
          style={{ cursor: "pointer" }}
        />
      ),
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <Tag color={status === "active" ? "green" : "red"}>
          {(status || "—").toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Report Status",
      dataIndex: "isReported",
      key: "isReported",
      filters: [
        { text: "Reported", value: true },
        { text: "Not Reported", value: false },
      ],
      filterIcon: (filtered) => (
        <Filter
          size={16}
          color={filtered ? "#1B70A6" : "#000000"}
          style={{ cursor: "pointer" }}
        />
      ),
      onFilter: (value, record) => record.isReported === value,
      render: (isReported) => (
        <Tag color={isReported ? "red" : "green"}>
          {isReported ? "Reported" : "Not Reported"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => {
        const menuItems = MODERATION_ACTIONS.filter((a) =>
          a.showWhen(record),
        ).map((a) => ({
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
          onClick: () => openReasonModal(a.key, record.key, a.label),
        }));

        return (
          <div className="flex items-center justify-center gap-2">
            {/* Eye – always visible */}
            <button
              className="rounded border p-[2px] text-xs hover:bg-gray-100"
              onClick={() => {
                setSelectedRow(record.key);
                setOpen(true);
              }}
              title="View post"
            >
              <Eye size={20} />
            </button>

            {/* More actions dropdown */}
            <Dropdown
              menu={{ items: menuItems }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <button
                className="rounded border p-[2px] text-xs hover:bg-gray-100"
                title="Moderation actions"
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
      <div className="mb-3 ml-auto w-1/3">
        <Input
          placeholder="Search by name or email"
          prefix={<Search className="mr-2 text-black" size={20} />}
          className="h-11 !rounded-lg !border !text-base"
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={{
          current: currentPage,
          pageSize: 10,
          total: feeds?.meta?.total || 0,
          onChange: (page) => setCurrentPage(page),
          showTotal: (total) => `Total ${total} items`,
        }}
        rowKey="key"
        loading={isLoading}
      />

      {/* View Post Modal */}
      <ViolationModal visible={open} onClose={setOpen} data={selectedRow} />

      {/* Reason Modal for moderation actions */}
      <Modal
        title={`${reasonModal.label} – Confirmation`}
        open={reasonModal.open}
        onCancel={() => {
          setReasonModal({
            open: false,
            action: null,
            recordKey: null,
            label: "",
          });
          setReason("");
        }}
        onOk={handleConfirmAction}
        okText={isLoading ? "Processing..." : "Confirm"}
        okButtonProps={{
          loading: isLoading,
          danger: ["restrict", "remove", "suspend_user"].includes(
            reasonModal.action,
          ),
        }}
        centered
        destroyOnClose
      >
        <p className="mb-3 text-sm text-gray-600">
          Please provide a reason for this action. This will be stored with the
          moderation log.
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
