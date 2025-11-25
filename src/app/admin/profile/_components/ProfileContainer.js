import Image from "next/image";
import adminImg from "@/assets/images/user-avatar-lg.png";
import { ImagePlus } from "lucide-react";

import { Tabs } from "antd";
import { ConfigProvider } from "antd";
import ChangePassForm from "./ChangePassForm";
import EditProfileForm from "./EditProfileForm";
import PrivacyPolicyContainer from "../../(settings)/privacy-policy/_components/PrivacyPolicyContainer";
import TermsConditionsContainer from "../../(settings)/terms-conditions/_components/TermsConditionsContainer";

const { TabPane } = Tabs;

export default function ProfileContainer() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1b71a7",
        },
      }}
    >
      <div className="mx-auto w-full px-5 lg:w-3/4 lg:px-0 2xl:w-full">
        {/* Profile pic */}
        <section className="gap-x-3">
          <div className="relative w-max">
            <Image
              src={adminImg}
              alt="Admin avatar"
              width={1200}
              height={1200}
              className="aspect-square h-auto w-[100px] rounded-full border-2 border-[#962E84] p-1"
            />

            {/* Edit button */}
            <button className="flex-center absolute bottom-1 right-2 aspect-square rounded-full bg-[#D83578] p-2 text-white/95">
              <ImagePlus size={20} />
            </button>
          </div>

          <div>
            <h3 className="text-xl font-semibold">Moazzem</h3>
            <p className="mt-1 text-lg font-medium text-primary-blue">
              Administrator
            </p>
          </div>
        </section>

        {/* Profile Information Forms */}
        <section className="mb-10">
          <Tabs defaultActiveKey="editProfile" centered>
            <>
              <TabPane tab="Edit Profile" key="editProfile">
                <div className="flex-center mx-auto w-1/2 border-b pb-4">
                  <EditProfileForm />
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
