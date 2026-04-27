"use client";

import { Button } from "antd";
import { Plus } from "lucide-react";
import { useState } from "react";
import CustomConfirm from "@/components/CustomConfirm/CustomConfirm";
import CreateCategoryModal from "./CreateCategoryModal";
import EditCategoryModal from "./EditCategoryModal";
import {
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
} from "@/redux/api/categoriesApi";
import toast from "react-hot-toast";
import SkeletonCard from "@/components/SkeletonCard/SkeletonCard";

export default function CategoryContainer() {
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  // get categories from api and map through them to display category cards
  const { data: categoriesData, isLoading } = useGetCategoriesQuery({
    page: 1,
    limit: 10,
    searchText: "",
  });
  // delete categories api call
  const [deleteCategory] = useDeleteCategoryMutation();

  if (isLoading) {
    return (
      <div div className="space-y-20">
        <div className="grid grid-cols-3 gap-10">
          <SkeletonCard width={500} rows={8} />
          <SkeletonCard width={500} rows={8} />
          <SkeletonCard width={500} rows={8} />
          <SkeletonCard width={500} rows={8} />
          <SkeletonCard width={500} rows={8} />
        </div>
      </div>
    );
  }
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
        {categoriesData?.data?.map((category) => (
          <div
            key={category._id}
            className="relative rounded-xl border border-primary-blue/25 bg-white p-5 shadow transition hover:shadow-lg"
          >
            {/* Category Header */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">{category.title}</h2>
              {/* Edit icon
              <Button
                type="text"
                onClick={() => setShowEdit(true)}
                className="!p-1"
              >
                <Plus className="h-6 w-6" />
              </Button> */}
            </div>

            {/* Subcategories */}
            <div className="max-h-60 space-y-2 overflow-y-auto pr-1">
              {category.items?.map((sub, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border px-3 py-2 transition hover:bg-gray-50"
                >
                  <span className="text-sm">{sub}</span>

                  {/* <CustomConfirm
                    title="Delete Sub Category"
                    description="Are you sure to delete this sub category?"
                  >
                    <Button type="text" className="!p-1 !text-danger">
                      <Trash2 size={16} />
                    </Button>
                  </CustomConfirm> */}
                </div>
              ))}
            </div>

            {/* Main Category Delete */}
            <div className="flex justify-around gap-5">
              <CustomConfirm
                title="Delete Category"
                description="Are you sure to delete this category?"
                onConfirm={() => {
                  try {
                    const response = deleteCategory(category._id).unwrap();
                    if (response.success) {
                      toast.success("Category deleted successfully!");
                    }
                  } catch (error) {
                    toast.error("Failed to delete category.");
                  }
                }}
              >
                <Button className="mt-4 w-full !bg-danger !text-white hover:!bg-danger/90">
                  Delete Category
                </Button>
              </CustomConfirm>
              <div>
                <Button
                  onClick={() => {
                    setSelectedCategory(category);
                    setShowEdit(true);
                  }}
                  className="mt-4 w-full !bg-[#bd329a] !text-white hover:!bg-[#bd329a]/90"
                >
                  Edit Category
                </Button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Pagination */}
      {/* <div className="my-10 ml-auto max-w-max">
        <Pagination style={{ fontSize: "1.2rem" }} />
      </div> */}

      {/* Modals */}
      <CreateCategoryModal open={showCreate} setOpen={setShowCreate} />
      <EditCategoryModal
        open={showEdit}
        setOpen={setShowEdit}
        category={selectedCategory}
      />
    </div>
  );
}
