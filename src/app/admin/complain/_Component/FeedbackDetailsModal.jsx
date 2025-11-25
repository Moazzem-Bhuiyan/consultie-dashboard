import FormWrapper from "@/components/Form/FormWrapper";
import UTextArea from "@/components/Form/UTextArea";
import { Button, Modal } from "antd";
import { Mail, Phone } from "lucide-react";
import React from "react";

function FeedbackDetailsModal({ open, setOpen }) {
  return (
    <div>
      <Modal
        centered
        open={open}
        footer={null}
        onCancel={() => setOpen(false)}
        width={800}
        closable={false}
        title="Complain Details"
      >
        <div className="mb-10 space-y-4">
          <h1 className="text-xl font-medium">
            Mary Cooper - Submision ID: 123
          </h1>
          <h1 className="flex justify-start gap-2">
            <span>
              <Mail />{" "}
            </span>
            tiyp@example.com
          </h1>
          <h1 className="flex justify-start gap-2">
            <span>
              <Phone />{" "}
            </span>
            123456789
          </h1>
          <div className="rounded-lg border border-gray-300 p-4">
            <h1 className="text-lg font-medium">User Message</h1>
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo eum
              nam nostrum dolore culpa ullam sequi magnam sit accusamus expedita
              officia id vitae sed, non quas reiciendis corporis voluptatibus
              officiis alias eaque. Aspernatur, similique veritatis magni
              debitis, incidunt praesentium aperiam ab, temporibus beatae
              perferendis neque voluptatem expedita aliquam ipsa voluptas.
            </p>
          </div>
        </div>
        <FormWrapper>
          <UTextArea
            name="reply"
            label=" Send Reply"
            placeholder="Enter your reply here"
          />
          <Button
            type="primary"
            htmlType="submit"
            className="w-full"
            size="large"
            style={{
              marginTop: "20px",
            }}
          >
            Send Reply
          </Button>
        </FormWrapper>
      </Modal>
    </div>
  );
}

export default FeedbackDetailsModal;
