"use client";

import FormWrapper from "@/components/Form/FormWrapper";
import UInput from "@/components/Form/UInput";
import { useUpdateProfileinfoMutation } from "@/redux/api/authApi";
import { Button } from "antd";
import toast from "react-hot-toast";

export default function EditProfileForm({ user, selectedImage }) {
  const [updateProfie, { isLoading }] = useUpdateProfileinfoMutation();
  const handleSubmit = async (data) => {
    try {
      const formData = new FormData();

      formData.append("data", JSON.stringify(data));
      if (selectedImage) {
        formData.append("image", selectedImage);
      }
      const res = await updateProfie(formData).unwrap();
      if (res.success) {
        toast.success("Profile Update Successfully");
      }
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  return (
    <section className="mt-5 w-full px-10">
      {/* <h4></h4> */}
      <FormWrapper
        onSubmit={handleSubmit}
        defaultValues={{
          firstName: user?.firstName,
          lastName: user?.lastName,
          email: user?.email,
          contractNumber: user?.contractNumber,
        }}
      >
        <UInput name="firstName" label="First Name" type="text" />
        <UInput name="lastName" label="Last Name" type="text" />
        <UInput name="email" label="Email" type="email" disabled />
        {/* <UInput name="contractNumber" label="Contract Number" type="text" /> */}

        <Button
          loading={isLoading}
          htmlType="submit"
          className="w-full"
          size="large"
          type="primary"
        >
          Save
        </Button>
      </FormWrapper>
    </section>
  );
}
