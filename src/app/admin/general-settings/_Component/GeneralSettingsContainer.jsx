"use client";

import FormWrapper from "@/components/Form/FormWrapper";
import UInput from "@/components/Form/UInput";

import {
  Button,
  Card,
  ConfigProvider,
  Divider,
  Modal,
  Spin,
  Table,
  Tag,
  Tooltip,
} from "antd";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { InfoCircleOutlined } from "@ant-design/icons";
import {
  useGetGeneralSettingsQuery,
  useGetSettingsLogsQuery,
  useUpdateGeneralSettingsMutation,
} from "@/redux/api/contentApi";

export default function GeneralSettingsContainer() {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState(null);
  const [logsPage, setLogsPage] = useState(1);

  // ===== APIs =====
  const { data, isLoading } = useGetGeneralSettingsQuery();
  const [updateContent, { isLoading: updating }] =
    useUpdateGeneralSettingsMutation();
  const { data: logsData, isLoading: logsLoading } = useGetSettingsLogsQuery({
    page: logsPage,
    limit: 10,
  });

  // Convert array → object
  const settings = useMemo(() => {
    if (!data?.data || !Array.isArray(data.data)) return {};
    return data.data.reduce((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {});
  }, [data]);

  // ===== Submit handlers =====
  const handleFormSubmit = (values) => {
    // Check if any sensitive financial field is being changed
    const isFinancialChanged =
      Number(values.paymentHoldDays) !== Number(settings.paymentHoldDays) ||
      Number(values.platformFeePercentage) !==
        Number(settings.platformFeePercentage);

    if (isFinancialChanged) {
      setPendingValues(values);
      setConfirmModalOpen(true);
    } else {
      performUpdate(values);
    }
  };

  const performUpdate = async (values) => {
    const payload = {
      paymentHoldDays: Number(values.paymentHoldDays),
      platformFeePercentage: Number(values.platformFeePercentage),
      supportEmail: values.supportEmail,
      consulteeReschedulingTime: Number(values.consulteeReschedulingTime),
      expertReschedulingTime: Number(values.expertReschedulingTime),
      consulteeCancellationTime: Number(values.consulteeCancellationTime),
      expertCancellationTime: Number(values.expertCancellationTime),
    };

    try {
      const res = await updateContent({ payload }).unwrap();
      if (res?.success) {
        toast.success(res.message || "Settings updated successfully");
        setEditModalOpen(false);
        setConfirmModalOpen(false);
        setPendingValues(null);
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update settings");
    }
  };

  // ===== Logs table columns =====
  const logsColumns = [
    {
      title: "Setting Key",
      dataIndex: "key",
      render: (val) => (
        <Tag color="blue" className="capitalize">
          {val?.replace(/([A-Z])/g, " $1").trim()}
        </Tag>
      ),
    },
    {
      title: "Previous",
      dataIndex: "previousValue",
      render: (val) => <span className="font-medium text-red-500">{val}</span>,
    },
    {
      title: "New Value",
      dataIndex: "newValue",
      render: (val) => (
        <span className="font-medium text-green-600">{val}</span>
      ),
    },
    {
      title: "Changed By",
      render: (_, record) => (
        <div>
          <p className="font-medium">
            {record.changedBy?.firstName} {record.changedBy?.lastName}
          </p>
          <p className="text-xs text-gray-500">{record.changedBy?.email}</p>
        </div>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      render: (val) => dayjs(val).format("DD MMM YYYY, hh:mm A"),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1B70A6",
        },
      }}
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              General Settings
            </h1>
            <p className="text-sm text-gray-500">
              Manage platform fees, hold periods, cancellation & rescheduling
              policies
            </p>
          </div>
          <Button
            type="primary"
            size="large"
            onClick={() => setEditModalOpen(true)}
          >
            Edit Settings
          </Button>
        </div>

        {/* ================= FINANCIAL SETTINGS ================= */}
        <Card
          title={
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">
                💰 Financial Settings
              </span>
              <Tooltip title="These settings affect payouts and platform revenue. Changes require confirmation.">
                <InfoCircleOutlined className="text-orange-500" />
              </Tooltip>
            </div>
          }
          className="shadow-sm"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Payment Hold Days */}
            <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">
                    Payment Hold Period
                  </p>
                  <p className="mt-1 text-3xl font-bold text-gray-900">
                    {settings.paymentHoldDays ?? "-"}{" "}
                    <span className="text-base font-normal text-gray-500">
                      days
                    </span>
                  </p>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-gray-600">
                <strong>Hold Period:</strong> Funds are held by the platform and
                released to the expert’s available balance for withdrawal based
                on Stripe&apos;s payout terms.
              </p>
            </div>

            {/* Platform Fee */}
            <div className="rounded-xl border border-orange-100 bg-orange-50/50 p-5">
              <p className="text-sm font-medium text-orange-700">
                Platform Fee Percentage
              </p>
              <p className="mt-1 text-3xl font-bold text-gray-900">
                {settings.platformFeePercentage ?? "-"}%
              </p>
              <p className="mt-3 text-xs leading-relaxed text-gray-600">
                Percentage of each booking that is deducted as platform
                commission (before VAT).
              </p>
            </div>
          </div>
        </Card>

        {/* ================= CANCELLATION & RESCHEDULING ================= */}
        <Card
          title={
            <span className="text-lg font-semibold">
              ⏱️ Cancellation & Rescheduling Windows
            </span>
          }
          className="shadow-sm"
        >
          <div className="mb-4 rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
            <p className="font-medium">Policy Notes:</p>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              <li>
                <strong>Cancellation Window:</strong> Cancellations are strictly
                prohibited inside this timeframe and must be made before this
                window opens.
              </li>
              <li>
                <strong>Rescheduling Window:</strong> Rescheduling is strictly
                not allowed within this restricted period prior to the session
                start time.
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Consultee Cancellation */}
            <div className="rounded-xl border p-4">
              <p className="text-sm text-gray-500">
                Consultee Cancellation Time
              </p>
              <p className="text-2xl font-bold">
                {settings.consulteeCancellationTime ?? "-"} min
              </p>
              <p className="mt-2 text-xs text-gray-500">
                Minimum advance notice required before the scheduled session
                start time to allow a cancellation (for consultees).
              </p>
            </div>

            {/* Expert Cancellation */}
            <div className="rounded-xl border p-4">
              <p className="text-sm text-gray-500">Expert Cancellation Time</p>
              <p className="text-2xl font-bold">
                {settings.expertCancellationTime ?? "-"} min
              </p>
              <p className="mt-2 text-xs text-gray-500">
                Minimum advance notice required before the scheduled session
                start time to allow a cancellation (for experts).
              </p>
            </div>

            {/* Consultee Rescheduling */}
            <div className="rounded-xl border p-4">
              <p className="text-sm text-gray-500">
                Consultee Rescheduling Time
              </p>
              <p className="text-2xl font-bold">
                {settings.consulteeReschedulingTime ?? "-"} min
              </p>
              <p className="mt-2 text-xs text-gray-500">
                Rescheduling is not allowed within this period prior to session
                start (consultees).
              </p>
            </div>

            {/* Expert Rescheduling */}
            <div className="rounded-xl border p-4">
              <p className="text-sm text-gray-500">Expert Rescheduling Time</p>
              <p className="text-2xl font-bold">
                {settings.expertReschedulingTime ?? "-"} min
              </p>
              <p className="mt-2 text-xs text-gray-500">
                Rescheduling is not allowed within this period prior to session
                start (experts).
              </p>
            </div>
          </div>
        </Card>

        {/* ================= SUPPORT ================= */}
        <Card
          title={
            <span className="text-lg font-semibold">📞 Support Contact</span>
          }
          className="shadow-sm"
        >
          <div className="rounded-xl border p-5">
            <p className="text-sm text-gray-500">Support Email</p>
            <p className="text-xl font-semibold text-gray-900">
              {settings.supportEmail || "-"}
            </p>
          </div>
        </Card>

        {/* ================= SETTINGS LOGS ================= */}
        <Card
          title={
            <span className="text-lg font-semibold">
              📋 Settings Change Logs
            </span>
          }
          className="shadow-sm"
        >
          <Table
            loading={logsLoading}
            columns={logsColumns}
            dataSource={logsData?.data?.map((item) => ({
              ...item,
              keys: item._id,
              key: item?.key,
            }))}
            pagination={{
              total: logsData?.meta?.total || 0,
              current: logsPage,
              pageSize: 10,
              onChange: (page) => setLogsPage(page),
              showTotal: (total) => `Total ${total} logs`,
              showSizeChanger: false,
            }}
            scroll={{ x: 800 }}
          />
        </Card>
      </div>

      {/* ================= EDIT MODAL ================= */}
      <Modal
        centered
        open={editModalOpen}
        footer={null}
        title="Update General Settings"
        onCancel={() => setEditModalOpen(false)}
        destroyOnClose
        width={760}
      >
        <FormWrapper
          onSubmit={handleFormSubmit}
          defaultValues={{
            paymentHoldDays: settings.paymentHoldDays ?? 0,
            platformFeePercentage: settings.platformFeePercentage ?? 0,
            supportEmail: settings.supportEmail ?? "",
            consulteeReschedulingTime: settings.consulteeReschedulingTime ?? 0,
            expertReschedulingTime: settings.expertReschedulingTime ?? 0,
            consulteeCancellationTime: settings.consulteeCancellationTime ?? 0,
            expertCancellationTime: settings.expertCancellationTime ?? 0,
          }}
        >
          {/* Financial Section */}
          <Divider orientation="left" className="!text-sm !font-semibold">
            Financial Settings
          </Divider>

          <UInput
            name="paymentHoldDays"
            label="Payment Hold Period (Days)"
            type="number"
            placeholder="e.g. 7"
            rules={{
              required: "Payment hold period is required",
              min: {
                value: 0,
                message: "Hold period cannot be negative",
              },
              max: {
                value: 30,
                message: "Hold period cannot be more than 30 days",
              },
            }}
          />
          <p className="-mt-3 mb-4 text-xs text-gray-500">
            Funds are held by the platform and released to the expert’s
            available balance based on Stripe&apos;s payout terms. (Max 30 days)
          </p>

          <UInput
            name="platformFeePercentage"
            label="Platform Fee Percentage (%)"
            type="number"
            placeholder="e.g. 10"
            rules={{
              required: "Platform fee percentage is required",
              min: {
                value: 0,
                message: "Platform fee cannot be negative",
              },
              max: {
                value: 100,
                message: "Platform fee cannot be more than 100%",
              },
            }}
          />

          {/* Cancellation & Rescheduling */}
          <Divider orientation="left" className="!text-sm !font-semibold">
            Cancellation & Rescheduling
          </Divider>

          <div className="mb-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
            <p>
              <strong>Cancellation Window:</strong> Cancellations are strictly
              prohibited inside this timeframe and must be made before this
              window opens.
            </p>
            <p className="mt-1">
              <strong>Rescheduling Window:</strong> Rescheduling is strictly not
              allowed within this restricted period prior to the session start
              time.
            </p>
          </div>

          <UInput
            name="consulteeCancellationTime"
            label="Consultee Cancellation Time (Minutes)"
            type="number"
            placeholder="e.g. 20"
            rules={{
              required: "Consultee cancellation time is required",
              min: {
                value: 0,
                message: "Value cannot be negative",
              },
              max: {
                value: 60,
                message: "Maximum allowed is 60 minutes",
              },
            }}
          />
          <p className="-mt-3 mb-3 text-xs text-gray-500">
            Minimum advance notice required before session start for consultees
            to cancel. (Max 60 min)
          </p>

          <UInput
            name="expertCancellationTime"
            label="Expert Cancellation Time (Minutes)"
            type="number"
            placeholder="e.g. 40"
            rules={{
              required: "Expert cancellation time is required",
              min: {
                value: 0,
                message: "Value cannot be negative",
              },
              max: {
                value: 60,
                message: "Maximum allowed is 60 minutes",
              },
            }}
          />
          <p className="-mt-3 mb-3 text-xs text-gray-500">
            Minimum advance notice required before session start for experts to
            cancel. (Max 60 min)
          </p>

          <UInput
            name="consulteeReschedulingTime"
            label="Consultee Rescheduling Time (Minutes)"
            type="number"
            placeholder="e.g. 50"
            rules={{
              required: "Consultee rescheduling time is required",
              min: {
                value: 0,
                message: "Value cannot be negative",
              },
              max: {
                value: 60,
                message: "Maximum allowed is 60 minutes",
              },
            }}
          />
          <p className="-mt-3 mb-3 text-xs text-gray-500">Max 60 minutes</p>

          <UInput
            name="expertReschedulingTime"
            label="Expert Rescheduling Time (Minutes)"
            type="number"
            placeholder="e.g. 60"
            rules={{
              required: "Expert rescheduling time is required",
              min: {
                value: 0,
                message: "Value cannot be negative",
              },
              max: {
                value: 60,
                message: "Maximum allowed is 60 minutes",
              },
            }}
          />
          <p className="-mt-3 mb-3 text-xs text-gray-500">Max 60 minutes</p>

          {/* Support */}
          <Divider orientation="left" className="!text-sm !font-semibold">
            Support Contact
          </Divider>

          <UInput
            name="supportEmail"
            label="Support Email"
            type="email"
            placeholder="info@example.com"
            rules={{
              required: "Support email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Please enter a valid email address",
              },
            }}
          />

          <Button
            htmlType="submit"
            className="mt-4 w-full"
            size="large"
            type="primary"
            loading={updating}
          >
            Save Changes
          </Button>
        </FormWrapper>
      </Modal>

      {/* ================= CONFIRMATION MODAL (Financial fields) ================= */}
      <Modal
        centered
        open={confirmModalOpen}
        title="⚠️ Confirm Financial Settings Change"
        onCancel={() => {
          setConfirmModalOpen(false);
          setPendingValues(null);
        }}
        onOk={() => performUpdate(pendingValues)}
        okText="Yes, Update"
        okButtonProps={{ danger: true, loading: updating }}
        cancelText="Cancel"
        style={{ zIndex: "10" }}
      >
        <div className="space-y-3 text-sm">
          <p className="text-gray-700">
            You are about to change sensitive financial settings. This may
            affect ongoing payouts and platform revenue calculations.
          </p>

          {pendingValues && (
            <div className="rounded-lg bg-red-50 p-4 text-sm">
              <p>
                <strong>Payment Hold Days:</strong> {settings.paymentHoldDays} →{" "}
                <span className="font-bold text-red-600">
                  {pendingValues.paymentHoldDays}
                </span>
              </p>
              <p className="mt-1">
                <strong>Platform Fee %:</strong>{" "}
                {settings.platformFeePercentage}% →{" "}
                <span className="font-bold text-red-600">
                  {pendingValues.platformFeePercentage}%
                </span>
              </p>
            </div>
          )}

          <p className="text-gray-600">Are you sure you want to proceed?</p>
        </div>
      </Modal>
    </ConfigProvider>
  );
}
