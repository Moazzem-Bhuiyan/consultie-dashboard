"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schema/authSchema";
import FormWrapper from "@/components/Form/FormWrapper";
import UInput from "@/components/Form/UInput";
import { Button } from "antd";
import { useRouter } from "next/navigation";
import logo from "@/assets/images/logo.png";
import Image from "next/image";

export default function LoginForm() {
  const router = useRouter();

  const onLoginSubmit = (data) => {
    console.log(data);

    router.push("/admin/dashboard");
  };

  return (
    <div className="w-full rounded-md border bg-[#222222]/70 px-6 py-28 shadow-none shadow-primary-blue/10">
      <section className="mb-8 flex flex-col items-center justify-center space-y-2">
        {/* <Image src={logo} alt="logo" width={100} height={100} /> */}
        <h4 className="text-3xl font-semibold text-white">
          Welcome to Consultancy!
        </h4>
        <p className="text-center text-white/90">Sign in to your account</p>
      </section>

      <FormWrapper onSubmit={onLoginSubmit} resolver={zodResolver(loginSchema)}>
        <UInput
          name="email"
          type="email"
          label="Email"
          placeholder="Enter your email"
          size="large"
          className="!h-10"
          labelStyles={{ fontWeight: "500", color: "white" }}
        />

        <UInput
          name="password"
          label="Password"
          type="password"
          placeholder="*************"
          size="large"
          className="!mb-0 !h-10"
          labelStyles={{ fontWeight: "500", color: "white" }}
        />

        <Button
          htmlType="submit"
          type="primary"
          size="large"
          className="!h-10 w-full !font-semibold"
          style={{
            background: "linear-gradient(180deg, #D83578 0%, #962E84 100%)",
          }}
        >
          Log In
        </Button>

        <Link
          href="/forgot-password"
          className="mt-2 block text-center font-medium text-white hover:text-primary-blue/85"
        >
          I forgot my password
        </Link>
      </FormWrapper>
    </div>
  );
}
