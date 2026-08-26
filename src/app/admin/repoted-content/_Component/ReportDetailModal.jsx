"use client";

import { useState } from "react";
import {
  Modal,
  Spin,
  Empty,
  Tag,
  Avatar,
  Image as AntImage,
  Image,
} from "antd";
import {
  WarningOutlined,
  UserOutlined,
  PlayCircleOutlined,
  FileOutlined,
} from "@ant-design/icons";
import { useGetSingleReportedContentQuery } from "@/redux/api/reportedContentApi";
import moment from "moment";

const isVideo = (url = "") => {
  const u = url.toLowerCase();
  return (
    u.endsWith(".mp4") ||
    u.endsWith(".webm") ||
    u.endsWith(".mov") ||
    u.includes("/videos/")
  );
};

export default function ReportDetailModal({ open, onClose, reportId }) {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  const { data, isLoading, isError } = useGetSingleReportedContentQuery(
    reportId,
    { skip: !reportId || !open },
  );

  const report = data?.data;
  const feed = report?.feed;
  const mediaList = feed?.content || [];
  const appeals = report?.appeals || [];

  const handleClose = () => {
    setActiveMediaIndex(0);
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      width={920}
      centered
      destroyOnClose
      styles={{
        body: { padding: 0, maxHeight: "85vh", overflowY: "auto" },
      }}
    >
      {isLoading ? (
        <div className="flex h-80 items-center justify-center">
          <Spin size="large" />
        </div>
      ) : isError || !report ? (
        <div className="flex h-80 items-center justify-center">
          <Empty description="Failed to load report details" />
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row">
          {/* ========== Left: Feed Media ========== */}
          <div className="relative w-full bg-black lg:w-[50%]">
            {!feed || mediaList.length === 0 ? (
              <div className="flex h-[380px] items-center justify-center bg-gray-900 text-white">
                No media available
              </div>
            ) : (
              <>
                <div className="relative flex h-[380px] items-center justify-center overflow-hidden">
                  {isVideo(mediaList[activeMediaIndex]) ? (
                    <video
                      key={mediaList[activeMediaIndex]}
                      controls
                      autoPlay
                      className="max-h-full max-w-full object-contain"
                      src={mediaList[activeMediaIndex]}
                    />
                  ) : (
                    <Image
                      src={mediaList[activeMediaIndex]}
                      alt={`media-${activeMediaIndex}`}
                      className="max-h-full max-w-full object-contain"
                    />
                  )}
                </div>

                {mediaList.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto bg-black/80 px-3 py-3">
                    {mediaList.map((media, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveMediaIndex(idx)}
                        className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                          activeMediaIndex === idx
                            ? "border-blue-500"
                            : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                      >
                        {isVideo(media) ? (
                          <div className="flex h-full w-full items-center justify-center bg-gray-800">
                            <PlayCircleOutlined className="text-xl text-white" />
                          </div>
                        ) : (
                          <Image
                            src={media}
                            alt={`thumb-${idx}`}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* ========== Right: Details ========== */}
          <div className="flex w-full flex-col p-6 lg:w-[50%]">
            {/* Report header */}
            <div className="mb-4 flex items-center gap-2">
              <WarningOutlined className="text-lg text-red-500" />
              <h2 className="text-lg font-bold text-gray-900">
                Report Details
              </h2>
              <Tag
                color={
                  report.status === "pending"
                    ? "orange"
                    : report.status === "resolved"
                      ? "green"
                      : "default"
                }
                className="ml-auto capitalize"
              >
                {report.status || "pending"}
              </Tag>
            </div>

            {/* Reporter */}
            <div className="mb-4 rounded-xl border border-gray-100 bg-gray-50 p-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Reported By
              </p>
              <div className="flex items-center gap-3">
                <Avatar
                  src={report.author?.photoUrl}
                  size={40}
                  icon={<UserOutlined />}
                />
                <div>
                  <p className="font-semibold text-gray-900">
                    {report.author?.firstName} {report.author?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {moment(report.createdAt).format("MMM D, YYYY • h:mm A")}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-700">
                <span className="font-medium text-gray-500">Reason: </span>
                {report.reason}
              </p>
            </div>

            {/* Feed info */}
            {feed && (
              <div className="mb-4 rounded-xl border border-gray-100 p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Reported Post
                </p>
                <div className="mb-2 flex items-center gap-2">
                  <Avatar
                    src={feed.author?.photoUrl}
                    size={32}
                    icon={<UserOutlined />}
                  />
                  <span className="text-sm font-medium">
                    {feed.author?.firstName} {feed.author?.lastName}
                  </span>
                </div>
                {feed.description && (
                  <p className="mb-2 text-sm text-gray-700">
                    {feed.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  <Tag color={feed.status === "active" ? "green" : "red"}>
                    Status: {(feed.status || "—").toUpperCase()}
                  </Tag>
                  {feed.moderationStatus && (
                    <Tag color="orange">
                      Moderation: {feed.moderationStatus.toUpperCase()}
                    </Tag>
                  )}
                </div>
                {feed.reason && (
                  <p className="mt-2 text-xs text-gray-500">
                    Moderation reason: {feed.reason}
                  </p>
                )}
              </div>
            )}

            {/* ========== Appeals (Highlighted) ========== */}
            <div className="mt-auto">
              <div className="mb-3 flex items-center gap-2">
                <h3 className="text-sm font-bold uppercase tracking-wide text-gray-700">
                  Appeals
                </h3>
                <Tag color={appeals.length > 0 ? "blue" : "default"}>
                  {appeals.length}
                </Tag>
              </div>

              {appeals.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-center">
                  <p className="text-sm font-medium text-gray-500">
                    No appeals submitted
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    The post author has not appealed this report yet.
                  </p>
                </div>
              ) : (
                <div className="max-h-56 space-y-3 overflow-y-auto pr-1">
                  {appeals.map((appeal) => (
                    <div
                      key={appeal._id}
                      className="rounded-xl border-2 border-blue-200 bg-blue-50/60 p-4 shadow-sm"
                    >
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Avatar
                            src={appeal.user?.photoUrl}
                            size={32}
                            icon={<UserOutlined />}
                          />
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {appeal.user?.firstName} {appeal.user?.lastName}
                            </p>
                            <p className="text-[11px] text-gray-500">
                              {appeal.user?.email}
                            </p>
                          </div>
                        </div>
                        <Tag
                          color={
                            appeal.status === "pending"
                              ? "orange"
                              : appeal.status === "approved"
                                ? "green"
                                : "red"
                          }
                          className="capitalize"
                        >
                          {appeal.status}
                        </Tag>
                      </div>

                      <p className="mb-2 text-sm text-gray-800">
                        {appeal.reason}
                      </p>

                      {appeal.files?.length > 0 && (
                        <div className="mt-2">
                          <p className="mb-1 text-xs font-medium text-gray-500">
                            Evidence files
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {appeal.files.map((file, i) => {
                              const isImg =
                                file.match(/\.(jpg|jpeg|png|gif|webp)$/i) ||
                                file.includes("/images/");
                              return isImg ? (
                                <AntImage
                                  key={i}
                                  src={file}
                                  width={56}
                                  height={56}
                                  className="rounded-lg object-cover"
                                />
                              ) : (
                                <a
                                  key={i}
                                  href={file}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center gap-1 rounded-lg border border-blue-200 bg-white px-2 py-1 text-xs text-blue-700 hover:bg-blue-50"
                                >
                                  <FileOutlined />
                                  File {i + 1}
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      <p className="mt-2 text-[11px] text-gray-400">
                        {moment(appeal.createdAt).format(
                          "MMM D, YYYY • h:mm A",
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
