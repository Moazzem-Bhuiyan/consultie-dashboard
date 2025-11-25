"use client";

import "./Sidebar.css";
import logo from "@/assets/logos/logoforsideber.png";
import { Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import {
  Album,
  ArrowRightLeft,
  ChartSpline,
  CircleDollarSign,
  DollarSign,
  MessageSquareMore,
  Plus,
  ShoppingCart,
  StepForward,
} from "lucide-react";
import { Shapes } from "lucide-react";
import { ScrollText } from "lucide-react";
import { LogOut } from "lucide-react";
import { SlidersVertical } from "lucide-react";
import { CircleUser } from "lucide-react";
import { House } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { RiFeedbackFill, RiFeedbackLine } from "react-icons/ri";

const SidebarContainer = ({ collapsed }) => {
  // const dispatch = useDispatch();
  const router = useRouter();

  // Logout handler
  const onClick = (e) => {
    // if (e.key === "logout") {
    //   dispatch(logout());
    //   router.refresh();
    //   router.push("/login");

    //   Success_model({ title: "Logout successful" });
    // }
    console.log("logout success");
  };

  const navLinks = [
    {
      key: "dashboard",
      icon: <House size={21} strokeWidth={2} />,
      label: <Link href={"/admin/dashboard"}>Dashboard</Link>,
    },
    {
      key: "account-details",
      icon: <CircleUser size={21} strokeWidth={2} />,
      label: <Link href={"/admin/account-details"}>Accounts Details</Link>,
    },
    // {
    //   key: "Schedules-check",
    //   icon: <Album size={21} strokeWidth={2} />,
    //   label: <Link href={"/admin/schedules-check"}>Schedules check</Link>,
    // },

    {
      key: "contentmoderation",
      icon: <StepForward size={21} strokeWidth={2} />,
      label: <Link href={"/admin/content-moderation"}>Content Moderation</Link>,
    },
    {
      key: "analytics-reporting",
      icon: <ChartSpline size={21} strokeWidth={2} />,
      label: (
        <Link href={"/admin/analytics-reporting"}>Analytics & Reporting</Link>
      ),
    },
    {
      key: "Payment-&-Transaction",
      icon: <ArrowRightLeft size={21} strokeWidth={2} />,
      label: (
        <Link href={"/admin/payment-&-transaction"}>Payment & Transaction</Link>
      ),
    },

    {
      key: "feedbacks",
      icon: <RiFeedbackLine size={21} strokeWidth={2} />,
      label: <Link href={"/admin/complain"}>Complain</Link>,
    },
    {
      key: "withdrawals",
      icon: <CircleDollarSign size={21} strokeWidth={2} />,
      label: <Link href={"/admin/withdrawals-management"}>Withdrawals</Link>,
    },
    {
      key: "categories",
      icon: <Shapes size={21} strokeWidth={2} />,
      label: <Link href={"/admin/category"}>Categories</Link>,
    },
    // {
    //   key: "subscriptions",
    //   icon: <CircleDollarSign size={21} strokeWidth={2} />,
    //   label: <Link href={"/admin/manage-subscription"}>Subscriptions</Link>,
    // },
    // {
    //   key: "settings",
    //   icon: <SlidersVertical size={21} strokeWidth={2} />,
    //   label: "Settings",
    //   children: [
    //     {
    //       key: "privacy-policy",
    //       icon: <ScrollText size={21} strokeWidth={2} />,
    //       label: <Link href="/admin/privacy-policy">Privacy Policy</Link>,
    //     },
    //     {
    //       key: "terms-conditions",
    //       icon: <ScrollText size={21} strokeWidth={2} />,
    //       label: <Link href="/admin/terms-conditions">Terms & Conditions</Link>,
    //     },
    //   ],
    // },

    {
      key: "logout",
      icon: <LogOut size={21} strokeWidth={2} />,
      label: <Link href="/login">Logout</Link>,
    },
  ];

  // Get current path for sidebar menu item `key`
  const currentPathname = usePathname()?.replace("/admin/", "")?.split(" ")[0];

  return (
    <Sider
      width={320}
      theme="light"
      trigger={null}
      collapsible
      collapsed={collapsed}
      style={{
        paddingInline: `${!collapsed ? "10px" : "4px"}`,
        paddingBlock: "30px",
        backgroundColor: "#000000",
        maxHeight: "100vh",
        overflow: "auto",
      }}
      className="scroll-hide"
    >
      <div className="mb-6 flex flex-col items-center justify-center gap-y-5">
        <Link href={"/"}>
          {collapsed ? (
            // Logo small
            <Image
              src={logo}
              alt="Logo Of Before After Story"
              className="h-4 w-auto"
            />
          ) : (
            <Image
              width={2000}
              height={2000}
              src={logo}
              alt="Logo Of Before After Story"
              className="h-30 w-auto"
            />
          )}
        </Link>
      </div>

      <Menu
        onClick={onClick}
        defaultSelectedKeys={[currentPathname]}
        mode="inline"
        className="sidebar-menu space-y-2.5 !border-none !bg-transparent"
        items={navLinks}
      />
    </Sider>
  );
};

export default SidebarContainer;
