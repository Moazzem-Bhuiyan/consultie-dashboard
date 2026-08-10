"use client";
import { Image, Input, Table, Tag } from "antd";
import { Tooltip } from "antd";
import { ConfigProvider } from "antd";
import { Filter, Search } from "lucide-react";
import userImage from "@/assets/images/nouser.png";
import { Eye } from "lucide-react";
import { UserX } from "lucide-react";
import { CheckCircle } from "lucide-react";
import { useState } from "react";
import CustomConfirm from "@/components/CustomConfirm/CustomConfirm";
import ProfileModal from "@/components/SharedModals/ProfileModal";
import {
  useChangeUserStatusMutation,
  useGetAllusersQuery,
} from "@/redux/api/userApi";
import toast from "react-hot-toast";

export default function BussinessAccDetailsTable({ limit }) {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [role, setRole] = useState(null);
  const [selectedUser, SetSelecteduser] = useState("");
  // User data with query parameterss
  const { data: users, isLoading } = useGetAllusersQuery({
    limit: limit || 10,
    page: currentPage,
    searchText,
  });
  const data = users?.data?.userList?.map((user, inx) => {
    return {
      key: user?._id || inx + 1,
      id: user?._id,
      // Full Name
      name: `${user?.firstName || ""} ${user?.lastName || ""}`,

      // Image
      userImg: user?.photoUrl || userImage,
      // Basic Info
      email: user?.email || "N/A",
      contact: user?.phoneNumber || "N/A",

      // Date (Formatted)
      date: user?.createdAt ? new Date(user.createdAt).toLocaleString() : "N/A",

      // Status
      status: user?.status || "N/A",

      // User Type (Example Logic)
      userType: user?.role,

      // Extra Fields (Optional – if you want to show)
      headline: user?.headline || "",
      expertise: user?.expertise?.join(", ") || "N/A",
      skills: user?.skills,
      followers: user?.followers ?? 0,
      following: user?.following ?? 0,
      points: user?.points ?? 0,
      avgRating: user?.avgRating ?? 0,
      isProfileSetup: user?.isProfileSetup ? "Completed" : "Incomplete",
      customId: user?.id || "N/A",
    };
  });

  // change user status api
  const [changeUserStatus, { isLoading: changeUserStatusLoading }] =
    useChangeUserStatusMutation();

  // Approve user handler
  const handleApproveUser = async (id, status) => {
    try {
      const payload = {
        userId: id,
        status: status,
      };
      const res = await changeUserStatus(payload).unwrap();

      if (res?.data?.message) {
        toast.success(res?.data?.message || "User status updated successfully");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update user status");
    }
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
              SetSelecteduser(record);
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
                onConfirm={() => handleApproveUser(record?.id, "active")}
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
                onConfirm={() => handleApproveUser(record?.id, "blocked")}
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
              onConfirm={() => handleApproveUser(record?.id, "active")}
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
      title: "User Name",
      dataIndex: "name",
      render: (value, record) => (
        <div className="flex-center-start gap-x-2">
          {
            record?.userImg ? (
              <Image
                src={record?.userImg}
                alt="User avatar"
                width={52}
                height={52}
                className="aspect-square rounded-full"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center"> <UserX size={24} color="#9CA3AF" /></div>
            )
          }
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
      onFilter: (value, record) => record.userType === value,
      render: (value) => (
        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${value === "consult" ? "border bg-green-100 text-green-600" : value === "expert" ? "border bg-blue-100 text-blue-600" : "border bg-gray-100 text-gray-600"}`}
        >
          {value}
        </span>
      ),
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
        loading={isLoading}
        pagination={{
          current: currentPage,
          pageSize: limit || 10,
          total: users?.meta?.total || 0,
          onChange: (page) => setCurrentPage(page),
          showTotal: (total) => `Total ${total} items`,
        }}
      />

      <ProfileModal
        open={profileModalOpen}
        setOpen={setProfileModalOpen}
        role={role}
        selectedUser={selectedUser}
      />
    </ConfigProvider>
  );
}
