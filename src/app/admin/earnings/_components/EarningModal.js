"use client";

import { Modal, Divider, Tag, Collapse } from "antd";
import Image from "next/image";
import userImage from "@/assets/images/user-avatar-lg.png";

const { Panel } = Collapse;

export default function EarningModal({ open, setOpen, transaction }) {
  if (!transaction) return null;

  return (
    <Modal
      centered
      open={open}
      footer={null}
      onCancel={() => setOpen(false)}
      title="Transaction Details"
      width={800}
    >
      <h2 className="mb-4 text-center text-xl font-bold">
        Transaction Details
      </h2>
      <Divider />

      <Collapse defaultActiveKey={["1", "2", "3"]} accordion={false}>
        {/* Account Info */}
        <Panel header="Account Info" key="1">
          <div className="mb-4 flex items-center gap-4">
            <Image
              src={transaction.account?.photoUrl || userImage}
              alt={transaction.account?.firstName || "User"}
              width={60}
              height={60}
              className="rounded-full"
            />
            <div>
              <p className="text-lg font-semibold">
                {transaction.account?.firstName} {transaction.account?.lastName}
              </p>
              <p className="text-sm text-gray-500">
                ID: {transaction.account?._id}
              </p>
            </div>
          </div>
        </Panel>

        {/* Booking Info */}
        <Panel header="Booking Info" key="2">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="font-semibold">Booking ID: </span>
              {transaction.booking?._id}
            </div>
            <div>
              <span className="font-semibold">Session Type: </span>
              {transaction.booking?.sessionType}
            </div>
            <div>
              <span className="font-semibold">Session Duration: </span>
              {transaction.booking?.sessionDuration} min
            </div>
            <div>
              <span className="font-semibold">Price: </span>$
              {transaction.booking?.price}
            </div>
            <div>
              <span className="font-semibold">Slot Date: </span>
              {transaction.booking?.slot?.date}
            </div>
            <div>
              <span className="font-semibold">Slot Time: </span>
              {transaction.booking?.slot?.time}
            </div>
            <div>
              <span className="font-semibold">Timezone: </span>
              {transaction.booking?.timezone}
            </div>
          </div>
        </Panel>

        {/* Payment Info */}
        <Panel header="Payment Info" key="3">
          <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="font-semibold">Transaction ID: </span>
              {transaction.id}
            </div>
            <div>
              <span className="font-semibold">Payment Intent ID: </span>
              {transaction.paymentIntentId}
            </div>
            <div>
              <span className="font-semibold">Amount: </span>$
              {transaction.amount}
            </div>
            <div>
              <span className="font-semibold">Consult Amount: </span>$
              {transaction.consultAmount}
            </div>
            <div>
              <span className="font-semibold">Platform Commission: </span>$
              {transaction.platformCommission}
            </div>
            <div>
              <span className="font-semibold">Status: </span>
              <Tag color={transaction.status === "paid" ? "green" : "red"}>
                {transaction.status}
              </Tag>
            </div>
            <div>
              <span className="font-semibold">Created At: </span>
              {new Date(transaction.createdAt).toLocaleString()}
            </div>
            <div>
              <span className="font-semibold">Updated At: </span>
              {new Date(transaction.updatedAt).toLocaleString()}
            </div>
            <div>
              <span className="font-semibold">Deleted: </span>
              {transaction.isDeleted ? "Yes" : "No"}
            </div>
          </div>

          {/* Full API Object */}
          {/* <div className="text-sm">
            <h4 className="mb-2 font-semibold">Full API Object (Debug)</h4>
            <pre className="overflow-x-auto rounded bg-gray-100 p-2 text-xs">
              {JSON.stringify(transaction, null, 2)}
            </pre>
          </div> */}
        </Panel>
      </Collapse>
    </Modal>
  );
}
