// components/BookingDetailsModal.jsx
import React from "react";
import { Modal, Spin, Descriptions, Avatar, Tag, Divider } from "antd";
import { useGetSingleBookingQuery } from "@/redux/api/bookingsApi";

const statusColor = {
  completed: "green",
  cancelled: "red",
  pending: "orange",
  confirmed: "blue",
  running: "cyan",
  declined: "volcano",
  not_responded: "default",
};

const BookingDetailsModal = ({ bookingId, open, onClose }) => {
  const { data, isLoading, isFetching } = useGetSingleBookingQuery(bookingId, {
    skip: !bookingId || !open,
  });

  const booking = data?.data;

  return (
    <Modal
      centered
      title={
        <div className="flex items-center gap-3">
          <span>Booking Details</span>
          {booking && (
            <Tag color={statusColor[booking.status] || "default"}>
              {booking.status?.toUpperCase()}
            </Tag>
          )}
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={720}
      destroyOnClose
    >
      {isLoading || isFetching ? (
        <div className="flex justify-center py-16">
          <Spin size="large" />
        </div>
      ) : booking ? (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold">ID: {booking.id}</h3>
              <p className="text-sm text-gray-500">
                Created: {new Date(booking.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-600">
                ${booking.totalPay}
              </p>
              <p className="text-sm text-gray-500">VAT: ${booking.vat || 0}</p>
            </div>
          </div>

          <Divider />

          {/* User & Consult */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="mb-2 font-medium">Client</h4>
              <div className="flex items-center gap-3">
                <Avatar
                  size={48}
                  src={booking.user?.photoUrl}
                  alt={booking.user?.firstName}
                >
                  {booking.user?.firstName?.[0]}
                </Avatar>
                <div>
                  <p className="font-medium">
                    {booking.user?.firstName} {booking.user?.lastName}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="mb-2 font-medium">Expert</h4>
              <div className="flex items-center gap-3">
                <Avatar size={48} src={booking.consult?.photoUrl}>
                  {booking.consult?.firstName?.[0]}
                </Avatar>
                <div>
                  <p className="font-medium">
                    {booking.consult?.firstName} {booking.consult?.lastName}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Divider />

          {/* Session Info */}
          <Descriptions column={2} bordered size="small">
            <Descriptions.Item label="Date">
              {booking.displayDate}
            </Descriptions.Item>
            <Descriptions.Item label="Time">
              {booking.displayStartTime} - {booking.displayEndTime}
            </Descriptions.Item>
            <Descriptions.Item label="Timezone">
              {booking.displayTimezone}
            </Descriptions.Item>
            <Descriptions.Item label="Duration">
              {booking.sessionDuration} min
            </Descriptions.Item>
            <Descriptions.Item label="Session Type">
              {booking.sessionType}
            </Descriptions.Item>
            <Descriptions.Item label="Payment Status">
              <Tag
                color={booking.paymentStatus === "refunded" ? "red" : "green"}
              >
                {booking.paymentStatus}
              </Tag>
            </Descriptions.Item>
          </Descriptions>

          {/* Questions */}
          {(booking.mainQuestion ||
            booking.challengeQuestion ||
            booking.backgroundQuestion) && (
            <>
              <Divider />
              <div className="space-y-3">
                {booking.mainQuestion && (
                  <div>
                    <p className="text-sm text-gray-500">Main Question</p>
                    <p>{booking.mainQuestion}</p>
                  </div>
                )}
                {booking.challengeQuestion && (
                  <div>
                    <p className="text-sm text-gray-500">Challenge Question</p>
                    <p>{booking.challengeQuestion}</p>
                  </div>
                )}
                {booking.backgroundQuestion && (
                  <div>
                    <p className="text-sm text-gray-500">Background Question</p>
                    <p>{booking.backgroundQuestion}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      ) : (
        <p className="py-8 text-center text-gray-500">No data found</p>
      )}
    </Modal>
  );
};

export default BookingDetailsModal;
