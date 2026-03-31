"use client";
import React from "react";
import {
  Modal,
  Avatar,
  Typography,
  Tag,
  Button,
  Space,
  Alert,
  Carousel,
  Image,
} from "antd";
import {
  WarningOutlined,
  UserOutlined,
  LikeOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import { useGetContentModerationByIdQuery } from "@/redux/api/content-moderationApi";

const { Title, Text, Paragraph } = Typography;

const ViolationModal = ({ visible, onClose, data }) => {
  const { data: postData, isLoading } = useGetContentModerationByIdQuery(data, {
    skip: !data,
  });

  if (!postData || isLoading) return null;

  const post = postData.data;

  return (
    <Modal
      open={visible}
      onCancel={() => onClose(false)}
      footer={null}
      width={850}
      centered
      closeIcon={<Button type="text">✕</Button>}
      loading={isLoading}
    >
      {/* Author Section */}
      <div className="mb-4 flex items-center gap-4">
        <Avatar src={post.author.photoUrl} size={64} icon={<UserOutlined />} />
        <div>
          <Title level={4} style={{ margin: 0 }}>
            {post.author.firstName} {post.author.lastName}
          </Title>
          {post.author.headline && (
            <Text type="secondary">{post.author.headline}</Text>
          )}
        </div>
      </div>

      {/* Status & Engagement */}
      <Space size="large" style={{ marginBottom: 16 }}>
        <Tag color={post.status === "active" ? "green" : "red"}>
          {post.status.toUpperCase()}
        </Tag>
        <Tag icon={<LikeOutlined />} color="blue">
          {post.contentMeta?.like || 0} Likes
        </Tag>
        <Tag icon={<CommentOutlined />} color="purple">
          {post.contentMeta?.comment || 0} Comments
        </Tag>
      </Space>

      {/* Content Carousel */}
      {post.content?.length > 0 && (
        <Carousel autoplay dotPosition="bottom" style={{ marginBottom: 20 }}>
          {post.content.map((media, idx) => {
            const isVideo = media.endsWith(".mp4");
            return (
              <div key={idx} className="flex items-center justify-center">
                {isVideo ? (
                  <video
                    controls
                    className="max-h-[400px] w-full rounded-lg object-contain"
                  >
                    <source src={media} type="video/mp4" />
                  </video>
                ) : (
                  <Image
                    src={media}
                    alt={`media-${idx}`}
                    className="max-h-[200px] w-full rounded-lg object-contain"
                  />
                )}
              </div>
            );
          })}
        </Carousel>
      )}

      {/* Description */}
      {post.description && (
        <Paragraph style={{ fontSize: 16, marginBottom: 20 }}>
          {post.description}
        </Paragraph>
      )}

      {/* Report Section */}
      {post.isReported && post.reportList?.length > 0 && (
        <div className="mb-4">
          <Alert
            type="error"
            message="This post has been reported!"
            description={`Reported for: ${post.reportList.map((r) => r.reason).join(", ")}`}
            icon={<WarningOutlined />}
            showIcon
          />
          <div className="mt-3 space-y-2">
            {post.reportList.map((report) => (
              <div
                key={report._id}
                className="flex items-center gap-2 rounded-lg border p-2 hover:bg-gray-50"
              >
                <Avatar
                  src={report.author.photoUrl}
                  size={32}
                  icon={<UserOutlined />}
                />
                <div>
                  <Text strong>
                    {report.author.firstName} {report.author.lastName}
                  </Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {new Date(report.createdAt).toLocaleString()}
                  </Text>
                  <Paragraph style={{ margin: 0 }}>{report.reason}</Paragraph>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ViolationModal;
