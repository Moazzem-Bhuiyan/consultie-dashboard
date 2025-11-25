"use client";
import { Input, Table, Tag } from "antd";
import { Tooltip } from "antd";
import { ConfigProvider } from "antd";
import { FilterIcon, Search } from "lucide-react";
import userImage from "@/assets/images/user-avatar-lg.png";
import { Eye } from "lucide-react";
import { UserX } from "lucide-react";
import { CheckCircle } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import CustomConfirm from "@/components/CustomConfirm/CustomConfirm";
import { message } from "antd";
import ProfileModal from "@/components/SharedModals/ProfileModal";
// import BussinessProfileModal from "@/components/SharedModals/BussinessProfileModal";

export default function BussinessAccDetailsTable({ limit }) {
  const [role, setRole] = useState(null);
  // Updated dummy table Data with different statuses
  const data = Array.from({ length: limit || 10 }).map((_, inx) => {
    const statuses = ["pending", "active", "blocked"];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    return {
      key: inx + 1,
      name: "Moazzem Hossain",
      userImg: userImage,
      email: "moazzem@gmail.com",
      contact: "+1234567890",
      date: "11 oct 24, 11.10PM",
      status: randomStatus,
      userType: inx % 2 === 0 ? "Consultant" : "User",
    };
  });
  const [searchText, setSearchText] = useState("");
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Block user handler
  const handleBlockUser = () => {
    message.success("User blocked successfully");
  };

  // Approve user handler
  const handleApproveUser = () => {
    message.success("User approved successfully");
  };

  // Status render with colors
  const renderStatus = (status) => {
    switch (status) {
      case "pending":
        return (
          <Tag color="orange" className="!text-base font-semibold">
            Pending
          </Tag>
        );
      case "active":
        return (
          <Tag color="green" className="!text-base font-semibold">
            Active
          </Tag>
        );
      case "blocked":
        return (
          <Tag color="red" className="!text-base font-semibold">
            Blocked
          </Tag>
        );
      default:
        return (
          <Tag color="default" className="!text-base font-semibold">
            {status}
          </Tag>
        );
    }
  };

  // Conditional action buttons based on status
  const renderActions = (record) => {
    const { status } = record;
    const { userType } = record;
    return (
      <div className="flex-center-start gap-x-3">
        {/* View button - always available */}
        <Tooltip title="Show Details">
          <button
            onClick={() => {
              setProfileModalOpen(true);
              setRole(userType);
            }}
          >
            <Eye color="#1B70A6" size={22} />
          </button>
        </Tooltip>

        {/* Conditional buttons based on status */}
        {status === "pending" && (
          <>
            <Tooltip title="Approve User">
              <CustomConfirm
                title="Approve User"
                description="Are you sure you want to approve this user?"
                onConfirm={handleApproveUser}
              >
                <button>
                  <CheckCircle color="#52C41A" size={22} />
                </button>
              </CustomConfirm>
            </Tooltip>
          </>
        )}

        {status === "active" && (
          <>
            <Tooltip title="Block User">
              <CustomConfirm
                title="Block User"
                description="Are you sure to block this user?"
                onConfirm={handleBlockUser}
              >
                <button>
                  <UserX color="#F16365" size={22} />
                </button>
              </CustomConfirm>
            </Tooltip>
          </>
        )}

        {status === "blocked" && (
          <Tooltip title="User is blocked">
            <CustomConfirm
              title="Unblock User"
              description="Are you sure to unblock this user?"
              onConfirm={handleBlockUser}
            >
              <button>
                <UserX color="gray" size={22} />
              </button>
            </CustomConfirm>
          </Tooltip>
        )}
      </div>
    );
  };

  // ================== Table Columns ================
  const columns = [
    {
      title: "Serial",
      dataIndex: "key",
      render: (value) => `#${value}`,
    },
    {
      title: "User Name",
      dataIndex: "name",
      render: (value, record) => (
        <div className="flex-center-start gap-x-2">
          <Image
            src={record.userImg}
            alt="User avatar"
            width={1200}
            height={1200}
            className="aspect-square h-auto w-10 rounded-full"
          />
          <p className="font-medium">{value}</p>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Contact",
      dataIndex: "contact",
    },
    {
      title: "User Type",
      dataIndex: "userType",
      render: (_, record) => (
        <Tag color="blue" className="!text-base font-semibold">
          {record.userType || "User"}
        </Tag>
      ),
      filter: [
        { text: "Admin", value: "Admin" },
        { text: "User", value: "User" },
      ],
      onFilter: (value, record) => record.userType === value,
      FilterIcon: () => <FilterIcon size={16} />,
    },
    {
      title: "Joining Date",
      dataIndex: "date",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (value) => renderStatus(value),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => renderActions(record),
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
      />

      <ProfileModal
        open={profileModalOpen}
        setOpen={setProfileModalOpen}
        role={role}
      />
    </ConfigProvider>
  );
}
