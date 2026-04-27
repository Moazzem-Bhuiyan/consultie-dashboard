import FormWrapper from "@/components/Form/FormWrapper";
import UInput from "@/components/Form/UInput";
import {
  useGetContentsQuery,
  useUpdateContentMutation,
} from "@/redux/api/contentApi";
import { Button, Modal, Spin } from "antd";
import React from "react";
import toast from "react-hot-toast";

export default function UpdateHoldPeriodModal({ open, setOpen }) {
  // get existing hold period and minimum consultation fee from api and set as default value in form
  const { data, isLoading } = useGetContentsQuery();

  const [updateContent, { isLoading: updating }] = useUpdateContentMutation();
  const handleSubmit = async (values) => {
    const payload = {
      paymentHoldDays: Number(values.paymentHoldDays),
      consultationFee: Number(values.consultationFee),
    };
    try {
      const res = await updateContent(payload).unwrap();
      if (res.success) {
        toast.success("Hold Period Updated Successfully");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update hold period");
    }
  };
  return (
    <div>
      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Spin size="large" />
        </div>
      ) : (
        <Modal
          centered
          open={open}
          setOpen={setOpen}
          footer={null}
          title="Update Hold Period"
          onCancel={() => {
            setOpen(false);
          }}
        >
          <FormWrapper
            onSubmit={handleSubmit}
            defaultValues={{
              paymentHoldDays: data?.data?.paymentHoldDays || 0,
              consultationFee: data?.data?.consultationFee || 0,
            }}
          >
            <UInput
              name="paymentHoldDays"
              label="Hold Period (in days)"
              type="number"
              placeholder="Enter hold period in days"
            />
            <UInput
              name="consultationFee"
              label="Set Minimum consultation fee "
              type="number"
              placeholder="Enter minimum consultation fee"
            />

            <Button
              htmlType="submit"
              className="w-full"
              size="large"
              type="primary"
              loading={updating}
            >
              Update
            </Button>
          </FormWrapper>
        </Modal>
      )}
    </div>
  );
}
