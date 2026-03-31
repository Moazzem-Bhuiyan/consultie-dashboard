"use client";

import React, { useState } from "react";
import { Table, Input, Avatar, Tag, Tooltip, ConfigProvider } from "antd";
import { Search, Trash, Eye, Filter } from "lucide-react";
import CustomConfirm from "@/components/CustomConfirm/CustomConfirm";
import FeedbackDetailsModal from "./_Component/FeedbackDetailsModal";
import {
  useDeleteComplainMutation,
  useGetComplainsQuery,
} from "@/redux/api/complainApi";
import toast from "react-hot-toast";

export default function FeedbackTable() {
  const [searchText, setSearchText] = useState("");
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  // Get all feedbacks from API
  const { data: feedbackData, isLoading } = useGetComplainsQuery({
    page: 1,
    limit: 10,
    searchText,
  });
  // delete feedback API call here
  const [deleteFeedback, { isLoading: isDeleting }] =
    useDeleteComplainMutation();
  // Transform API response for Table
  const dataSource =
    feedbackData?.data?.map((item, index) => ({
      key: item._id,
      postId: index + 1,
      name: `${item.author?.firstName} ${item.author?.lastName}`,
      email: item.email,
      subject: item.subject,
      message: item.messages,
      audience: item.audience,
      date: new Date(item.createdAt).toLocaleString(),
      status: item.status,
      avatar: item.author?.photoUrl,
    })) || [];

  // Block user handler
  const handleBlockUser = async (userId) => {
    try {
      const response = await deleteFeedback(userId).unwrap();
      if (response.success) {
        toast.success("Feedback deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete feedback");
    }
  };

  // Table columns
  const columns = [
    {
      title: "ID",
      dataIndex: "postId",
      render: (value) => `#${value}`,
    },
    {
      title: "User",
      dataIndex: "name",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Avatar src={record.avatar} />
          <span>{record.name}</span>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Audience",
      dataIndex: "audience",
      filters: [
        { text: "Expert", value: "expert" },
        { text: "Consult", value: "consult" },
      ],
      filterIcon: (filtered) => (
        <Filter
          size={16}
          color={filtered ? "#1B70A6" : "#000000"}
          style={{ cursor: "pointer" }}
        />
      ),
      onFilter: (value, record) => record.audience === value,
      render: (audience) => (
        <Tag color={audience === "expert" ? "blue" : "purple"}>
          {audience.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Subject",
      dataIndex: "subject",
      ellipsis: true,
    },
    {
      title: "Date",
      dataIndex: "date",
    },
    {
      title: "Status",
      dataIndex: "status",
      filters: [
        { text: "PENDING", value: "pending" },
        { text: "RESPOND", value: "respond" },
      ],
      filterIcon: (filtered) => (
        <Filter
          size={16}
          color={filtered ? "#1B70A6" : "#000000"}
          style={{ cursor: "pointer" }}
        />
      ),
      onFilter: (value, record) => record.status === value,
      render: (value) => (
        <Tag color={value === "pending" ? "orange" : "green"}>
          {value.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Action",
      render: (_, record) => (
        <div className="flex gap-3">
          <Tooltip title="Show Details">
            <button
              onClick={() => {
                setSelectedData(record);
                setProfileModalOpen(true);
              }}
            >
              <Eye color="#1B70A6" size={22} />
            </button>
          </Tooltip>

          <Tooltip title="Block User">
            <CustomConfirm
              title="Block User"
              description="Are you sure to block this user?"
              onConfirm={() => {
                handleBlockUser(record?.key);
              }}
            >
              <button>
                <Trash color="#F16365" size={22} />
              </button>
            </CustomConfirm>
          </Tooltip>
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
      {/* Search */}
      <div className="mb-3 ml-auto w-1/3 gap-x-5">
        <Input
          placeholder="Search by name, email, subject"
          prefix={<Search className="mr-2 text-black" size={20} />}
          className="h-11 !rounded-lg !border !text-base"
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* Table */}
      <Table
        loading={isLoading}
        columns={columns}
        dataSource={dataSource}
        pagination={{
          total: feedbackData?.meta?.total,
          pageSize: 10,
        }}
        rowKey="key"
        scroll={{ x: "max-content" }}
      />

      {/* Feedback Details Modal */}
      <FeedbackDetailsModal
        open={profileModalOpen}
        setOpen={setProfileModalOpen}
        data={selectedData}
      />
    </ConfigProvider>
  );
}
