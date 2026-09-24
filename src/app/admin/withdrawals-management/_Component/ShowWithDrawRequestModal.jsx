"use client";
import { Modal, Tag, Spin, Divider, Timeline } from "antd";
import Image from "next/image";
import userAvatar from "@/assets/images/user-avatar-lg.png";
import dayjs from "dayjs";
import { useGetWithdrawalByIdQuery } from "@/redux/api/withdrawApi";

export default function ShowWithDrawRequestModal({ open, setOpen, id }) {
  const { data, isLoading } = useGetWithdrawalByIdQuery(id, {
    skip: !id || !open,
  });

  const withdraw = data?.data;

  const statusColor = {
    completed: "green",
    proceed: "orange",
    hold: "red",
  };

  return (
    <Modal
      centered
      open={open}
      footer={null}
      title="💸 Withdrawal Request Details"
      onCancel={() => setOpen(false)}
      width={900}
      destroyOnClose
    >
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spin size="large" />
        </div>
      ) : !withdraw ? (
        <p className="py-10 text-center text-gray-500">No data found</p>
      ) : (
        <div className="max-h-[75vh] space-y-6 overflow-y-auto pr-2">
          {/* ================= USER / EXPERT INFO ================= */}
          <div className="flex items-center gap-4 rounded-xl bg-gray-50 p-4 shadow-sm">
            <Image
              src={withdraw?.user?.photoUrl || userAvatar}
              alt="user"
              className="h-16 w-16 rounded-full border object-cover"
              width={64}
              height={64}
            />
            <div className="flex-1">
              <h2 className="text-lg font-semibold">
                {withdraw?.user?.firstName} {withdraw?.user?.lastName}
              </h2>
              <p className="text-sm text-gray-500">{withdraw?.user?.email}</p>
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-600">
                <span>Lifetime: £{withdraw?.user?.lifetimeEarnings ?? 0}</span>
                <span>Available: £{withdraw?.user?.availableBalance ?? 0}</span>
                <span>Held: £{withdraw?.user?.amountHeld ?? 0}</span>
                <span>Paid Out: £{withdraw?.user?.totalPaidOut ?? 0}</span>
              </div>
            </div>
          </div>

          <Divider className="my-2" />

          {/* ================= WITHDRAW INFO ================= */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-xl bg-white p-4 shadow">
              <p className="text-sm text-gray-500">Amount</p>
              <h2 className="text-xl font-bold text-blue-600">
                £{withdraw?.amount}
              </h2>
            </div>

            <div className="rounded-xl bg-white p-4 shadow">
              <p className="text-sm text-gray-500">Status</p>
              <Tag
                color={statusColor[withdraw?.status] || "default"}
                className="mt-1 px-3 py-1 text-sm capitalize"
              >
                {withdraw?.status}
              </Tag>
            </div>

            <div className="rounded-xl bg-white p-4 shadow">
              <p className="text-sm text-gray-500">Withdraw ID</p>
              <p className="font-medium">{withdraw?.id || withdraw?._id}</p>
            </div>

            <div className="rounded-xl bg-white p-4 shadow">
              <p className="text-sm text-gray-500">Proceed At</p>
              <p className="font-medium">
                {withdraw?.proceedAt
                  ? dayjs(withdraw.proceedAt).format("DD MMM YYYY, hh:mm A")
                  : "-"}
              </p>
            </div>

            <div className="rounded-xl bg-white p-4 shadow">
              <p className="text-sm text-gray-500">Created At</p>
              <p className="font-medium">
                {dayjs(withdraw?.createdAt).format("DD MMM YYYY, hh:mm A")}
              </p>
            </div>

            <div className="rounded-xl bg-white p-4 shadow">
              <p className="text-sm text-gray-500">Updated At</p>
              <p className="font-medium">
                {dayjs(withdraw?.updatedAt).format("DD MMM YYYY, hh:mm A")}
              </p>
            </div>
          </div>

          <Divider className="my-2" />

          {/* ================= BOOKING INFO ================= */}
          <div className="space-y-3 rounded-xl bg-gray-50 p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold">📅 Booking Details</h3>

            <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
              <p>
                <span className="font-medium">Booking ID:</span>{" "}
                {withdraw?.booking?.id || withdraw?.booking?._id || "-"}
              </p>
              <p>
                <span className="font-medium">Session Type:</span>{" "}
                <span className="capitalize">
                  {withdraw?.booking?.sessionType?.replace("_", " ")}
                </span>
              </p>
              <p>
                <span className="font-medium">Duration:</span>{" "}
                {withdraw?.booking?.sessionDuration
                  ? `${withdraw.booking.sessionDuration} min`
                  : "-"}
              </p>
              <p>
                <span className="font-medium">Price:</span> £
                {withdraw?.booking?.price ?? "-"}
              </p>
              <p>
                <span className="font-medium">Payment Status:</span>{" "}
                {withdraw?.booking?.paymentStatus}
              </p>
              <p>
                <span className="font-medium">Booking Status:</span>{" "}
                {withdraw?.booking?.status}
              </p>
              <p>
                <span className="font-medium">Date:</span>{" "}
                {withdraw?.booking?.localDate || withdraw?.booking?.date}
              </p>
              <p>
                <span className="font-medium">Time:</span>{" "}
                {withdraw?.booking?.localStartTime &&
                withdraw?.booking?.localEndTime
                  ? `${withdraw.booking.localStartTime} - ${withdraw.booking.localEndTime}`
                  : `${withdraw?.booking?.startTime || ""} - ${withdraw?.booking?.endTime || ""}`}
              </p>
            </div>

            {/* Client Info */}
            {withdraw?.booking?.user && (
              <>
                <Divider className="my-3" />
                <h4 className="font-semibold">Client</h4>
                <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                  <p>
                    <span className="font-medium">Name:</span>{" "}
                    {withdraw.booking.user.firstName}{" "}
                    {withdraw.booking.user.lastName}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {withdraw.booking.user.email}
                  </p>
                </div>
              </>
            )}

            {/* Questions */}
            {(withdraw?.booking?.mainQuestion ||
              withdraw?.booking?.challengeQuestion ||
              withdraw?.booking?.backgroundQuestion) && (
              <>
                <Divider className="my-3" />
                <div className="space-y-2 text-sm">
                  {withdraw?.booking?.mainQuestion && (
                    <p>
                      <span className="font-medium">Main Question:</span>{" "}
                      {withdraw.booking.mainQuestion}
                    </p>
                  )}
                  {withdraw?.booking?.challengeQuestion && (
                    <p>
                      <span className="font-medium">Challenge:</span>{" "}
                      {withdraw.booking.challengeQuestion}
                    </p>
                  )}
                  {withdraw?.booking?.backgroundQuestion && (
                    <p>
                      <span className="font-medium">Background:</span>{" "}
                      {withdraw.booking.backgroundQuestion}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>

          {/* ================= MANUAL HOLD LOGS ================= */}
          {withdraw?.manualHoldLogs?.length > 0 && (
            <>
              <Divider className="my-2" />
              <div className="rounded-xl bg-gray-50 p-5 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold">
                  📋 Manual Hold / Release History
                </h3>
                <Timeline
                  items={withdraw.manualHoldLogs.map((log) => ({
                    color: log.action === "manual_hold" ? "red" : "green",
                    children: (
                      <div className="text-sm">
                        <p className="font-medium capitalize">
                          {log.action?.replace("_", " ")}
                        </p>
                        <p className="text-gray-600">
                          Reason: {log.reason || "-"}
                        </p>
                        <p className="text-gray-500">
                          By: {log.admin?.firstName} {log.admin?.lastName} (
                          {log.admin?.email})
                        </p>
                        <p className="text-xs text-gray-400">
                          {dayjs(log.createdAt).format("DD MMM YYYY, hh:mm A")}
                        </p>
                        <p className="mt-1 text-xs">
                          Status: {log.previousWithdrawStatus} →{" "}
                          {log.newWithdrawStatus} | Settlement:{" "}
                          {log.previousSettlementStatus} →{" "}
                          {log.newSettlementStatus}
                        </p>
                      </div>
                    ),
                  }))}
                />
              </div>
            </>
          )}
        </div>
      )}
    </Modal>
  );
}
