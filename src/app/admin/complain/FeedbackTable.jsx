"use client";
import { Input, Table } from "antd";
import { Tooltip } from "antd";
import { ConfigProvider } from "antd";
import { Search, Trash } from "lucide-react";
import { Eye } from "lucide-react";
import { useState } from "react";
import CustomConfirm from "@/components/CustomConfirm/CustomConfirm";
import { message } from "antd";
import FeedbackDetailsModal from "./_Component/FeedbackDetailsModal";

// Dummy table Data (Updated with USER column based on image)
const data = Array.from({ length: 9 }).map((_, inx) => {
  return {
    key: inx + 1,
    name: "Moazzem Hossain",
    email: "justina@gmail.com",
    preferredcontact: "Email",
    date: "11 oct 24, 11.10PM",
    status: "Unread",
  };
});

export default function FeedbackTable() {
  const [searchText, setSearchText] = useState("");
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Block user handler
  const handleBlockUser = () => {
    message.success("User blocked successfully");
  };

  // ================== Table Columns ================
  const columns = [
    {
      title: "Post ID",
      dataIndex: "key",
      render: (value) => `#${value}`,
    },
    {
      title: "User ",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Date",
      dataIndex: "date",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (value) => (
        <span
          className={`${
            value === "Active" ? "text-green-500" : "text-red-500"
          }`}
        >
          {value}
        </span>
      ),
    },

    {
      title: "Action",
      onCell: () => ({
        style: {
          backgroundColor: "#ffffff",
        },
      }),
      render: () => (
        <div className="flex-center-start gap-x-3 !bg-white">
          <Tooltip title="Show Details">
            <button onClick={() => setProfileModalOpen(true)}>
              <Eye color="#1B70A6" size={22} />
            </button>
          </Tooltip>

          <Tooltip title="Block User">
            <CustomConfirm
              title="Block User"
              description="Are you sure to block this user?"
              onConfirm={handleBlockUser}
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
      <div className="mb-3 ml-auto w-1/3 gap-x-5">
        <Input
          placeholder="Search by name or email"
          prefix={<Search className="mr-2 text-black" size={20} />}
          className="h-11 !rounded-lg !border !text-base"
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <Table
        style={{ overflowX: "auto", overflowY: "auto" }}
        columns={columns}
        dataSource={data}
        scroll={{ x: "max-content" }}
      ></Table>

      <FeedbackDetailsModal
        open={profileModalOpen}
        setOpen={setProfileModalOpen}
      />
    </ConfigProvider>
  );
}
