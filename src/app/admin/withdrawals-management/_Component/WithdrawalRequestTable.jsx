"use client";

import { Button, ConfigProvider, Input, Table } from "antd";
import { Tooltip } from "antd";
import { Check, Eye, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { Tag } from "antd";
import CustomConfirm from "@/components/CustomConfirm/CustomConfirm";
import UpdateHoldPeriodModal from "./UpdateHoldPeriodModal";
import { useGetWithdrawalRequestsQuery } from "@/redux/api/financialApi";
import { FaPlay } from "react-icons/fa6";
import { FaPause } from "react-icons/fa";
import { useChnageWithdrawalStatusMutation } from "@/redux/api/withdrawApi";
import toast from "react-hot-toast";
import ShowWithDrawRequestModal from "./ShowWithDrawRequestModal";

export default function WithdrawalRequestTables() {
  const [showEarningModal, setShowEarningModal] = useState(false);
  const [selectedEarning, setSelectedEarning] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [updateHoldPeriod, setUpdateHoldPeriod] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // get withdrawal request api handeller

  const { data: withdrawalData, isLoading } = useGetWithdrawalRequestsQuery({
    searchTerm: searchText,
    page: currentPage,
    limit: 10,
  });

  // chnage withdrawal request status api
  const [updateWithdrawalStatus, { isLoading: updateWithdrawalStatusLoading }] =
    useChnageWithdrawalStatusMutation();

  // format data for table

  const tableData = withdrawalData?.data?.map((item, index) => ({
    key: index + 1,
    id: item._id,
    name: `${item.user.firstName} ${item.user.lastName}`,
    email: item.user.email,
    photo: item.user.photoUrl,
    booking: item.booking,
    amount: item.amount,
    status: item.status,
    requestedDate: new Date(item.createdAt).toLocaleString(),
  }));

  // ================== Table Columns ================
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "User Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Booking ID",
      dataIndex: "booking",
    },
    {
      title: "Requested Date",
      dataIndex: "requestedDate",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (value) => (
        <Tag color="blue" className="!text-base font-semibold">
          ${value}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => {
        let color =
          status === "completed"
            ? "green"
            : status === "proceed"
              ? "orange"
              : "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Action",
      render: (_, record) => (
        <div className="flex-center-start gap-x-3">
          <Tooltip title="Show Details">
            <span className="cursor-pointer">
              <Eye
                onClick={() => {
                  setSelectedEarning(record?.id);
                  setShowEarningModal(true);
                }}
                size={22}
              />
            </span>
          </Tooltip>
          {record.status !== "completed" && (
            <CustomConfirm
              title={
                record?.status === "proceed"
                  ? "Hold Withdrawal Request"
                  : "Approve Withdrawal Request"
              }
              content={
                record?.status === "proceed"
                  ? "Are you sure you want to hold this withdrawal request?"
                  : "Are you sure you want to approve this withdrawal request? Once approved, the amount will be transferred to the user's account within 3 business days."
              }
              onConfirm={async () => {
                try {
                  const newStatus =
                    record?.status === "proceed" ? "hold" : "proceed";

                  const res = await updateWithdrawalStatus({
                    id: record.id,
                    status: newStatus,
                  }).unwrap();

                  if (res.success) {
                    toast.success(
                      `Withdrawal request ${
                        newStatus === "proceed" ? "approved" : "held"
                      } successfully`,
                    );
                  } else {
                    toast.error("Failed to update withdrawal request status");
                  }
                } catch (error) {
                  toast.error("Something went wrong!");
                }
              }}
            >
              <span className="cursor-pointer">
                {record?.status === "proceed" ? (
                  <FaPause size={20} />
                ) : (
                  <FaPlay size={20} />
                )}
              </span>
            </CustomConfirm>
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
      <div className="flex-center-between mb-3 ml-auto w-2/4 gap-x-5">
        <Input
          placeholder="Search by name "
          prefix={<Search className="mr-2 text-black" size={20} />}
          className="h-11 !rounded-lg !border !text-base"
          onChange={(e) => setSearchText(e.target.value)}
        />

        {/* update hold period button */}
        <Button
          onClick={() => setUpdateHoldPeriod(true)}
          type="primary"
          className="!h-11"
        >
          Update Hold Period
        </Button>
      </div>
      {/* Show table */}
      <section className="my-10">
        <Table
          style={{ overflowX: "auto" }}
          columns={columns}
          dataSource={tableData}
          scroll={{ x: "100%" }}
          pagination
        ></Table>
      </section>

      {/* Show earning modal */}

      <ShowWithDrawRequestModal
        open={showEarningModal}
        setOpen={setShowEarningModal}
        id={selectedEarning}
      />

      {/* show update hold period modal */}
      <UpdateHoldPeriodModal
        open={updateHoldPeriod}
        setOpen={setUpdateHoldPeriod}
      />
    </ConfigProvider>
  );
}
