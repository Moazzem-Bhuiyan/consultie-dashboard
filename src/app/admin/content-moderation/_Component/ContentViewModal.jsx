import React from "react";
import { Modal, Avatar, Typography, Tag, Button, Space, Alert } from "antd";
import { WarningOutlined, UserOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const ViolationModal = ({ visible, onClose }) => {
  return (
    <Modal
      open={visible}
      onCancel={() => onClose(false)}
      footer={null}
      width={820}
      centered
      closeIcon={null}
    >
      {/* Header: User Info + Restrict Button */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 24,
        }}
      >
        <Space align="start">
          <Avatar
            size={48}
            src="https://randomuser.me/api/portraits/women/44.jpg"
            icon={<UserOutlined />}
          />
          <div>
            <Text strong style={{ fontSize: 16, display: "block" }}>
              Stella Lee
              <span style={{ color: "#52c41a", marginLeft: 6 }}>•</span>
            </Text>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Chief Financing Officer at Baxibox · 2h ago
            </Text>
          </div>
        </Space>

        <Button type="primary" danger shape="round">
          Restrict Content
        </Button>
      </div>

      {/* Post Content */}
      <Paragraph style={{ fontSize: 16, lineHeight: 1.6, marginBottom: 24 }}>
        <Text strong>
          Building a successful startup isn’t just about having a great idea;
          it’s about executing that idea with precision, persistence, and
          passion.
        </Text>
        <br />
        <br />
        Here’s a quick guide to help aspiring entrepreneurs navigate the startup
        journey:
      </Paragraph>

      {/* Startup Guide Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 16,
          marginBottom: 32,
        }}
      >
        {[
          {
            title: "Validate your idea",
            content:
              "Before diving in, make sure there’s a real need for your product or service. Talk to potential customers, gather feedback, and refine your concept.",
          },
          {
            title: "Build your strong team",
            content:
              "Surround yourself with a diverse group of talented individuals who share your vision. Remember, the people you work with can make or break your startup.",
          },
          {
            title: "Focus on the customer",
            content:
              "Always prioritize the needs and experiences of your customers. A satisfied customer is your best advocate.",
          },
          {
            title: "Focus on the customer",
            content:
              "Engage with your customers regularly, gather their feedback, and make them feel heard and valued.",
          },
        ].map((card, index) => (
          <div
            key={index}
            style={{
              background: `linear-gradient(135deg, ${index % 2 === 0 ? "#ffd6e7" : "#fff0f6"}, #ffffff)`,
              borderRadius: 12,
              padding: "16px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <Title level={4} style={{ margin: "0 0 8px 0", color: "#1f1f1f" }}>
              {card.title}
            </Title>
            <Text type="secondary" style={{ fontSize: 13 }}>
              {card.content}
            </Text>
          </div>
        ))}
      </div>

      {/* Violation Alert */}
      <Alert
        message={
          <Space direction="vertical" size={4}>
            <Text strong style={{ display: "flex", alignItems: "center" }}>
              <WarningOutlined style={{ color: "#fa8c16", marginRight: 8 }} />
              Reason for Violation
            </Text>
            <Space wrap>
              <Tag
                color="warning"
                style={{ borderRadius: 16, padding: "0 12px" }}
              >
                Just to let you know this might be a problem
              </Tag>
              <Tag
                color="error"
                style={{ borderRadius: 16, padding: "0 12px" }}
              >
                Disrespectful and harmful behavior
              </Tag>
              <Tag
                color="processing"
                style={{ borderRadius: 16, padding: "0 12px" }}
              >
                Violating platform’s harassment policy
              </Tag>
            </Space>
          </Space>
        }
        type="warning"
        showIcon={false}
        style={{
          background: "#fffbe6",
          border: "1px solid #ffe58f",
          borderRadius: 12,
          padding: "16px",
        }}
      />
    </Modal>
  );
};

export default ViolationModal;
