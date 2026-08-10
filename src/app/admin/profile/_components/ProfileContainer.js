"use client";
import Image from "next/image";
import { ImagePlus, Copy, Check } from "lucide-react";
import { Tabs, message } from "antd";
import { ConfigProvider } from "antd";
import ChangePassForm from "./ChangePassForm";
import EditProfileForm from "./EditProfileForm";
import { useState, useRef } from "react";
import userAvatar from "@/assets/images/user-avatar-lg.png";
import { useGetMyProfileQuery } from "@/redux/api/authApi";

const { TabPane } = Tabs;

export default function ProfileContainer() {
  const { data, isLoading } = useGetMyProfileQuery();
  const user = data?.data;

  const [selectedImage, setSelectedImage] = useState(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleCopyReferral = async () => {
    if (!user?.referralCode) return;

    try {
      await navigator.clipboard.writeText(user.referralCode);
      setCopied(true);
      message.success("Referral code copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      message.error("Failed to copy");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1b71a7",
        },
      }}
    >
      <div className="mx-auto w-full px-5 lg:px-0">
        {/* ================= Profile Header ================= */}
        <section className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          {/* Avatar */}
          <div className="relative w-max">
            <Image
              src={
                selectedImage
                  ? URL.createObjectURL(selectedImage)
                  : user?.photoUrl || userAvatar
              }
              alt="Admin avatar"
              width={160}
              height={160}
              className="aspect-square h-[160px] w-[160px] rounded-full border-2 border-[#1b71a7] object-cover p-1 shadow-md"
            />

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />

            <button
              onClick={triggerFileInput}
              className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#2C50ED] text-white shadow-md transition hover:bg-[#1e3bb8]"
            >
              <ImagePlus size={18} />
            </button>
          </div>

          {/* Info */}
          <div className="space-y-2">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                {user?.firstName} {user?.lastName}
              </h3>
              <p className="mt-1 text-sm font-medium text-[#1b71a7]">
                Administrator
              </p>
            </div>

            <div className="space-y-1 text-sm text-gray-600">
              <p>
                <span className="font-medium text-gray-800">Email:</span>{" "}
                {user?.email || "N/A"}
              </p>
              <p>
                <span className="font-medium text-gray-800">User ID:</span>{" "}
                {user?.id || "N/A"}
              </p>
              <p>
                <span className="font-medium text-gray-800">Status:</span>{" "}
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    user?.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {user?.status || "N/A"}
                </span>
              </p>
            </div>

            {/* Referral Code */}
            <div className="mt-3 flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                <span className="text-sm text-gray-500">Referral Code:</span>
                <span className="font-mono text-sm font-semibold text-gray-800">
                  {user?.referralCode || "N/A"}
                </span>
              </div>

              <button
                onClick={handleCopyReferral}
                className="flex items-center gap-1.5 rounded-lg bg-[#c72a80] px-3 py-2 text-sm font-medium text-white transition hover:bg-[#c72a80]"
              >
                {copied ? (
                  <>
                    <Check size={16} />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        <hr className="my-8 border-gray-200" />

        {/* ================= Tabs ================= */}
        <section className="mb-10">
          <Tabs defaultActiveKey="editProfile" centered>
            <TabPane tab="Edit Profile" key="editProfile">
              <div className="mx-auto w-full max-w-xl border-b pb-6">
                <EditProfileForm user={user} selectedImage={selectedImage} />
              </div>
            </TabPane>

            <TabPane tab="Change Password" key="changePassword">
              <div className="mx-auto w-full max-w-xl border-b pb-6">
                <ChangePassForm />
              </div>
            </TabPane>
          </Tabs>
        </section>
      </div>
    </ConfigProvider>
  );
}