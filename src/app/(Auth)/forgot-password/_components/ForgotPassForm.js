"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPassSchema } from "@/schema/authSchema";
import FormWrapper from "@/components/Form/FormWrapper";
import UInput from "@/components/Form/UInput";
import { Button } from "antd";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import logo from "@/assets/images/logo.png";
import { useRouter } from "next/navigation";

export default function ForgotPassForm() {
  const router = useRouter();
  const onSubmit = (data) => {
    console.log(data);
    router.push("/otp-verification");
  };

  return (
    <div className="w-full rounded-md border bg-[#9CA2AE]/30 px-6 py-8">
      <Link
        href="/login"
        className="flex-center-start mb-4 gap-x-2 font-medium text-white hover:text-primary-blue/85"
      >
        <ArrowLeft size={18} /> Back to login
      </Link>

      <section className="mb-8 flex flex-col items-center justify-center space-y-2">
        {/* <Image src={logo} alt="logo" width={100} height={100} /> */}
        <h4 className="text-3xl font-semibold text-white">Forgot Password</h4>
        <p className="text-center text-white/90">
          Enter your email and we&apos;ll send you an otp for verification
        </p>
      </section>

      <FormWrapper onSubmit={onSubmit} resolver={zodResolver(forgotPassSchema)}>
        <UInput
          name="email"
          type="email"
          label="Email"
          labelStyles={{ fontWeight: "500", color: "white" }}
          placeholder="Enter your email"
          size="large"
          className="!h-10"
        />

        <Button
          type="primary"
          size="large"
          className="!h-10 w-full !font-semibold"
          htmlType="submit"
          style={{
            background: "linear-gradient(180deg, #D83578 0%, #962E84 100%)",
          }}
        >
          Submit
        </Button>
      </FormWrapper>
    </div>
  );
}
