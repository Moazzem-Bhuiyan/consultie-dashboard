"use client";
import CustomConfirm from "@/components/CustomConfirm/CustomConfirm";
import { Table, Tag, Avatar, Input } from "antd";
import { Eye, Filter, Search } from "lucide-react";
import React, { useState } from "react";
import ViolationModal from "./ContentViewModal";
import moment from "moment";
import { useUpdateContentModerationMutation } from "@/redux/api/content-moderationApi";
import toast from "react-hot-toast";

export default function ContentTable({
  data: feeds,
  setSearchText,
  setCurrentPage,
  currentPage,
}) {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  // update feed status API call here
  const [updateStatus, { isLoading }] = useUpdateContentModerationMutation();

  const dataSource =
    feeds?.data?.feedList?.map((item) => ({
      key: item._id,
      contentTitle: item.description?.slice(0, 40) + "...",
      fullDescription: item.description,
      userName: `${item.author?.firstName} ${item.author?.lastName}`,
      userImage: item.author?.photoUrl,
      date: moment(item.createdAt).format("lll"),
      status: item.status,
      likes: item.contentMeta?.like,
      comments: item.contentMeta?.comment,
      mediaCount: item.content?.length,
      isReported: item.isReported,
    })) || [];

  const columns = [
    {
      title: "User",
      key: "user",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Avatar src={record.userImage} />
          <span>{record.userName}</span>
        </div>
      ),
    },
    {
      title: "Content",
      dataIndex: "contentTitle",
      key: "contentTitle",
    },
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
      title: "Status",
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
          {status.toUpperCase()}
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
      render: (_, record) => {
        // Determine button text and action type
        const isRestrictAction =
          record.status === "active" && record.isReported;
        const isActivateAction = record.status === "restrict";

        // No action for posts that are active but not reported
        if (!isRestrictAction && !isActivateAction) return null;

        const buttonText = isRestrictAction ? "Restrict" : "Activate";
        const buttonColor = isRestrictAction ? "red" : "green";

        const handleAction = async (key, status) => {
          try {
            const res = await updateStatus({ id: key, status }).unwrap();
            if (res.success) {
              toast.success(res.message || "Status updated successfully!");
              setSelectedRow(null);
              setOpen(false);
            }
          } catch (error) {
            toast.error("An error occurred while updating the status.");
          }
        };

        return (
          <div className="flex items-center justify-center !gap-2">
            <button
              className="rounded border p-[2px] text-xs hover:bg-gray-100"
              onClick={() => {
                setSelectedRow(record.key);
                setOpen(true);
              }}
            >
              <Eye size={20} />
            </button>
            <CustomConfirm
              onConfirm={() => {
                handleAction(
                  record.key,
                  record.status === "active" ? "restrict" : "active",
                );
              }}
              title={`Are you sure you want to ${buttonText.toLowerCase()} this post?`}
            >
              <button
                className={`ml-2 rounded border p-1 text-xs text-black hover:bg-gray-100 ${buttonColor === "red" ? "border-red-500" : "border-green-500"}`}
              >
                {buttonText}
              </button>
            </CustomConfirm>
          </div>
        );
      },
    },
  ];

  return (
    <div className="rounded-xl bg-white p-4 shadow">
      <div className="mb-3 ml-auto w-1/3 gap-x-5">
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
      />

      <ViolationModal visible={open} onClose={setOpen} data={selectedRow} />
    </div>
  );
}
