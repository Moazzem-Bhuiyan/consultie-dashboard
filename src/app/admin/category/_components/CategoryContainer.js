"use client";

import { Button, Pagination } from "antd";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import CustomConfirm from "@/components/CustomConfirm/CustomConfirm";
import CreateCategoryModal from "./CreateCategoryModal";
import EditCategoryModal from "./EditCategoryModal";

const categories = [
  {
    id: 1,
    name: "Business & Entrepreneurship",
    subcategories: [
      "Startups & Funding",
      "Marketing & Branding",
      "Sales & Closing",
      "Leadership & Management",
      "Business Strategy",
      "E-commerce",
      "Franchising",
      "Productivity & Time Management",
    ],
  },
  {
    id: 2,
    name: "Finance & Investing",
    subcategories: [
      "Property & Real Estate",
      "Stocks & Trading",
      "Crypto & Blockchain",
      "Personal Finance",
      "Wealth Management",
      "Tax & Accounting",
      "Raising Capital",
      "Financial Planning",
    ],
  },
];

export default function CategoryContainer() {
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  return (
    <div>
      {/* Create Category Button */}
      <Button
        type="primary"
        size="large"
        icon={<Plus size={20} />}
        iconPosition="start"
        className="!w-full !py-6"
        onClick={() => setShowCreate(true)}
      >
        Create Category
      </Button>

      {/* Category cards */}
      <section className="my-10 grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
        {categories.map((category) => (
          <div
            key={category.id}
            className="rounded-xl border border-primary-blue/25 bg-white p-5 shadow"
          >
            {/* Category Header */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">{category.name}</h2>

              {/* Edit icon → open modal */}
              <Button
                type="text"
                onClick={() => setShowEdit(true)}
                className="!p-1"
              >
                <Plus className="h-6 w-6" />
              </Button>
            </div>

            {/* Subcategories */}
            <div className="space-y-2">
              {category.subcategories.map((sub, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border px-3 py-2"
                >
                  <span className="text-base">{sub}</span>

                  <CustomConfirm
                    title="Delete Sub Category"
                    description="Are you sure to delete this sub category?"
                  >
                    <Button type="text" className="!p-1 !text-danger">
                      <Trash2 size={18} />
                    </Button>
                  </CustomConfirm>
                </div>
              ))}
            </div>

            {/* Main Category Delete Button */}
            <CustomConfirm
              title="Delete Category"
              description="Are you sure to delete this category?"
            >
              <Button className="absolute bottom-0 mt-4 w-full !bg-danger !text-white hover:!bg-danger/90">
                Delete Category
              </Button>
            </CustomConfirm>
          </div>
        ))}
      </section>

      {/* Pagination */}
      {/* <div className="my-10 ml-auto max-w-max">
        <Pagination style={{ fontSize: "1.2rem" }} />
      </div> */}

      {/* Modals */}
      <CreateCategoryModal open={showCreate} setOpen={setShowCreate} />
      <EditCategoryModal open={showEdit} setOpen={setShowEdit} />
    </div>
  );
}
