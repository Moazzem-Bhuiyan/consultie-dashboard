import FormWrapper from "@/components/Form/FormWrapper";
import UInput from "@/components/Form/UInput";
import {
  useGetGeneralSettingsQuery,
  useUpdateGeneralSettingsMutation,
} from "@/redux/api/contentApi";
import { Button, Modal, Spin } from "antd";
import React, { useMemo } from "react";
import toast from "react-hot-toast";

export default function UpdateGeneralSettingsModal({ open, setOpen }) {
  const { data, isLoading } = useGetGeneralSettingsQuery();
  const [updateContent, { isLoading: updating }] =
    useUpdateGeneralSettingsMutation();

  // Convert array → object
  const settings = useMemo(() => {
    if (!data?.data || !Array.isArray(data.data)) return {};
    return data.data.reduce((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {});
  }, [data]);

  const handleSubmit = async (values) => {
    const payload = {
      paymentHoldDays: Number(values.paymentHoldDays),
      platformFeePercentage: Number(values.platformFeePercentage),
      supportContract: values.supportContract,
      supportEmail: values.supportEmail,
      reschedulingTime: Number(values.reschedulingTime),
      cancellationTime: Number(values.cancellationTime),
    };

    try {
      const res = await updateContent({ payload }).unwrap();
      if (res?.success) {
        toast.success("Settings updatedd successfully");
        setOpen(false);
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update settings");
    }
  };

  return (
    <Modal
      centered
      open={open}
      footer={null}
      title="Update General Settings"
      onCancel={() => setOpen(false)}
      destroyOnClose
      width={520}
    >
      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Spin size="large" />
        </div>
      ) : (
        <FormWrapper
          onSubmit={handleSubmit}
          defaultValues={{
            paymentHoldDays: settings.paymentHoldDays ?? 0,
            platformFeePercentage: settings.platformFeePercentage ?? 0,
            supportContract: settings.supportContract ?? "",
            supportEmail: settings.supportEmail ?? "",
            reschedulingTime: settings.reschedulingTime ?? 0,
            cancellationTime: settings.cancellationTime ?? 0,
          }}
        >
          <UInput
            name="paymentHoldDays"
            label="Payment Hold Period (Days)"
            type="number"
            placeholder="Enter hold period in days"
          />

          <UInput
            name="platformFeePercentage"
            label="Platform Fee Percentage (%)"
            type="number"
            placeholder="Enter platform fee percentage"
          />

          <UInput
            name="supportContract"
            label="Support Contact Number"
            type="text"
            placeholder="Enter support contact number"
          />

          <UInput
            name="supportEmail"
            label="Support Email"
            type="email"
            placeholder="Enter support email"
          />

          <UInput
            name="reschedulingTime"
            label="Rescheduling Time (Minutes)"
            type="number"
            placeholder="Enter rescheduling time in minutes"
          />

          <UInput
            name="cancellationTime"
            label="Cancellation Time (Minutes)"
            type="number"
            placeholder="Enter cancellation time in minutes"
          />

          <Button
            htmlType="submit"
            className="w-full mt-2"
            size="large"
            type="primary"
            loading={updating}
          >
            Update Settings
          </Button>
        </FormWrapper>
      )}
    </Modal>
  );
}