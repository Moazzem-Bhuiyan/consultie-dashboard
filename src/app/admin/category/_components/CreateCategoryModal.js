"use client";

import FormWrapper from "@/components/Form/FormWrapper";
import UInput from "@/components/Form/UInput";
import { useCreateCategoryMutation } from "@/redux/api/categoriesApi";
import { Button, Modal } from "antd";
import { useState } from "react";
import toast from "react-hot-toast";

export default function CreateCategoryModal({ open, setOpen }) {
  const [items, setItems] = useState([""]);

  // add category item
  const [createCategories, { isLoading }] = useCreateCategoryMutation();

  // add new input
  const handleAdd = () => {
    setItems([...items, ""]);
  };

  // remove input
  const handleRemove = (index) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  // change value
  const handleChange = (value, index) => {
    const updated = [...items];
    updated[index] = value;
    setItems(updated);
  };

  // submit
  const handleSubmit = async (data) => {
    const payload = {
      title: data.name,
      items: items.filter((item) => item.trim() !== ""),
    };
    try {
      const response = await createCategories(payload).unwrap();
      if (response.success) {
        toast.success("Category created successfully!");
        setOpen(false);
        setItems([""]);
      }
    } catch (error) {
      toast.error("Failed to create category.");
    }
  };

  return (
    <Modal
      centered
      open={open}
      footer={null}
      onCancel={() => setOpen(false)}
      title="Create Category"
    >
      <FormWrapper onSubmit={handleSubmit}>
        {/* Category Name */}
        <UInput
          type="text"
          name="name"
          label="Category Name"
          required
          placeholder="Enter category name"
        />

        {/* Subcategories */}
        <div className="mt-4 space-y-2">
          <p className="font-medium">Subcategories</p>

          {items.map((item, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => handleChange(e.target.value, index)}
                placeholder="Enter subcategory"
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
          size="large"
          className="mt-5 w-full"
          loading={isLoading}
        >
          Submit
        </Button>
      </FormWrapper>
    </Modal>
  );
}
