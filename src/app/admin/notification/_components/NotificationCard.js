import { Trash2 } from "lucide-react";
import Image from "next/image";

export default function NotificationCard({ notification }) {
  return (
    <div className="flex-center-start gap-x-5">
      <Image
        src={notification.userImg}
        alt="user avatar"
        height={1200}
        width={1200}
        className="w-[75px] h-auto aspect-square rounded-full"
      />

      <p className="text-xl">
        <span className="text-[22px] font-semibold">
          {notification.userName}
        </span>{" "}
        {notification.message}
      </p>

      <div className="flex-center-between w-max whitespace-nowrap gap-x-6 mb-7 ml-10">
        <p className="text-dark-gray">{notification.date}</p>

        <button>
          <Trash2 size={18} color="#F16365" />
        </button>
      </div>
    </div>
  );
}
