"use client";
import { useDeleteSingleNotificationMutation } from "@/redux/api/notificationApi";
import { Bell, Trash2 } from "lucide-react";
import moment from "moment";
import toast from "react-hot-toast";

export default function NotificationCard({ notification }) {
  const [deleteFn, { isLoading }] = useDeleteSingleNotificationMutation();

  const handleDelete = async (id) => {
    try {
      const res = await deleteFn(id).unwrap();
      if (res.success) {
        toast.success("Notification Deleted");
      }
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };
  return (
    <div
      className={`flex items-center justify-between gap-x-5 rounded-xl px-4 py-5 ${
        notification?.read
          ? "border border-[#A57EA5] bg-white text-black"
          : "bg-gradient-to-tr from-[#ec8e76] to-[#E36B4E] text-white"
      } `}
    >
      <div className="flex items-center gap-x-5">
        <Bell size={32} />

        <div>
          <p className="text-[22px] text-xl font-semibold">
            {notification?.message}
          </p>
          <p className="text-md"> {notification?.description}</p>
        </div>
      </div>

      <div className="flex gap-5">
        <p className="text-dark ml-3 font-bold">
          {moment(notification?.createdAt).startOf("hour").fromNow()}
        </p>
        <button onClick={() => handleDelete(notification?._id)}>
          {isLoading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-4 border-danger border-t-transparent"></div>
          ) : (
            <Trash2 className="text-red-500" />
          )}
        </button>
      </div>
    </div>
  );
}
