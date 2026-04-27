"use client";
import Image from "next/image";
import { ImagePlus } from "lucide-react";
import { Tabs } from "antd";
import { ConfigProvider } from "antd";
import ChangePassForm from "./ChangePassForm";
import EditProfileForm from "./EditProfileForm";
import { useState, useRef } from "react";
import userAvatar from "@/assets/images/user-avatar-lg.png";
import PrivacyPolicyContainer from "../../(settings)/privacy-policy/_components/PrivacyPolicyContainer";
import TermsConditionsContainer from "../../(settings)/terms-conditions/_components/TermsConditionsContainer";
import { useGetMyProfileQuery } from "@/redux/api/authApi";

const { TabPane } = Tabs;
/**
 * ProfileContainer
 *
 * A component that displays the profile information of an admin user.
 * It includes the profile picture, name, role, and two tabs for editing the profile and changing the password.
 *
 * @returns {JSX.Element} A JSX element representing the profile container.
 */

export default function ProfileContainer() {
  const { data } = useGetMyProfileQuery();
  const user = data?.data;

  // State to store the uploaded image
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1b71a7",
        },
      }}
    >
      <div className="mx-auto w-full px-5 lg:w-full lg:px-0 2xl:w-full">
        {/* Profile pic */}
        <section className="gap-x-3">
          <div className="relative w-max">
            <Image
              src={
                selectedImage
                  ? URL.createObjectURL(selectedImage)
                  : user?.photoUrl || userAvatar
              }
              alt="Admin avatar"
              width={1200}
              height={1200}
              className="border-primary-pink aspect-square h-auto w-[160px] rounded-full border-2 object-contain p-1 shadow-lg"
            />

            {/* Hidden file input */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />

            {/* Edit button */}
            <button
              onClick={triggerFileInput}
              className="flex-center absolute bottom-2 right-2 aspect-square rounded-full bg-[#2C50ED] p-2 text-white/95"
            >
              <ImagePlus size={20} />
            </button>
          </div>

          <div>
            <h3 className="text-3xl font-semibold">
              {user?.firstName + " " + user?.lastName}
            </h3>
            <p className="mt-1 text-sm font-medium text-primary-blue">
              Administrator
            </p>
            {/* <p>Selected Image: {selectedImage ? selectedImage.name : 'None'}</p> */}
          </div>
        </section>

        <hr className="my-5" />

        {/* Profile Information Forms */}
        {/* Profile Information Forms */}
        <section className="mb-10">
          <Tabs defaultActiveKey="editProfile" centered>
            <>
              <TabPane tab="Edit Profile" key="editProfile">
                <div className="flex-center mx-auto w-1/2 border-b pb-4">
                  <EditProfileForm user={user} selectedImage={selectedImage} />
                </div>
              </TabPane>

              <TabPane tab="Change Password" key="changePassword">
                <div className="flex-center mx-auto w-1/2 border-b pb-4">
                  <ChangePassForm />
                </div>
              </TabPane>
            </>
            <TabPane tab="Privacy Policy" key="privacyPolicy">
              <PrivacyPolicyContainer />
            </TabPane>
            <TabPane tab="Terms & Conditions" key="termsConditions">
              <TermsConditionsContainer />
            </TabPane>
          </Tabs>
        </section>
      </div>
    </ConfigProvider>
  );
}
