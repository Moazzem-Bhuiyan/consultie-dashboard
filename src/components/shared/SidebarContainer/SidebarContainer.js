"use client";

import "./Sidebar.css";
import logo from "@/assets/logos/logoforsideber.png";
import { logout } from "@/redux/features/authSlice";
import { Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import {
  House,
  Users,
  CalendarCheck,
  ShieldCheck,
  ArrowRightLeft,
  Wallet,
  Settings,
  Shapes,
  FileText,
  Lock,
  LogOut,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

const SidebarContainer = ({ collapsed }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      dispatch(logout());
      router.push("/login");
      toast.success("Logged out successfully");
    }
  };

  const navLinks = [
    {
      key: "dashboard",
      icon: <House size={20} strokeWidth={2} />,
      label: <Link href="/admin/dashboard">Dashboard</Link>,
    },
    {
      key: "account-details",
      icon: <Users size={20} strokeWidth={2} />,
      label: <Link href="/admin/account-details">Accounts</Link>,
    },
    {
      key: "booking-details",
      icon: <CalendarCheck size={20} strokeWidth={2} />,
      label: <Link href="/admin/booking-details">Bookings</Link>,
    },
    {
      key: "content-moderation",
      icon: <ShieldCheck size={20} strokeWidth={2} />,
      label: <Link href="/admin/content-moderation">Content Moderation</Link>,
    },
    {
      key: "payment-&-transaction",
      icon: <ArrowRightLeft size={20} strokeWidth={2} />,
      label: <Link href="/admin/payment-&-transaction">Payments</Link>,
    },
    {
      key: "withdrawals-management",
      icon: <Wallet size={20} strokeWidth={2} />,
      label: <Link href="/admin/withdrawals-management">Withdrawals</Link>,
    },
    {
      key: "general-settings",
      icon: <Settings size={20} strokeWidth={2} />,
      label: <Link href="/admin/general-settings">Settings</Link>,
    },
    {
      key: "category",
      icon: <Shapes size={20} strokeWidth={2} />,
      label: <Link href="/admin/category">Categories</Link>,
    },
    {
      key: "terms-conditions",
      icon: <FileText size={20} strokeWidth={2} />,
      label: <Link href="/admin/terms-conditions">Terms & Conditions</Link>,
    },
    {
      key: "privacy-policy",
      icon: <Lock size={20} strokeWidth={2} />,
      label: <Link href="/admin/privacy-policy">Privacy Policy</Link>,
    },
    {
      key: "logout",
      icon: <LogOut size={20} strokeWidth={2} />,
      label: "Logout",
    },
  ];

  // Get the active menu key from the current path
  const selectedKey =
    navLinks.find((item) => pathname?.includes(item.key))?.key || "dashboard";

  return (
    <Sider
      width={300}
      theme="light"
      trigger={null}
      collapsible
      collapsed={collapsed}
      style={{
        paddingInline: collapsed ? 8 : 12,
        paddingBlock: 24,
        backgroundColor: "#000000",
        maxHeight: "100vh",
        overflow: "auto",
      }}
      className="scroll-hide"
    >
      {/* Logo */}
      <div className="mb-8 flex items-center justify-center">
        <Link href="/">
          <Image
            src={logo}
            alt="Logo"
            width={collapsed ? 40 : 160}
            height={collapsed ? 40 : 60}
            className="object-contain"
            priority
          />
        </Link>
      </div>

      {/* Menu */}
      <Menu
        onClick={handleMenuClick}
        selectedKeys={[selectedKey]}
        mode="inline"
        className="sidebar-menu space-y-1 !border-none !bg-transparent"
        items={navLinks}
      />
    </Sider>
  );
};

export default SidebarContainer;
