"use client";

import { useGetSingleUserQuery } from "@/redux/api/userApi";
import { Modal, Spin, Tag, Progress, Empty } from "antd";
import Image from "next/image";
import moment from "moment";

export default function ProfileModal({ open, setOpen, role, selectedUser }) {
  const handleCancel = () => setOpen(false);

  const { data, isLoading, isError } = useGetSingleUserQuery(selectedUser?.id, {
    skip: !selectedUser?.id || !open,
  });

  const user = data?.data;

  const fullName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
    : selectedUser?.name || "—";

  const photo =
    user?.photoUrl || selectedUser?.userImg || "/placeholder-avatar.png";

  // ========== EXPERT VIEW ==========
  const ExpertView = () => (
    <div className="max-h-[80vh] overflow-y-auto">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-[#962E84] via-[#1b71a7] to-[#D83578] px-8 pb-10 pt-8">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-purple-500/10 blur-2xl" />

        <div className="relative mx-auto mb-4 h-28 w-28">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#D83578] to-[#962E84] blur-md" />
          <Image
            src={photo}
            alt={fullName}
            width={112}
            height={112}
            className="relative h-28 w-28 rounded-full border-4 border-white object-cover shadow-xl"
          />
        </div>

        <h2 className="text-center text-2xl font-bold text-white">
          {fullName}
        </h2>
        {user?.headline && (
          <p className="mt-1 text-center text-sm text-white/90">
            {user.headline}
          </p>
        )}
        <div className="mt-2 flex justify-center gap-2">
          <Tag color="blue" className="rounded-full border-0 px-3">
            Expert
          </Tag>
          <Tag
            color={user?.status === "active" ? "success" : "error"}
            className="rounded-full border-0 px-3 capitalize"
          >
            {user?.status}
          </Tag>
          {user?.isTopExpert && (
            <Tag color="gold" className="rounded-full border-0 px-3">
              Top Expert
            </Tag>
          )}
        </div>
      </div>

      <div className="space-y-6 p-6">
        {/* Bio */}
        {user?.bio && (
          <div>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Bio
            </h3>
            <p className="text-sm leading-relaxed text-gray-700">{user.bio}</p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard
            label="Followers"
            value={user?.followers ?? 0}
            color="pink"
          />
          <StatCard
            label="Following"
            value={user?.following ?? 0}
            color="blue"
          />
          <StatCard label="Points" value={user?.points ?? 0} color="amber" />
          <StatCard
            label="Avg Rating"
            value={user?.avgRating ?? 0}
            color="yellow"
          />
          <StatCard
            label="Total Bookings"
            value={user?.totalBookings ?? 0}
            color="purple"
          />
          <StatCard
            label="Pending"
            value={user?.pendingBookings ?? 0}
            color="orange"
          />
          <StatCard
            label="Profile Views"
            value={user?.profileViewCount ?? 0}
            color="cyan"
          />
          <StatCard
            label="Attendance"
            value={`${user?.avgAttendance ?? 0}%`}
            color="green"
          />
        </div>

        {/* Profile Progress */}
        <div>
          <div className="mb-1 flex justify-between text-sm">
            <span className="font-medium text-gray-700">Profile Setup</span>
            <span className="text-gray-500">
              {user?.profileSetupProgress ?? 0}%
            </span>
          </div>
          <Progress
            percent={user?.profileSetupProgress ?? 0}
            strokeColor={{ from: "#962E84", to: "#1b71a7" }}
            showInfo={false}
          />
        </div>

        {/* Contact & Basic Info */}
        <Section title="Contact & Info">
          <InfoRow label="Email" value={user?.email} />
          <InfoRow label="Phone" value={user?.phoneNumber || "—"} />
          <InfoRow label="Country" value={user?.country || "—"} />
          <InfoRow label="Timezone" value={user?.timeZone || "—"} />
          <InfoRow label="User ID" value={user?.id || "—"} />
          <InfoRow
            label="Joined"
            value={
              user?.createdAt
                ? moment(user.createdAt).format("MMM D, YYYY")
                : "—"
            }
          />
          <InfoRow label="Referral Code" value={user?.referralCode || "—"} />
        </Section>

        {/* Pricing */}
        <Section title="Pricing & Sessions">
          <InfoRow
            label="Hourly Rate"
            value={user?.hourlyRate ? `£${user.hourlyRate}` : "—"}
          />
          <InfoRow
            label="Advising Time"
            value={user?.advisingTime ? `${user.advisingTime} min` : "—"}
          />
          <InfoRow
            label="VAT Registered"
            value={user?.isVatRegistered || user?.isVatRegisted ? "Yes" : "No"}
          />
          {(user?.isVatRegistered || user?.isVatRegisted) && (
            <>
              <InfoRow
                label="VAT Number"
                value={user?.vatRegistrationNumber || "—"}
              />
              <InfoRow
                label="VAT %"
                value={user?.vatPercentage ? `${user.vatPercentage}%` : "—"}
              />
            </>
          )}
          <InfoRow
            label="Stripe Connected"
            value={user?.isConnectedStripe ? "Yes" : "No"}
          />
          <InfoRow
            label="Pending Withdraw"
            value={
              user?.pendingWithdraw != null ? `£${user.pendingWithdraw}` : "—"
            }
          />
          <InfoRow
            label="Total Withdraw"
            value={user?.totalWithdraw != null ? `£${user.totalWithdraw}` : "—"}
          />
        </Section>

        {/* Session Durations */}
        {user?.sessionDurations?.length > 0 && (
          <Section title="Session Packages">
            <div className="grid gap-2 sm:grid-cols-3">
              {user.sessionDurations.map((s, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-center"
                >
                  <p className="text-xs font-medium text-gray-500">{s.type}</p>
                  <p className="mt-1 text-lg font-bold text-gray-900">
                    {s.duration} min
                  </p>
                  <p className="text-sm font-semibold text-blue-600">
                    £{s.offeredPrice ?? s.price}
                  </p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Availability */}
        {user?.availability?.length > 0 && (
          <Section title="Availability">
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
          </Section>
        )}

        {/* Expertise */}
        {user?.expertise?.length > 0 && (
          <Section title="Key Expertise">
            <div className="flex flex-wrap gap-2">
              {user.expertise.map((item, i) => (
                <Tag key={i} color="blue" className="rounded-full px-3 py-0.5">
                  {item}
                </Tag>
              ))}
            </div>
          </Section>
        )}

        {/* Skills */}
        {user?.skills?.length > 0 && (
          <Section title="Skills">
            <div className="flex max-h-40 flex-wrap gap-2 overflow-y-auto">
              {user.skills.map((skill, i) => (
                <Tag
                  key={i}
                  className="rounded-full border-blue-100 bg-blue-50 px-3 py-0.5 text-blue-700"
                >
                  {skill}
                </Tag>
              ))}
            </div>
          </Section>
        )}

        {/* Advising Styles */}
        {user?.advisingStyles?.length > 0 && (
          <Section title="Advising Styles">
            <div className="flex flex-wrap gap-2">
              {user.advisingStyles.map((style, i) => (
                <Tag
                  key={i}
                  color="purple"
                  className="rounded-full px-3 py-0.5"
                >
                  {style}
                </Tag>
              ))}
            </div>
          </Section>
        )}

        {/* Languages */}
        {user?.languages?.length > 0 && (
          <Section title="Languages">
            <div className="flex flex-wrap gap-2">
              {user.languages.map((lang, i) => (
                <Tag key={i} className="rounded-full px-3 py-0.5">
                  {lang}
                </Tag>
              ))}
            </div>
          </Section>
        )}

        {/* Education */}
        {(user?.education?.degree ||
          user?.education?.phd ||
          user?.education?.certificate?.length > 0) && (
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
  );

  // ========== CONSULT VIEW ==========
  const ConsultView = () => (
    <div className="max-h-[80vh] overflow-y-auto">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-[#962E84] via-[#1b71a7] to-[#D83578] px-8 pb-10 pt-8">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-purple-500/10 blur-2xl" />

        <div className="relative mx-auto mb-4 h-28 w-28">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#D83578] to-[#962E84] blur-md" />
          <Image
            src={photo}
            alt={fullName}
            width={112}
            height={112}
            className="relative h-28 w-28 rounded-full border-4 border-white object-cover shadow-xl"
          />
        </div>

        <h2 className="text-center text-2xl font-bold text-white">
          {fullName}
        </h2>
        {user?.headline && (
          <p className="mt-1 text-center text-sm text-white/90">
            {user.headline}
          </p>
        )}
        <div className="mt-2 flex justify-center gap-2">
          <Tag color="cyan" className="rounded-full border-0 px-3">
            Consultant
          </Tag>
          <Tag
            color={user?.status === "active" ? "success" : "error"}
            className="rounded-full border-0 px-3 capitalize"
          >
            {user?.status}
          </Tag>
        </div>
      </div>

      <div className="space-y-6 p-6">
        {/* Bio */}
        {user?.bio && (
          <div>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Bio
            </h3>
            <p className="text-sm leading-relaxed text-gray-700">{user.bio}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard
            label="Followers"
            value={user?.followers ?? 0}
            color="pink"
          />
          <StatCard
            label="Following"
            value={user?.following ?? 0}
            color="blue"
          />
          <StatCard label="Points" value={user?.points ?? 0} color="amber" />
          <StatCard
            label="Total Bookings"
            value={user?.totalBookings ?? 0}
            color="purple"
          />
          <StatCard
            label="Pending"
            value={user?.pendingBookings ?? 0}
            color="orange"
          />
          <StatCard
            label="Profile Views"
            value={user?.profileViewCount ?? 0}
            color="cyan"
          />
          <StatCard
            label="Attendance"
            value={`${user?.avgAttendance ?? 0}%`}
            color="green"
          />
          <StatCard
            label="Price Range"
            value={user?.priceRange || "—"}
            color="indigo"
          />
        </div>

        {/* Profile Progress */}
        <div>
          <div className="mb-1 flex justify-between text-sm">
            <span className="font-medium text-gray-700">Profile Setup</span>
            <span className="text-gray-500">
              {user?.profileSetupProgress ?? 0}%
            </span>
          </div>
          <Progress
            percent={user?.profileSetupProgress ?? 0}
            strokeColor={{ from: "#962E84", to: "#1b71a7" }}
            showInfo={false}
          />
        </div>

        {/* Contact */}
        <Section title="Contact & Info">
          <InfoRow label="Email" value={user?.email} />
          <InfoRow label="Phone" value={user?.phoneNumber || "—"} />
          <InfoRow label="Country" value={user?.country || "—"} />
          <InfoRow label="Timezone" value={user?.timeZone || "—"} />
          <InfoRow label="User ID" value={user?.id || "—"} />
          <InfoRow
            label="Joined"
            value={
              user?.createdAt
                ? moment(user.createdAt).format("MMM D, YYYY")
                : "—"
            }
          />
          <InfoRow label="Referral Code" value={user?.referralCode || "—"} />
        </Section>

        {/* Interests */}
        {user?.interests?.length > 0 && (
          <Section title="Interests">
            <div className="flex max-h-40 flex-wrap gap-2 overflow-y-auto">
              {user.interests.map((item, i) => (
                <Tag key={i} color="blue" className="rounded-full px-3 py-0.5">
                  {item}
                </Tag>
              ))}
            </div>
          </Section>
        )}

        {/* Learning Styles */}
        {user?.learningStyles?.length > 0 && (
          <Section title="Learning Styles">
            <div className="flex flex-wrap gap-2">
              {user.learningStyles.map((style, i) => (
                <Tag
                  key={i}
                  color="purple"
                  className="rounded-full px-3 py-0.5"
                >
                  {style}
                </Tag>
              ))}
            </div>
          </Section>
        )}

        {/* Languages */}
        {user?.languages?.length > 0 && (
          <Section title="Languages">
            <div className="flex flex-wrap gap-2">
              {user.languages.map((lang, i) => (
                <Tag key={i} className="rounded-full px-3 py-0.5">
                  {lang}
                </Tag>
              ))}
            </div>
          </Section>
        )}
      </div>
    </div>
  );

  return (
    <Modal
      centered
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={980}
      destroyOnClose
      styles={{ body: { padding: 0 } }}
    >
      <div className="overflow-hidden rounded-2xl">
        {isLoading ? (
          <div className="flex h-80 items-center justify-center">
            <Spin size="large" />
          </div>
        ) : isError || !user ? (
          <div className="flex h-80 items-center justify-center">
            <Empty description="Failed to load profile" />
          </div>
        ) : user.role === "expert" || role === "expert" ? (
          <ExpertView />
        ) : (
          <ConsultView />
        )}
      </div>
    </Modal>
  );
}

/* ========== Small helpers ========== */

function Section({ title, children }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
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

function StatCard({ label, value, color = "blue" }) {
  const colors = {
    pink: "bg-pink-50 text-pink-600",
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    yellow: "bg-yellow-50 text-yellow-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
    cyan: "bg-cyan-50 text-cyan-600",
    green: "bg-green-50 text-green-600",
    indigo: "bg-indigo-50 text-indigo-600",
  };

  return (
    <div className={`rounded-xl p-3 ${colors[color] || colors.blue}`}>
      <p className="text-[11px] font-medium opacity-80">{label}</p>
      <p className="mt-1 text-xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
