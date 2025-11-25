"use client";

import { Button } from "antd";
import { Edit } from "lucide-react";
import SubscriptionPlanCard from "./SubscriptionPlanCard";
import CreateSubscriptionPlanModal from "./CreateSubscriptionPlanModal";
import { useState } from "react";
import EditSubscriptionPlanModal from "./EditSubscriptionPlanModal";

const subscriptionPlans = [
  {
    title: "Monthly",
    price: "29",
    duration: "month",
    type: "Flexible Monthly Plan",
    feature:
      "Ideal for seller who need short-term access or want to try out our services without a long-term commitment.",
  },
  {
    title: "Quarterly",
    price: "55",
    duration: "6 months",
    type: "Save with a Quarterly Plan",
    feature:
      "Perfect for sellers who want to commit for a few months with added value. Enjoy savings compared to the monthly plan!",
    tag: "Most Popular",
    isHighlighted: true,
  },
  {
    title: "Yearly",
    price: "95",
    duration: "year",
    type: "Best Value Annual Plan",
    feature:
      "Our most cost-effective option, ideal for regular seller. Commit for a year and save big!",
  },
];

export default function SubscriptionsContainer() {
  const [showCreatePlanModal, setShowCreatePlanModal] = useState(false);
  const [showEditPlanModal, setShowEditPlanModal] = useState(false);

  return (
    <div>
      <Button
        type="primary"
        size="large"
        icon={<Edit size={20} />}
        iconPosition="start"
        className="!w-full !py-6"
        onClick={() => setShowCreatePlanModal(true)}
      >
        Create Subscription Plan
      </Button>

      <section className="my-10 grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3">
        {subscriptionPlans.map((data, idx) => (
          <SubscriptionPlanCard
            key={idx}
            data={data}
            setShowEditPlanModal={setShowEditPlanModal}
          />
        ))}
      </section>

      {/* Create Subscription Plan Modal */}
      <CreateSubscriptionPlanModal
        open={showCreatePlanModal}
        setOpen={setShowCreatePlanModal}
      />

      {/* Edit Subscription Plan Modal */}
      <EditSubscriptionPlanModal
        open={showEditPlanModal}
        setOpen={setShowEditPlanModal}
      />
    </div>
  );
}
