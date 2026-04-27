"use client";

import { useGetWithdrawalByIdQuery } from "@/redux/api/withdrawApi";
import { Modal, Tag, Spin, Divider } from "antd";
import Image from "next/image";
import userAvatar from "@/assets/images/user-avatar-lg.png";

export default function ShowWithDrawRequestModal({ open, setOpen, id }) {
  const { data, isLoading } = useGetWithdrawalByIdQuery(id, {
    skip: !id,
  });

  const withdraw = data?.data;

  return (
    <Modal
      centered
      open={open}
      footer={null}
      title="💸 Withdrawal Request Details"
      onCancel={() => setOpen(false)}
      width={800}
    >
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Spin size="large" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* ================= USER INFO ================= */}
          <div className="flex items-center gap-4 rounded-xl bg-gray-50 p-4 shadow-sm">
            <Image
              src={withdraw?.user?.photoUrl || userAvatar}
              alt="user"
              className="h-16 w-16 rounded-full border"
              width={64}
              height={64}
            />
            <div>
              <h2 className="text-lg font-semibold">
                {withdraw?.user?.firstName} {withdraw?.user?.lastName}
              </h2>
              <p className="text-sm text-gray-500">{withdraw?.user?.email}</p>
            </div>
          </div>

          <Divider />

          {/* ================= WITHDRAW INFO ================= */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-white p-4 shadow">
              <p className="text-sm text-gray-500">Amount</p>
              <h2 className="text-xl font-bold text-blue-600">
                ${withdraw?.amount}
              </h2>
            </div>

            <div className="rounded-xl bg-white p-4 shadow">
              <p className="text-sm text-gray-500">Status</p>
              <Tag
                color={
                  withdraw?.status === "completed"
                    ? "green"
                    : withdraw?.status === "proceed"
                      ? "orange"
                      : "red"
                }
                className="px-3 py-1 text-sm"
              >
                {withdraw?.status}
              </Tag>
            </div>

            <div className="rounded-xl bg-white p-4 shadow">
              <p className="text-sm text-gray-500">Created At</p>
              <p className="font-medium">
                {new Date(withdraw?.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="rounded-xl bg-white p-4 shadow">
              <p className="text-sm text-gray-500">Updated At</p>
              <p className="font-medium">
                {new Date(withdraw?.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>

          <Divider />

          {/* ================= BOOKING INFO ================= */}
          <div className="space-y-3 rounded-xl bg-gray-50 p-5 shadow-sm">
            <h3 className="mb-2 text-lg font-semibold">📅 Booking Details</h3>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <p>
                <span className="font-medium">Client Name:</span>{" "}
                {withdraw?.booking?.user?.firstName}{" "}
                {withdraw?.booking?.user?.lastName}
              </p>

              <p>
                <span className="font-medium">Email:</span>{" "}
                {withdraw?.booking?.user?.email}
              </p>

              <p>
                <span className="font-medium">Session Type:</span>{" "}
                {withdraw?.booking?.sessionType}
              </p>

              <p>
                <span className="font-medium">Duration:</span>{" "}
                {withdraw?.booking?.sessionDuration} min
              </p>

              <p>
                <span className="font-medium">Price:</span> $
                {withdraw?.booking?.price}
              </p>

              <p>
                <span className="font-medium">Payment:</span>{" "}
                {withdraw?.booking?.paymentStatus}
              </p>

              <p>
                <span className="font-medium">Date:</span>{" "}
                {withdraw?.booking?.slot?.date}
              </p>

              <p>
                <span className="font-medium">Time:</span>{" "}
                {withdraw?.booking?.slot?.time}
              </p>
            </div>

            <Divider />

            {/* Questions */}
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Main Question:</span>{" "}
                {withdraw?.booking?.mainQuestion}
              </p>

              <p>
                <span className="font-medium">Challenge:</span>{" "}
                {withdraw?.booking?.challengeQuestion}
              </p>

              <p>
                <span className="font-medium">Background:</span>{" "}
                {withdraw?.booking?.backgroundQuestion}
              </p>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
