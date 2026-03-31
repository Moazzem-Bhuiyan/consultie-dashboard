"use client";
import React from "react";
import { Modal, Avatar, Typography, Divider, Button, Space } from "antd";
import { Mail, Phone } from "lucide-react";
import FormWrapper from "@/components/Form/FormWrapper";
import UTextArea from "@/components/Form/UTextArea";
import { useSendReplyMutation } from "@/redux/api/complainApi";
import toast from "react-hot-toast";

const { Title, Text, Paragraph } = Typography;

function FeedbackDetailsModal({ open, setOpen, data }) {
  // send reply api call here
  const [sendReply, { isLoading }] = useSendReplyMutation({});

  if (!data) return null; // Guard if no data is passed

  const handleSubmit = async (formData) => {
    const payload = {
      subject: data.subject || "No Subject",
      messages: formData.reply,
    };

    try {
      const response = await sendReply({ id: data.key, payload }).unwrap();
      if (response.success) {
        toast.success("Reply sent successfully!");
        setOpen(false);
      }
    } catch (error) {
      toast.error("Failed to send reply.");
    }
  };

  return (
    <Modal
      centered
      open={open}
      footer={null}
      onCancel={() => setOpen(false)}
      width={800}
      closable
      title="Complain Details"
      className="rounded-xl"
    >
      {/* Header: Avatar + Name + Submission ID */}
      <div className="mb-6 flex items-center gap-4">
        <Avatar size={64} src={data.avatar} />
        <div>
          <Title level={4} className="mb-1">
            {data.name}
          </Title>
          <Text type="secondary">Submission ID: {data.postId}</Text>
        </div>
      </div>

      <Divider />

      {/* Contact Info */}
      <div className="mb-6 flex flex-col gap-2">
        {data.email && (
          <div className="flex items-center gap-2">
            <Mail size={18} />
            <Text>{data.email}</Text>
          </div>
        )}
        {data.phone && (
          <div className="flex items-center gap-2">
            <Phone size={18} />
            <Text>{data.phone}</Text>
          </div>
        )}
        {data.audience && (
          <div className="flex items-center gap-2">
            <Text strong>Audience: </Text>
            <Text>{data.audience}</Text>
          </div>
        )}
      </div>

      <Divider />

      {/* User Message */}
      <div className="mb-6">
        <Title level={5}>User Message</Title>
        <Paragraph className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          {data.message || "No message provided."}
        </Paragraph>
      </div>

      {/* Subject */}
      {data.subject && (
        <div className="mb-6">
          <Title level={5}>Subject</Title>
          <Paragraph>{data.subject}</Paragraph>
        </div>
      )}

      <Divider />

      {/* Reply Form */}
      <FormWrapper onSubmit={handleSubmit}>
        <UTextArea
          name="reply"
          label="Send Reply"
          placeholder="Enter your reply here"
        />
        <Button
          type="primary"
          htmlType="submit"
          className="mt-4 w-full"
          size="large"
        >
          Send Reply
        </Button>
      </FormWrapper>
    </Modal>
  );
}

export default FeedbackDetailsModal;
