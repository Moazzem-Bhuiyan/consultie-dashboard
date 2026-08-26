"use client";

import { useState } from "react";
import {
  useGetPointManagementQuery,
  useUpdatePointManagementMutation,
} from "@/redux/api/pointmanageApi";
import {
  Modal,
  Select,
  Input,
  InputNumber,
  Button,
  Tag,
  Spin,
  Empty,
  Avatar,
} from "antd";
import { Plus, Minus, History } from "lucide-react";
import moment from "moment";
import toast from "react-hot-toast"; // or sonner – match your project

const { TextArea } = Input;

export default function PointMangementModal({ open, setOpen, selectedUser }) {
  const [form, setForm] = useState({
    type: "credit",
    points: null,
    reason: "",
  });

  const { data, isLoading, isFetching } = useGetPointManagementQuery(
    { id: selectedUser?.id },
    { skip: !selectedUser?.id || !open },
  );

  const [updatePointManagement, { isLoading: isUpdating }] =
    useUpdatePointManagementMutation();

  const logs = data?.data || [];
  const meta = data?.meta;

  // Current points from latest log user object (or selectedUser fallback)
  const currentPoints = logs[0]?.user?.points ?? selectedUser?.points ?? 0;

  const userInfo = logs[0]?.user || {
    firstName: selectedUser?.name?.split(" ")[0],
    lastName: selectedUser?.name?.split(" ").slice(1).join(" "),
    email: selectedUser?.email,
    photoUrl: selectedUser?.userImg,
    role: selectedUser?.role,
  };

  const handleUpdate = async () => {
    if (!form.points || form.points <= 0) {
      toast.error("Please enter a valid points amount");
      return;
    }
    if (!form.reason.trim()) {
      toast.error("Please enter a reason");
      return;
    }

    try {
      await updatePointManagement({
        id: selectedUser?.id,
        data: {
          type: form.type,
          points: form.points,
          reason: form.reason.trim(),
        },
      }).unwrap();

      toast.success(
        `Successfully ${form.type === "credit" ? "added" : "deducted"} ${form.points} points`,
      );
      setForm({ type: "credit", points: null, reason: "" });
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update points");
    }
  };

  const handleClose = () => {
    setForm({ type: "credit", points: null, reason: "" });
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      width={820}
      centered
      destroyOnClose
      title={null}
    >
      <div className="overflow-hidden">
        {/* Header */}
        <div className="rounded-xl bg-gradient-to-r from-[#1b71a7] to-[#962E84] px-6 py-5 text-white">
          <h2 className="text-xl font-bold">Point Management</h2>
          <p className="mt-0.5 text-sm text-white/80">
            View history and adjust user points
          </p>
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Spin size="large" />
          </div>
        ) : (
          <div className="p-6">
            {/* User + Current Points */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="flex items-center gap-3">
                <Avatar
                  src={userInfo?.photoUrl}
                  size={48}
                  className="border-2 border-white shadow"
                >
                  {userInfo?.firstName?.[0]}
                </Avatar>
                <div>
                  <p className="font-semibold text-gray-900">
                    {userInfo?.firstName} {userInfo?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{userInfo?.email}</p>
                  <Tag className="mt-1 capitalize" color="blue">
                    {userInfo?.role}
                  </Tag>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Current Points
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {currentPoints}
                </p>
              </div>
            </div>

            {/* Update Form */}
            <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-600">
                <Plus className="h-4 w-4" />
                Adjust Points
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Type
                  </label>
                  <Select
                    value={form.type}
                    onChange={(value) =>
                      setForm((prev) => ({ ...prev, type: value }))
                    }
                    className="w-full"
                    size="large"
                    options={[
                      {
                        value: "credit",
                        label: (
                          <span className="flex items-center gap-2 text-green-600">
                            <Plus className="h-4 w-4" /> Credit (Add)
                          </span>
                        ),
                      },
                      {
                        value: "debit",
                        label: (
                          <span className="flex items-center gap-2 text-red-600">
                            <Minus className="h-4 w-4" /> Debit (Deduct)
                          </span>
                        ),
                      },
                    ]}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Points
                  </label>
                  <InputNumber
                    min={1}
                    value={form.points}
                    onChange={(value) =>
                      setForm((prev) => ({ ...prev, points: value }))
                    }
                    placeholder="e.g. 100"
                    className="!w-full"
                    size="large"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Reason
                </label>
                <TextArea
                  value={form.reason}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, reason: e.target.value }))
                  }
                  placeholder="e.g. Manual correction"
                  rows={2}
                  className="rounded-lg"
                />
              </div>

              <Button
                type="primary"
                size="large"
                loading={isUpdating}
                onClick={handleUpdate}
                className={`mt-4 w-full rounded-xl font-medium ${
                  form.type === "credit"
                    ? "!bg-green-600 hover:!bg-green-700"
                    : "!bg-red-600 hover:!bg-red-700"
                }`}
              >
                {isUpdating
                  ? "Updating..."
                  : form.type === "credit"
                    ? `Add ${form.points || 0} Points`
                    : `Deduct ${form.points || 0} Points`}
              </Button>
            </div>

            {/* Points Log History */}
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-600">
                <History className="h-4 w-4" />
                Points History
                {meta?.total != null && (
                  <span className="ml-1 font-normal text-gray-400">
                    ({meta.total})
                  </span>
                )}
              </h3>

              {isFetching && !isLoading ? (
                <div className="flex justify-center py-6">
                  <Spin />
                </div>
              ) : logs.length === 0 ? (
                <Empty
                  description="No point logs yet"
                  className="py-8"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ) : (
                <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
                  {logs.map((log) => (
                    <div
                      key={log._id}
                      className={`flex items-start justify-between gap-3 rounded-xl border p-4 ${
                        log.type === "credit"
                          ? "border-green-100 bg-green-50/50"
                          : "border-red-100 bg-red-50/50"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Tag
                            color={log.type === "credit" ? "success" : "error"}
                            className="m-0 capitalize"
                          >
                            {log.type}
                          </Tag>
                          <span
                            className={`text-lg font-bold ${
                              log.type === "credit"
                                ? "text-green-700"
                                : "text-red-700"
                            }`}
                          >
                            {log.type === "credit" ? "+" : "-"}
                            {log.points}
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-gray-700">
                          {log.reason || "—"}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                          <span>
                            Source:{" "}
                            <span className="font-medium text-gray-600">
                              {log.source?.replace(/_/g, " ") || "—"}
                            </span>
                          </span>
                          <span>
                            {moment(log.createdAt).format(
                              "MMM D, YYYY • h:mm A",
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
