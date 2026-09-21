"use client";

import FormWrapper from "@/components/Form/FormWrapper";
import { useUpdateCategoryMutation } from "@/redux/api/categoriesApi";
import { Button, Modal } from "antd";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function EditCategoryModal({ open, setOpen, category }) {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");

  // update category api call
  const [updateCategory, { isLoading }] = useUpdateCategoryMutation();

  // 🔥 default data set
  useEffect(() => {
    if (category) {
      setTitle(category.title || "");
      setItems(category.items || []);
    }
  }, [category]);

  // add item
  const handleAdd = () => {
    setItems([...items, ""]);
  };

  // remove item
  const handleRemove = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // change item
  const handleChange = (value, index) => {
    const updated = [...items];
    updated[index] = value;
    setItems(updated);
  };

  // submit
  const handleSubmit = async () => {
    const payload = {
      id: category?._id,
      title,
      items: items.filter((i) => i.trim() !== ""),
    };

    try {
      const response = await updateCategory({
        payload,
        id: category?._id,
      }).unwrap();

      if (response.success) {
        toast.success("Category updated successfully!");
        setOpen(false);
      }
    } catch (error) {
      toast.error("Failed to update category.");
    }
  };

  return (
    <Modal
      centered
      open={open}
      footer={null}
      onCancel={() => setOpen(false)}
      title="Edit Category"
    >
      <FormWrapper onSubmit={handleSubmit}>
        {/* Title */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Category Name"
          className="mb-4 w-full rounded border px-3 py-2"
        />

        {/* Subcategories */}
        <div className="space-y-2">
          <p className="font-medium">Subcategories</p>

          {items.map((item, index) => (
            <div key={index} className="flex gap-2">
              <input
                value={item}
                onChange={(e) => handleChange(e.target.value, index)}
                placeholder="Subcategory"
                className="w-full rounded border px-3 py-2"
              />

              <Button danger onClick={() => handleRemove(index)}>
                Remove
              </Button>
            </div>
          ))}

          <Button type="dashed" onClick={handleAdd} className="w-full">
            + Add Subcategory
          </Button>
        </div>

        {/* Submit */}
        <Button
          htmlType="submit"
          type="primary"
          className="mt-5 w-full"
          loading={isLoading}
        >
          Update Category
        </Button>
      </FormWrapper>
    </Modal>
  );
}
