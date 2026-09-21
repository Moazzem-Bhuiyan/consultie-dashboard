import { AlertCircle, Users, CreditCard } from "lucide-react";

export const RecentNotifications = () => {
  const notifications = [
    {
      id: 1,
      icon: AlertCircle,
      iconColor: "text-red-500",
      bgColor: "bg-red-50",
      title: "New Dispute Filed",
      description: "User complaint about consultation quality",
      time: "2 minutes ago",
    },
    {
      id: 2,
      icon: Users,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-50",
      title: "New Expert Registration",
      description: "Dr. Sarah Johnson applied as a therapist",
      time: "15 minutes ago",
    },
    {
      id: 3,
      icon: CreditCard,
      iconColor: "text-orange-500",
      bgColor: "bg-orange-50",
      title: "Payment Failed",
      description: "Transaction #TXN-4521 needs attention",
      time: "1 hour ago",
    },
  ];

  return (
    <div className="w-full max-w-full">
      <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Recent Notifications
        </h3>
        {notifications.map((notification) => {
          const IconComponent = notification.icon;
          return (
            <div
              key={notification.id}
              className={`flex gap-3 ${notification.bgColor} cursor-pointer items-start rounded-md p-3 transition-colors hover:bg-gray-50`}
            >
              <div
                className={`${notification.bgColor} h-fit flex-shrink-0 rounded-md p-2`}
              >
                <IconComponent
                  className={`h-5 w-5 ${notification.iconColor}`}
                />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-900">
                  {notification.title}
                </h4>
                <p className="mt-1 text-sm text-gray-600">
                  {notification.description}
                </p>
                <p className="mt-2 text-xs text-gray-400">
                  {notification.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
