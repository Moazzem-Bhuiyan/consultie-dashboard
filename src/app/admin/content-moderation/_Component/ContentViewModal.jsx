"use client";

import React, { useState } from "react";
import {
  Modal,
  Avatar,
  Typography,
  Tag,
  Button,
  Spin,
  Empty,
  Divider,
  Image as AntImage,
} from "antd";
import {
  WarningOutlined,
  UserOutlined,
  LikeOutlined,
  CommentOutlined,
  PlayCircleOutlined,
  FileImageOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { useGetContentModerationByIdQuery } from "@/redux/api/content-moderationApi";
import moment from "moment";

const { Title, Text, Paragraph } = Typography;

const isVideo = (url = "") => {
  return (
    url.toLowerCase().endsWith(".mp4") ||
    url.toLowerCase().endsWith(".webm") ||
    url.toLowerCase().endsWith(".mov") ||
    url.includes("/videos/")
  );
};

const ViolationModal = ({ visible, onClose, data }) => {
  const {
    data: postData,
    isLoading,
    isError,
  } = useGetContentModerationByIdQuery(data, { skip: !data || !visible });

  const post = postData?.data;
  const mediaList = post?.content || [];
  const reports = post?.reports || [];
  const appeals = post?.appeals || [];

  const handleClose = () => {
    onClose(false);
  };

  return (
    <Modal
      open={visible}
      onCancel={handleClose}
      footer={null}
      width={980}
      centered
      destroyOnClose
      className="content-view-modal"
      styles={{
        body: { padding: 0, maxHeight: "88vh", overflowY: "auto" },
      }}
    >
      {isLoading ? (
        <div className="flex h-80 items-center justify-center">
          <Spin size="large" />
        </div>
      ) : isError || !post ? (
        <div className="flex h-80 items-center justify-center">
          <Empty description="Failed to load post details" />
        </div>
      ) : (
        <div className="p-6">
          {/* ========== Header: Author + Status ========== */}
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <Avatar
                src={post.author?.photoUrl}
                size={52}
                icon={<UserOutlined />}
              />
              <div className="min-w-0">
                <Title level={5} style={{ margin: 0 }} className="truncate">
                  {post.author?.firstName} {post.author?.lastName}
                </Title>
                {post.author?.headline && (
                  <Text type="secondary" className="text-sm">
                    {post.author.headline}
                  </Text>
                )}
                <div className="mt-0.5 text-xs text-gray-400">
                  {moment(post.createdAt).format("MMM D, YYYY • h:mm A")}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Tag
                color={post.status === "active" ? "success" : "error"}
                className="m-0 rounded-full px-3 py-0.5 text-xs font-medium"
              >
                {post.status?.toUpperCase()}
              </Tag>

              {(post.isFoundReported || reports.length > 0) && (
                <Tag
                  color="error"
                  icon={<WarningOutlined />}
                  className="m-0 rounded-full px-3 py-0.5 text-xs font-medium"
                >
                  Reported
                </Tag>
              )}

              {appeals.length > 0 && (
                <Tag
                  color="processing"
                  icon={<SafetyCertificateOutlined />}
                  className="m-0 rounded-full px-3 py-0.5 text-xs font-medium"
                >
                  Appeal Submitted
                </Tag>
              )}

              <Tag
                icon={<LikeOutlined />}
                className="m-0 rounded-full border-0 bg-blue-50 px-3 py-0.5 text-xs text-blue-600"
              >
                {post.contentMeta?.like || 0} Likes
              </Tag>

              <Tag
                icon={<CommentOutlined />}
                className="m-0 rounded-full border-0 bg-purple-50 px-3 py-0.5 text-xs text-purple-600"
              >
                {post.contentMeta?.comment || 0} Comments
              </Tag>
            </div>
          </div>

          {/* ========== Description ========== */}
          {post.description && (
            <div className="mb-6">
              <Text strong className="mb-1 block text-sm text-gray-500">
                Description
              </Text>
              <Paragraph className="!mb-0 text-[15px] leading-relaxed text-gray-800">
                {post.description}
              </Paragraph>
            </div>
          )}

          {/* ========== MEDIA (Small Thumbnails) ========== */}
          <div className="mb-6">
            <Text strong className="mb-3 block text-sm text-gray-500">
              Media ({mediaList.length})
            </Text>

            {mediaList.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 py-8 text-center text-sm text-gray-400">
                No media available
              </div>
            ) : (
              <AntImage.PreviewGroup>
                <div className="flex flex-wrap gap-3">
                  {mediaList.map((media, idx) => (
                    <div
                      key={idx}
                      className="group relative h-28 w-28 overflow-hidden rounded-xl border border-gray-200 bg-gray-100 shadow-sm transition hover:shadow-md"
                    >
                      {isVideo(media) ? (
                        <a
                          href={media}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-full w-full flex-col items-center justify-center gap-1 bg-gray-800 text-white"
                        >
                          <PlayCircleOutlined className="text-3xl" />
                          <span className="text-[10px]">Video</span>
                        </a>
                      ) : (
                        <AntImage
                          src={media}
                          alt={`media-${idx}`}
                          className="h-full w-full object-cover"
                          style={{ height: "100%", width: "100%" }}
                          preview={{
                            mask: (
                              <div className="flex items-center gap-1 text-xs">
                                <FileImageOutlined /> View
                              </div>
                            ),
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </AntImage.PreviewGroup>
            )}
          </div>

          <Divider className="my-5" />

          {/* ========== REPORTS SECTION ========== */}
          <div className="mb-6">
            <div className="mb-3 flex items-center gap-2">
              <WarningOutlined className="text-red-500" />
              <Text strong className="text-base text-red-600">
                Reports ({reports.length})
              </Text>
            </div>

            {reports.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 py-6 text-center text-sm text-gray-400">
                No reports found
              </div>
            ) : (
              <div className="max-h-56 space-y-3 overflow-y-auto pr-1">
                {reports.map((report) => (
                  <div
                    key={report._id}
                    className="rounded-xl border border-red-100 bg-red-50/60 p-3.5"
                  >
                    <div className="mb-2 flex items-center gap-2.5">
                      <Avatar
                        src={report.author?.photoUrl}
                        size={32}
                        icon={<UserOutlined />}
                      />
                      <div className="min-w-0">
                        <Text strong className="block text-sm">
                          {report.author?.firstName} {report.author?.lastName}
                        </Text>
                        <div className="text-[11px] text-gray-400">
                          {moment(report.createdAt).format(
                            "MMM D, YYYY • h:mm A",
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg bg-white/70 px-3 py-2 text-sm text-gray-700">
                      <span className="font-medium text-red-600">Reason: </span>
                      {report.reason}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ========== APPEALS SECTION ========== */}
          <div className="mb-6">
            <div className="mb-3 flex items-center gap-2">
              <SafetyCertificateOutlined className="text-blue-500" />
              <Text strong className="text-base text-blue-600">
                Appeals ({appeals.length})
              </Text>
            </div>

            {appeals.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 py-6 text-center text-sm text-gray-400">
                No appeals submitted
              </div>
            ) : (
              <div className="max-h-64 space-y-4 overflow-y-auto pr-1">
                {appeals.map((appeal) => (
                  <div
                    key={appeal._id}
                    className="rounded-xl border border-blue-100 bg-blue-50/50 p-4"
                  >
                    <div className="mb-3 flex items-center gap-2.5">
                      <Avatar
                        src={appeal.user?.photoUrl}
                        size={32}
                        icon={<UserOutlined />}
                      />
                      <div className="min-w-0">
                        <Text strong className="block text-sm">
                          {appeal.user?.firstName} {appeal.user?.lastName}
                        </Text>
                        <div className="text-[11px] text-gray-400">
                          {moment(appeal.createdAt).format(
                            "MMM D, YYYY • h:mm A",
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mb-3 rounded-lg bg-white/80 px-3 py-2 text-sm text-gray-700">
                      <span className="font-medium text-blue-600">
                        Reason:{" "}
                      </span>
                      {appeal.reason}
                    </div>

                    {appeal.files?.length > 0 && (
                      <div>
                        <Text
                          strong
                          className="mb-2 block text-xs text-gray-500"
                        >
                          Attached Files ({appeal.files.length})
                        </Text>
                        <AntImage.PreviewGroup>
                          <div className="flex flex-wrap gap-2">
                            {appeal.files.map((fileUrl, idx) => (
                              <div
                                key={idx}
                                className="relative h-20 w-20 overflow-hidden rounded-lg border border-gray-200 bg-white"
                              >
                                {isVideo(fileUrl) ? (
                                  <a
                                    href={fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-full w-full items-center justify-center bg-gray-100"
                                  >
                                    <PlayCircleOutlined className="text-2xl text-gray-600" />
                                  </a>
                                ) : (
                                  <AntImage
                                    src={fileUrl}
                                    alt={`appeal-file-${idx}`}
                                    className="h-full w-full object-cover"
                                    style={{ height: "100%", width: "100%" }}
                                    preview={{
                                      mask: (
                                        <div className="flex items-center gap-1 text-xs">
                                          <FileImageOutlined /> View
                                        </div>
                                      ),
                                    }}
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        </AntImage.PreviewGroup>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Close Button */}
          <div className="pt-2">
            <Button
              block
              size="large"
              onClick={handleClose}
              className="rounded-xl"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ViolationModal;
