import CustomConfirm from "@/components/CustomConfirm/CustomConfirm";
import { Badge, Button } from "antd";
import { Trash2 } from "lucide-react";
import { Edit } from "lucide-react";

export default function SubscriptionPlanCard({ data, setShowEditPlanModal }) {
  // Most popular card
  if (data?.isHighlighted) {
    return (
      <div className="flex flex-col justify-between rounded-3xl border border-gray-300 bg-foundation-accent-800 p-7 font-medium text-white">
        <div>
          <div className="space-y-4">
            <div className="flex-center-between">
              <h4 className="text-2xl font-semibold">{data?.title} Plan</h4>
              <Badge className="rounded-full bg-gradient-to-br from-[#cbf9f2] to-foundation-accent-400 !p-2 text-base font-semibold text-black">
                {data?.tag}
              </Badge>
            </div>

            <h1 className="text-5xl font-semibold">
              £ {data?.price}{" "}
              <span className="text-xl font-medium text-white/80">
                /{data?.duration}
              </span>
            </h1>

            <p className="font-medium text-white/75">{data?.type}</p>
          </div>

          <div className="my-4 h-[1px] w-full border-b border-dashed"></div>

          <p className="text-lg">{data?.feature}</p>
        </div>

        <div className="flex-center space-x-4">
          <CustomConfirm
            title="Delete Plan"
            description={"Are you sure you want to delete this plan?"}
            onConfirm={() => {}}
          >
            <Button
              className="w-1/2 !border-none !bg-danger !font-medium !text-white"
              icon={<Trash2 size={16} />}
            >
              Delete
            </Button>
          </CustomConfirm>

          <Button
            type="primary"
            className="w-1/2 !font-medium"
            icon={<Edit size={16} />}
            onClick={() => setShowEditPlanModal(true)}
          >
            Edit
          </Button>
        </div>
      </div>
    );
  }

  // Normal subscription card
  return (
    <div className="flex flex-col justify-between gap-y-4 rounded-3xl border border-gray-300 p-7 font-medium">
      <div>
        <div className="space-y-4">
          <h4 className="text-2xl font-semibold">{data?.title} Plan</h4>
          <h1 className="text-5xl font-semibold">
            £ {data?.price}
            <span className="text-xl font-medium text-black/50">
              /{data?.duration}
            </span>
          </h1>
          <p className="font-medium text-black/75">{data?.type}</p>
        </div>

        <div className="my-4 h-[1px] w-full border-b border-dashed border-b-black"></div>

        <p className="text-lg">{data?.feature}</p>
      </div>

      {/* Edit & Delete Button */}
      <div className="flex-center space-x-4">
        <CustomConfirm
          title="Delete Plan"
          description={"Are you sure you want to delete this plan?"}
          onConfirm={() => {}}
        >
          <Button
            className="w-1/2 !border-none !bg-danger !font-medium !text-white"
            icon={<Trash2 size={16} />}
          >
            Delete
          </Button>
        </CustomConfirm>

        <Button
          type="primary"
          className="w-1/2 !font-medium"
          icon={<Edit size={16} />}
          onClick={() => setShowEditPlanModal(true)}
        >
          Edit
        </Button>
      </div>
    </div>
  );
}
