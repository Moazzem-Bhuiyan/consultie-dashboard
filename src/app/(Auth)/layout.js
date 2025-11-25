import Image from "next/image";
import React from "react";
import backgroundImage from "@/assets/images/authsidebar.png";
import logo from "@/assets/logos/logoforsideber.png";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen w-full bg-black py-8">
      <div
        className="bg-cover bg-center"
        // style={{ backgroundImage: `url(${backgroundImage?.src})` }}
      >
        <div className="mx-auto flex h-screen w-full justify-between px-4 py-8 md:px-8 lg:px-16">
          <div className="hidden flex-col items-center justify-center gap-[70px] md:block lg:flex lg:w-full">
            <Image src={logo} alt="Auth Side Image" className="" />
            <Image
              src={backgroundImage}
              alt="Auth Side Image"
              width={5000}
              height={5000}
              className="max-w-md"
            />
            <div className="space-y-4 text-center">
              <h1 className="text-5xl font-bold text-white">
                The Future of Consultancy
              </h1>
              <p className="text-xl font-bold text-white">
                Connecting you with the experts in every field, ready to bring
                your dream to life.
              </p>
            </div>
          </div>
          <div className="flex w-full items-center justify-center">
            <div className="w-2/3">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
