"use client";

import { useGetSingleUserQuery } from "@/redux/api/userApi";
import { Modal, Tag, Progress, Empty, Spin } from "antd";
import Image from "next/image";
import moment from "moment";
import { useState } from "react";
import ExpertBookingsModal from "./ExpertBookingsModal";
import { UserX } from "lucide-react";

const STAT_COLORS = {
  pink: "bg-pink-50 text-pink-600",
  blue: "bg-blue-50 text-blue-600",
  amber: "bg-amber-50 text-amber-600",
  yellow: "bg-yellow-50 text-yellow-600",
  purple: "bg-purple-50 text-purple-600",
  orange: "bg-orange-50 text-orange-600",
  cyan: "bg-cyan-50 text-cyan-600",
  green: "bg-green-50 text-green-600",
  indigo: "bg-indigo-50 text-indigo-600",
  red: "bg-red-50 text-red-600",
  gray: "bg-gray-100 text-gray-600",
};

// Utility class to hide scrollbars while keeping scroll functionality
const NO_SCROLLBAR =
  "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]";

export default function ProfileModal({ open, setOpen, role, selectedUser }) {
  const [bookingsModalOpen, setBookingsModalOpen] = useState(false);
  const handleCancel = () => setOpen(false);

  const { data, isLoading, isError } = useGetSingleUserQuery(selectedUser?.id, {
    skip: !selectedUser?.id || !open,
  });

  const user = data?.data;
  const isExpert = user?.role === "expert" || role === "expert";

  const fullName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
    : selectedUser?.name || "—";

  const photo = user?.photoUrl || selectedUser?.userImg || <UserX size={112} />;

  return (
    <Modal
      centered
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={1080}
      destroyOnClose
      styles={{ body: { padding: 0 } }}
    >
      <div className="overflow-hidden rounded-2xl">
        {isLoading ? (
          <div className="flex h-96 items-center justify-center">
            <Spin size="large" />
          </div>
        ) : isError || !user ? (
          <div className="flex h-96 items-center justify-center">
            <Empty description="Failed to load profile" />
          </div>
        ) : (
          <div className={`max-h-[85vh] overflow-y-auto ${NO_SCROLLBAR}`}>
            <ProfileHeader
              user={user}
              fullName={fullName}
              photo={photo}
              isExpert={isExpert}
            />

            <div className="space-y-7 p-6 sm:p-8">
              {/* Bio */}
              {user.bio && (
                <div>
                  <SectionTitle>Bio</SectionTitle>
                  <p className="text-sm leading-relaxed text-gray-600">
                    {user.bio}
                  </p>
                </div>
              )}

              {/* Overview stats */}
              <div>
                <SectionTitle>Overview</SectionTitle>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                  <StatCard
                    label="Followers"
                    value={user.followers ?? 0}
                    color="pink"
                  />
                  <StatCard
                    label="Following"
                    value={user.following ?? 0}
                    color="blue"
                  />
                  <StatCard
                    label="Points"
                    value={user.points ?? 0}
                    color="amber"
                  />
                  {isExpert && (
                    <StatCard
                      label="Avg Rating"
                      value={user.avgRating ?? 0}
                      color="yellow"
                    />
                  )}
                  <StatCard
                    label="Profile Views"
                    value={user.profileViewCount ?? 0}
                    color="cyan"
                  />
                  {!isExpert && (
                    <StatCard
                      label="Price Range"
                      value={user.priceRange || "—"}
                      color="indigo"
                    />
                  )}
                </div>
              </div>

              {/* Booking stats — grouped separately for clarity */}
              <div>
                <SectionTitle>Bookings</SectionTitle>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                  <StatCard
                    label="Total"
                    value={user.totalBookings ?? 0}
                    color="purple"
                    clickable={isExpert && (user.totalBookings ?? 0) > 0}
                    onClick={() => setBookingsModalOpen(true)}
                  />
                  <StatCard
                    label="Pending"
                    value={user.pendingBookings ?? 0}
                    color="orange"
                  />
                  <StatCard
                    label="Cancelled"
                    value={user.cancellationBookings ?? 0}
                    color="red"
                  />
                  <StatCard
                    label="No-Show"
                    value={user.noShowBookings ?? 0}
                    color="gray"
                  />
                  <StatCard
                    label="Attendance"
                    value={`${user.avgAttendance ?? 0}%`}
                    color="green"
                  />
                </div>
              </div>

              {/* Profile completion */}
              <div>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">
                    Profile Setup
                  </span>
                  <span className="text-gray-500">
                    {user.profileSetupProgress ?? 0}%
                  </span>
                </div>
                <Progress
                  percent={user.profileSetupProgress ?? 0}
                  strokeColor={{ from: "#962E84", to: "#1b71a7" }}
                  showInfo={false}
                />
              </div>

              {/* Contact & info */}
              <Section title="Contact & Info">
                <InfoRow label="Email" value={user.email} />
                <InfoRow label="Phone" value={user.phoneNumber} />
                <InfoRow label="Country" value={user.country} />
                <InfoRow label="Timezone" value={user.timeZone} />
                <InfoRow label="User ID" value={user.id} />
                <InfoRow
                  label="Joined"
                  value={
                    user.createdAt
                      ? moment(user.createdAt).format("MMM D, YYYY")
                      : null
                  }
                />
                <InfoRow
                  label="Last Active"
                  value={
                    user.lastLogAt ? moment(user.lastLogAt).fromNow() : null
                  }
                />
                <InfoRow label="Referral Code" value={user.referralCode} />
              </Section>

              {/* Expert-only: pricing */}
              {isExpert && (
                <Section title="Pricing & Sessions">
                  <InfoRow
                    label="Hourly Rate"
                    value={user.hourlyRate ? `£${user.hourlyRate}` : null}
                  />
                  <InfoRow
                    label="Advising Time"
                    value={
                      user.advisingTime ? `${user.advisingTime} min` : null
                    }
                  />
                  <InfoRow
                    label="VAT Registered"
                    value={
                      user.isVatRegistered || user.isVatRegisted ? "Yes" : "No"
                    }
                  />
                  {(user.isVatRegistered || user.isVatRegisted) && (
                    <>
                      <InfoRow
                        label="VAT Number"
                        value={user.vatRegistrationNumber}
                      />
                      <InfoRow
                        label="VAT %"
                        value={
                          user.vatPercentage ? `${user.vatPercentage}%` : null
                        }
                      />
                    </>
                  )}
                  <InfoRow
                    label="Stripe Connected"
                    value={user.isConnectedStripe ? "Yes" : "No"}
                  />
                  <InfoRow
                    label="Pending Withdraw"
                    value={
                      user.pendingWithdraw != null
                        ? `£${user.pendingWithdraw}`
                        : null
                    }
                  />
                  <InfoRow
                    label="Total Withdraw"
                    value={
                      user.totalWithdraw != null
                        ? `£${user.totalWithdraw}`
                        : null
                    }
                  />
                </Section>
              )}

              {/* Expert-only: session packages */}
              {isExpert && user.sessionDurations?.length > 0 && (
                <div>
                  <SectionTitle>Session Packages</SectionTitle>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {user.sessionDurations.map((s, i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-center"
                      >
                        <p className="text-xs font-medium text-gray-500">
                          {s.type}
                        </p>
                        <p className="mt-1 text-lg font-bold text-gray-900">
                          {s.duration} min
                        </p>
                        <p className="text-sm font-semibold text-blue-600">
                          £{s.offeredPrice ?? s.price}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Expert-only: availability */}
              {isExpert && user.availability?.length > 0 && (
                <div>
                  <SectionTitle>Availability</SectionTitle>
                  <div className="flex flex-wrap gap-2">
                    {user.availability.map((a, i) => (
                      <div
                        key={i}
                        className="rounded-lg border border-gray-100 bg-white px-3 py-2 text-sm"
                      >
                        <span className="font-semibold capitalize text-gray-800">
                          {a.day}
                        </span>
                        <span className="ml-2 text-gray-500">
                          {a.slots?.map((s) => `${s.from}–${s.to}`).join(", ")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tag-based sections */}
              <TagSection
                title="Key Expertise"
                items={user.expertise}
                color="blue"
                show={isExpert}
              />
              <TagSection
                title="Skills"
                items={user.skills}
                show={isExpert}
                scroll
                tagClassName="rounded-full border-blue-100 bg-blue-50 px-3 py-0.5 text-blue-700"
              />
              <TagSection
                title="Advising Styles"
                items={user.advisingStyles}
                color="purple"
                show={isExpert}
              />
              <TagSection
                title="Interests"
                items={user.interests}
                color="blue"
                show={!isExpert}
                scroll
              />
              <TagSection
                title="Learning Styles"
                items={user.learningStyles}
                color="purple"
                show={!isExpert}
              />
              <TagSection title="Languages" items={user.languages} />

              {/* Expert-only: education */}
              {isExpert &&
                (user.education?.degree ||
                  user.education?.phd ||
                  user.education?.certificate?.length > 0) && (
                  <Section title="Education">
                    {user.education.degree && (
                      <InfoRow label="Degree" value={user.education.degree} />
                    )}
                    {user.education.phd && (
                      <InfoRow label="PhD" value={user.education.phd} />
                    )}
                    {user.education.certificate?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {user.education.certificate.map((c, i) => (
                          <Tag key={i}>{c}</Tag>
                        ))}
                      </div>
                    )}
                  </Section>
                )}
            </div>
          </div>
        )}
      </div>

      <ExpertBookingsModal
        open={bookingsModalOpen}
        setOpen={setBookingsModalOpen}
        expertId={selectedUser?.id}
        expertName={fullName}
      />
    </Modal>
  );
}

/* ========== Header ========== */

function ProfileHeader({ user, fullName, photo, isExpert }) {
  return (
    <div className="relative bg-gradient-to-br from-[#962E84] via-[#1b71a7] to-[#D83578] px-6 pb-9 pt-8 sm:px-10">
      <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-24 w-24 rounded-full bg-purple-500/10 blur-2xl" />

      <div className="relative mx-auto mb-4 h-28 w-28">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#D83578] to-[#962E84] blur-md" />
        {photo ? (
          <Image
            src={photo}
            alt={fullName}
            width={112}
            height={112}
            className="relative h-28 w-28 rounded-full border-4 border-white object-cover shadow-xl"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
            <UserX size={24} color="#9CA3AF" />
          </div>
        )}
      </div>

      <h2 className="text-center text-2xl font-bold text-white">{fullName}</h2>
      {user.headline && (
        <p className="mt-1 text-center text-sm text-white/90">
          {user.headline}
        </p>
      )}

      <div className="mt-3 flex flex-wrap justify-center gap-2">
        <Tag
          color={isExpert ? "blue" : "cyan"}
          className="rounded-full border-0 px-3"
        >
          {isExpert ? "Expert" : "Consultant"}
        </Tag>
        <Tag
          color={user.status === "active" ? "success" : "error"}
          className="rounded-full border-0 px-3 capitalize"
        >
          {user.status}
        </Tag>
        {isExpert && user.isTopExpert && (
          <Tag color="gold" className="rounded-full border-0 px-3">
            Top Expert
          </Tag>
        )}
      </div>
    </div>
  );
}

/* ========== Small helpers ========== */

function SectionTitle({ children }) {
  return (
    <h3 className="mb-2.5 text-sm font-semibold uppercase tracking-wide text-gray-500">
      {children}
    </h3>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <SectionTitle>{title}</SectionTitle>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function TagSection({
  title,
  items,
  show = true,
  scroll = false,
  color,
  tagClassName = "rounded-full px-3 py-0.5",
}) {
  if (!show || !items?.length) return null;
  return (
    <div>
      <SectionTitle>{title}</SectionTitle>
      <div
        className={`flex flex-wrap gap-2 ${scroll ? `max-h-40 overflow-y-auto ${NO_SCROLLBAR}` : ""}`}
      >
        {items.map((item, i) => (
          <Tag key={i} color={color} className={tagClassName}>
            {item}
          </Tag>
        ))}
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-gray-50 py-2 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-right text-sm font-medium text-gray-900">
        {value || "—"}
      </span>
    </div>
  );
}

function StatCard({
  label,
  value,
  color = "blue",
  clickable = false,
  onClick,
}) {
  return (
    <div
      onClick={clickable ? onClick : undefined}
      className={`rounded-xl p-3 transition ${STAT_COLORS[color] || STAT_COLORS.blue} ${
        clickable ? "cursor-pointer hover:shadow-md hover:brightness-95" : ""
      }`}
    >
      <p className="text-[11px] font-medium opacity-80">{label}</p>
      <p className="mt-1 text-xl font-bold text-gray-900">{value}</p>
      {clickable && (
        <p className="mt-1 text-[10px] font-medium opacity-80">
          View details →
        </p>
      )}
    </div>
  );
}
