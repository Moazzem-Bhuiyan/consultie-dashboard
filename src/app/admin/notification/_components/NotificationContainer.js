import userAvatar from "@/assets/images/user-avatar-lg.png";
import NotificationCard from "./NotificationCard";
import { Button } from "antd";

// Dummy Data
const notifications = Array.from({ length: 6 }).map((_, inx) => ({
  key: inx + 1,
  userName: "Maddie Johnson",
  userImg: userAvatar,
  message:
    "registered as a customer looking for professional bridal makeup services near Los Angeles, CA",
  date: inx + 1 + " days ago",
}));

export default function NotificationContainer() {
  return (
    <div className="w-3/4 mx-auto mb-10">
      <section className="mb-10 flex-center-between">
        <h4 className="text-3xl font-semibold">Notifications</h4>

        <div className="space-x-3">
          <Button type="primary">Mark as read</Button>
          <Button className="!bg-danger !text-white">Delete all</Button>
        </div>
      </section>

      <section className="space-y-8">
        {notifications?.map((notification) => (
          <NotificationCard
            key={notification.key}
            notification={notification}
          />
        ))}
      </section>
    </div>
  );
}
