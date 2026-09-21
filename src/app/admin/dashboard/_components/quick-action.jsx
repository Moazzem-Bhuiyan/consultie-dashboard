import { Users, Flag, CreditCard, ChevronRight } from "lucide-react";

export const QuickActions = () => {
  const actions = [
    {
      id: 1,
      icon: Users,
      label: "Approve New Experts",
      badge: 5,
      badgeColor: "bg-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      id: 2,
      icon: Flag,
      label: "Review Flagged Content",
      badge: 2,
      badgeColor: "bg-orange-500",
      bgColor: "bg-orange-50",
    },
    {
      id: 3,
      icon: CreditCard,
      label: "View Latest Payments",
      showArrow: true,
      bgColor: "bg-green-50",
    },
  ];

  return (
    <div className="w-full max-w-full">
      <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Quick Actions
        </h3>
        {actions.map((action) => {
          const IconComponent = action.icon;
          return (
            <div
              key={action.id}
              className={`flex hover:bg-gray-50 ${action.bgColor} cursor-pointer items-center justify-between rounded-md p-3 transition-colors`}
            >
              <div className="flex items-center gap-3">
                <div className={`${action.bgColor} rounded-md p-2`}>
                  <IconComponent className="h-5 w-5 text-gray-700" />
                </div>
                <span className="font-medium text-gray-900">
                  {action.label}
                </span>
              </div>
              {action.badge && (
                <div
                  className={`${action.badgeColor} flex h-6 w-6 items-center justify-center rounded-full text-sm font-semibold text-white`}
                >
                  {action.badge}
                </div>
              )}
              {action.showArrow && (
                <ChevronRight className="h-5 w-5 text-gray-400" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
