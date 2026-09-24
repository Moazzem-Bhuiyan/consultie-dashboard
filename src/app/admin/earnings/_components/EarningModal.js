"use client";

import { useState } from "react";
import {
  Modal,
  Tag,
  Avatar,
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Divider,
  Empty,
  Spin,
  Timeline,
} from "antd";
import {
  useCreateRefundMutation,
  useGetTransactionByIdQuery,
} from "@/redux/api/transactionApi";
import toast from "react-hot-toast";
import moment from "moment";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  DollarSign,
  CreditCard,
  PhoneCall,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";

const { TextArea } = Input;

export default function EarningModal({ open, setOpen, transactionID }) {
  const [showRefundForm, setShowRefundForm] = useState(false);
  const [refundType, setRefundType] = useState("full");
  const [form] = Form.useForm();

  const {
    data: transactionData,
    isLoading,
    isFetching,
  } = useGetTransactionByIdQuery(
    { transactionID },
    { skip: !transactionID || !open },
  );

  const [createRefund, { isLoading: isRefunding }] = useCreateRefundMutation();

  const transaction = transactionData?.data;

  const handleClose = () => {
    setOpen(false);
    setShowRefundForm(false);
    form.resetFields();
    setRefundType("full");
  };

  const handleRefundSubmit = async (values) => {
    if (!transaction?._id) return;

    const payload = {
      type: values.type,
      reason: values.reason,
      ...(values.type === "partial" && { amount: values.amount }),
    };

    const toastId = toast.loading("Processing refund...");

    try {
      const res = await createRefund({
        id: transaction._id, // payment _id
        data: payload,
      }).unwrap();

      toast.success(res?.message || "Refund processed successfully", {
        id: toastId,
      });
      setShowRefundForm(false);
      form.resetFields();
      setRefundType("full");
    } catch (error) {
      toast.error(
        error?.data?.message || "Failed to process refund. Please try again.",
        { id: toastId },
      );
    }
  };

  // Already has successful refunds → cannot refund again
  // Refund related flags
  const hasRefunds =
    Array.isArray(transaction?.refunds) && transaction.refunds.length > 0;

  const isRefunded = transaction?.status === "refunded" || hasRefunds;

  // Only allow new refund if still paid and no previous refund
  const canRefund =
    transaction?.status === "paid" &&
    !isRefunded &&
    Number(transaction?.refundedAmount || 0) === 0;

  if (!transactionID) return null;

  return (
    <Modal
      centered
      open={open}
      onCancel={handleClose}
      footer={null}
      width={960}
      title={
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-gray-500" />
          <span>Transaction Details</span>
          {transaction?.id && (
            <Tag color="blue" className="!ml-2">
              {transaction.id}
            </Tag>
          )}
        </div>
      }
      destroyOnClose
    >
      {isLoading || isFetching ? (
        <div className="flex h-64 items-center justify-center">
          <Spin size="large" />
        </div>
      ) : !transaction ? (
        <Empty description="Transaction not found" />
      ) : (
        <div className="max-h-[75vh] space-y-6 overflow-y-auto pr-1">
          {/* ─── People ─── */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Consultee */}
            <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                Consultee
              </p>
              <div className="flex items-center gap-3">
                <Avatar
                  size={48}
                  src={
                    transaction.consultee?.photoUrl ||
                    transaction.account?.photoUrl
                  }
                  className="!bg-indigo-100 font-semibold !text-indigo-700"
                >
                  {(
                    transaction.consultee?.firstName ||
                    transaction.account?.firstName ||
                    "U"
                  )
                    .charAt(0)
                    .toUpperCase()}
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-gray-900">
                    {transaction.consultee?.firstName ||
                      transaction.account?.firstName}{" "}
                    {transaction.consultee?.lastName ||
                      transaction.account?.lastName}
                  </p>
                  <p className="truncate text-xs text-gray-500">
                    {transaction.consultee?.email || transaction.account?.email}
                  </p>
                  {transaction.account?.phoneNumber && (
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                      <Phone className="h-3 w-3" />
                      {transaction.account.phoneNumber}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Expert */}
            <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                Expert
              </p>
              <div className="flex items-center gap-3">
                <Avatar
                  size={48}
                  src={transaction.expert?.photoUrl}
                  className="!bg-emerald-100 font-semibold !text-emerald-700"
                >
                  {(transaction.expert?.firstName || "E")
                    .charAt(0)
                    .toUpperCase()}
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-gray-900">
                    {transaction.expert?.firstName}{" "}
                    {transaction.expert?.lastName}
                  </p>
                  <p className="truncate text-xs text-gray-500">
                    {transaction.expert?.email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Booking Info ─── */}
          <section>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
              <Calendar className="h-4 w-4 text-gray-400" />
              Booking Info
            </h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 rounded-xl border border-gray-100 bg-white p-4 text-sm sm:grid-cols-3">
              <InfoItem
                label="Booking ID"
                value={transaction.booking?.id || transaction.booking?._id}
              />
              <InfoItem
                label="Session Type"
                value={transaction.booking?.sessionType}
              />
              <InfoItem
                label="Duration"
                value={
                  transaction.booking?.sessionDuration
                    ? `${transaction.booking.sessionDuration} min`
                    : "—"
                }
              />
              <InfoItem
                label="Date"
                value={
                  transaction.booking?.localDate ||
                  transaction.booking?.date ||
                  "—"
                }
              />
              <InfoItem
                label="Local Time"
                value={
                  transaction.booking?.localStartTime &&
                  transaction.booking?.localEndTime
                    ? `${transaction.booking.localStartTime} – ${transaction.booking.localEndTime}`
                    : "—"
                }
              />
              <InfoItem
                label="Timezone"
                value={transaction.booking?.timezone || "—"}
              />
              <InfoItem
                label="Status"
                value={
                  <Tag
                    color={
                      transaction.booking?.status === "completed"
                        ? "green"
                        : "blue"
                    }
                  >
                    {transaction.booking?.status || "—"}
                  </Tag>
                }
              />
              <InfoItem
                label="Payment Status"
                value={
                  <Tag
                    color={
                      transaction.booking?.paymentStatus === "paid"
                        ? "green"
                        : "orange"
                    }
                  >
                    {transaction.booking?.paymentStatus || "—"}
                  </Tag>
                }
              />
            </div>
          </section>

          {/* ─── Payment / Financial Info ─── */}
          <section>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
              <DollarSign className="h-4 w-4 text-gray-400" />
              Payment & Settlement
            </h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 rounded-xl border border-gray-100 bg-white p-4 text-sm sm:grid-cols-3">
              <InfoItem
                label="Transaction ID"
                value={transaction.transactionId}
              />
              <InfoItem
                label="Payment Intent"
                value={transaction.paymentIntentId}
              />
              <InfoItem
                label="Status"
                value={
                  <Tag
                    color={
                      transaction.status === "paid"
                        ? "green"
                        : transaction.status === "refunded"
                          ? "default"
                          : "red"
                    }
                  >
                    {transaction.status}
                  </Tag>
                }
              />
              <InfoItem
                label="Gross Amount"
                value={`$${Number(transaction.amount || 0).toFixed(2)}`}
              />
              <InfoItem
                label="Consultation Fee"
                value={`$${Number(transaction.consultationFee || 0).toFixed(2)}`}
              />
              <InfoItem
                label="Platform Commission"
                value={`$${Number(transaction.platformCommission || 0).toFixed(2)}`}
              />
              <InfoItem
                label="Expert Net"
                value={`$${Number(transaction.expertNet || 0).toFixed(2)}`}
              />
              <InfoItem
                label="Expert Payout"
                value={`$${Number(transaction.expertPayout || 0).toFixed(2)}`}
              />
              <InfoItem
                label="Platform Total"
                value={`$${Number(transaction.platformTotal || 0).toFixed(2)}`}
              />
              <InfoItem
                label="Settlement"
                value={
                  <Tag
                    color={
                      transaction.settlementStatus === "cleared"
                        ? "green"
                        : "orange"
                    }
                  >
                    {transaction.settlementStatus || "—"}
                  </Tag>
                }
              />
              <InfoItem
                label="Refunded Amount"
                value={`$${Number(transaction.refundedAmount || 0).toFixed(2)}`}
              />
              <InfoItem
                label="Net after Refund"
                value={`$${Number(transaction.netRevenueAfterRefund || 0).toFixed(2)}`}
              />
              <InfoItem
                label="Authorized At"
                value={
                  transaction.authorizedAt
                    ? moment(transaction.authorizedAt).format(
                        "MMM D, YYYY h:mm A",
                      )
                    : "—"
                }
              />
              <InfoItem
                label="Captured At"
                value={
                  transaction.capturedAt
                    ? moment(transaction.capturedAt).format(
                        "MMM D, YYYY h:mm A",
                      )
                    : "—"
                }
              />
              <InfoItem
                label="Cleared At"
                value={
                  transaction.clearedAt
                    ? moment(transaction.clearedAt).format("MMM D, YYYY h:mm A")
                    : "—"
                }
              />
            </div>
          </section>

          {/* ─── Call Logs ─── */}
          <section>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
              <PhoneCall className="h-4 w-4 text-gray-400" />
              Call Logs
              <span className="ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                {transaction.callLogs?.length || 0}
              </span>
            </h3>

            {!transaction.callLogs?.length ? (
              <div className="rounded-xl border border-dashed border-gray-200 py-8 text-center text-sm text-gray-400">
                No call logs found
              </div>
            ) : (
              <div className="space-y-3">
                {transaction.callLogs.map((log) => (
                  <div
                    key={log._id}
                    className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-full ${
                            log.status === "completed" || log.duration !== "0s"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-red-50 text-red-500"
                          }`}
                        >
                          {log.status === "cancelled" ? (
                            <XCircle className="h-4 w-4" />
                          ) : (
                            <PhoneCall className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {log.caller?.firstName} {log.caller?.lastName}
                            <span className="mx-1.5 text-gray-400">→</span>
                            {log.receiver?.firstName} {log.receiver?.lastName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {moment(log.createdAt).format(
                              "MMM D, YYYY • h:mm A",
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Tag
                          color={
                            log.status === "cancelled" ? "error" : "success"
                          }
                        >
                          {log.status}
                        </Tag>
                        <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                          {log.duration || "0s"}
                        </span>
                      </div>
                    </div>

                    {(log.startedAt || log.endedAt) && (
                      <div className="mt-3 flex flex-wrap gap-4 border-t border-gray-50 pt-3 text-xs text-gray-500">
                        {log.startedAt && (
                          <span>
                            Started: {moment(log.startedAt).format("h:mm:ss A")}
                          </span>
                        )}
                        {log.endedAt && (
                          <span>
                            Ended: {moment(log.endedAt).format("h:mm:ss A")}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ─── Refunds History (if any) ─── */}
          {/* ─── Refund History ─── */}
          {(isRefunded || hasRefunds) && (
            <section>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
                <RotateCcw className="h-4 w-4 text-gray-400" />
                Refund History
              </h3>

              {hasRefunds ? (
                <div className="space-y-3">
                  {transaction.refunds.map((refund, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-orange-100 bg-orange-50/50 p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Tag color="orange">Refunded</Tag>
                          <span className="text-base font-semibold text-gray-900">
                            ${Number(refund.amount || 0).toFixed(2)}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {refund.createdAt
                            ? moment(refund.createdAt).format(
                                "MMM D, YYYY • h:mm A",
                              )
                            : "—"}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-gray-700">
                        <span className="font-medium">Reason:</span>{" "}
                        {refund.reason || "—"}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-4 text-xs text-gray-500">
                        {refund.refundedBy && (
                          <span>
                            <span className="font-medium">By:</span>{" "}
                            {refund.refundedBy}
                          </span>
                        )}
                        {refund.status && (
                          <span>
                            <span className="font-medium">Status:</span>{" "}
                            {refund.status}
                          </span>
                        )}
                        {refund.stripeRefundId && (
                          <span>
                            <span className="font-medium">Stripe ID:</span>{" "}
                            {refund.stripeRefundId}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // status === "refunded" but refunds array empty
                <div className="rounded-xl border border-orange-100 bg-orange-50/40 p-4 text-sm text-gray-600">
                  This payment has been marked as{" "}
                  <Tag color="orange">refunded</Tag>
                  {Number(transaction.refundedAmount) > 0 && (
                    <span>
                      {" "}
                      — Amount:{" "}
                      <strong>
                        ${Number(transaction.refundedAmount).toFixed(2)}
                      </strong>
                    </span>
                  )}
                </div>
              )}
            </section>
          )}

          {/* ─── Refund Action ─── */}
          {canRefund && !showRefundForm && (
            <div className="flex justify-end border-t border-gray-100 pt-4">
              <Button
                type="primary"
                danger
                icon={<RotateCcw className="h-4 w-4" />}
                onClick={() => setShowRefundForm(true)}
                className="!inline-flex items-center gap-1.5"
              >
                Issue Refund
              </Button>
            </div>
          )}

          {/* ─── Refund Form ─── */}
          {canRefund && showRefundForm && (
            <section className="rounded-xl border border-red-100 bg-red-50/30 p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <RotateCcw className="h-4 w-4 text-red-500" />
                  Issue Refund
                </h3>
                <Button
                  type="text"
                  size="small"
                  onClick={() => {
                    setShowRefundForm(false);
                    form.resetFields();
                    setRefundType("full");
                  }}
                >
                  Cancel
                </Button>
              </div>

              <Form
                form={form}
                layout="vertical"
                onFinish={handleRefundSubmit}
                initialValues={{ type: "full" }}
                requiredMark={false}
              >
                <Form.Item
                  name="type"
                  label="Refund Type"
                  rules={[{ required: true, message: "Please select type" }]}
                >
                  <Select
                    onChange={(val) => {
                      setRefundType(val);
                      if (val === "full") {
                        form.setFieldValue("amount", undefined);
                      }
                    }}
                    options={[
                      { value: "full", label: "Full Refund" },
                      { value: "partial", label: "Partial Refund" },
                    ]}
                  />
                </Form.Item>

                {refundType === "partial" && (
                  <Form.Item
                    name="amount"
                    label="Refund Amount ($)"
                    rules={[
                      { required: true, message: "Please enter amount" },
                      {
                        type: "number",
                        min: 0.01,
                        message: "Amount must be greater than 0",
                      },
                      {
                        validator: (_, value) => {
                          const max = Number(transaction.amount || 0);
                          if (value != null && value > max) {
                            return Promise.reject(
                              new Error(
                                `Amount cannot exceed $${max.toFixed(2)}`,
                              ),
                            );
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <InputNumber
                      className="w-full"
                      min={0.01}
                      max={Number(transaction.amount || 0)}
                      step={0.01}
                      precision={2}
                      prefix="$"
                      placeholder="0.00"
                    />
                  </Form.Item>
                )}

                <Form.Item
                  name="reason"
                  label="Reason"
                  rules={[
                    { required: true, message: "Please provide a reason" },
                  ]}
                >
                  <TextArea
                    rows={3}
                    placeholder={
                      refundType === "full"
                        ? "e.g. Expert no-show"
                        : "e.g. Goodwill partial refund"
                    }
                  />
                </Form.Item>

                <div className="flex justify-end gap-3">
                  <Button
                    onClick={() => {
                      setShowRefundForm(false);
                      form.resetFields();
                      setRefundType("full");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    danger
                    htmlType="submit"
                    loading={isRefunding}
                  >
                    Submit Refund
                  </Button>
                </div>
              </Form>
            </section>
          )}
        </div>
      )}
    </Modal>
  );
}

// ─── Small helper ───
function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-400">{label}</p>
      <p className="mt-0.5 font-medium text-gray-900">{value || "—"}</p>
    </div>
  );
}
