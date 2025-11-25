"use client";
import CustomConfirm from "@/components/CustomConfirm/CustomConfirm";
import { Table } from "antd";
import { Eye, Trash } from "lucide-react";
import React, { useState } from "react";
import ViolationModal from "./ContentViewModal";

export default function ContentTable() {
  const [open, setOpen] = useState(false);
  const data = Array.from({ length: 10 }).map((_, inx) => ({
    key: inx + 1,
    contentTitle: `Sample Content Title ${inx + 1}`,
    date: "11 oct 24, 11.10PM",
    status: "Pending",
    userName: `User ${inx + 1}`,
  }));

  const columns = [
    {
      title: "Content Title",
      dataIndex: "contentTitle",
      key: "contentTitle",
    },
    {
      title: "Submitted By",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Date Submitted",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex items-center justify-center">
          <button
            onClick={() => setOpen(true)}
            className="rounded p-1 text-black hover:bg-gray-200"
          >
            <Eye />
          </button>
          <CustomConfirm>
            <button className="ml-2 rounded p-1 text-red-500 hover:bg-red-600 hover:text-white">
              <Trash />
            </button>
          </CustomConfirm>
        </div>
      ),
    },
  ];
  return (
    <div>
      {/* Table Section */}
      <Table columns={columns} dataSource={data} pagination={false} />
      <ViolationModal visible={open} onClose={setOpen} />
    </div>
  );
}
