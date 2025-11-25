"use client";

import FormWrapper from "@/components/Form/FormWrapper";
import UInput from "@/components/Form/UInput";
import {
  changePasswordSchema,
  editProfileSchema,
} from "@/schema/profileSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "antd";

export default function ChangePassForm() {
  const handleSubmit = (data) => {
    console.log(data);
  };

  return (
    <section className="mt-5 w-full px-10">
      {/* <h4></h4> */}
      <FormWrapper
        onSubmit={handleSubmit}
        resolver={zodResolver(changePasswordSchema)}
      >
        <UInput
          name="oldPassword"
          label="Old Password"
          type="password"
          placeholder="***********"
        />
        <UInput
          name="newPassword"
          label="New Password"
          type="password"
          placeholder="***********"
        />
        <UInput
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="***********"
        />

        <Button
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
