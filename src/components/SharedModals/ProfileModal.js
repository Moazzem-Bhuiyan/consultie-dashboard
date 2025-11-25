"use client";

import { Modal } from "antd";
import Image from "next/image";

export default function ProfileModal({ open, setOpen, role }) {
  const handleCancel = () => {
    setOpen(false);
  };

  // Consultant view component
  const ConsultantView = () => (
    <>
      {/* Header section with gradient */}
      <div className="relative bg-gradient-to-br from-[#962E84] via-[#1b71a7] to-[#D83578] px-8 pb-12 pt-8">
        {/* Decorative elements */}
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-purple-500/10 blur-2xl" />

        {/* Avatar */}
        <div className="relative mx-auto mb-4 h-24 w-24">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#D83578] to-[#962E84] blur-md" />
          <Image
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop"
            alt="Profile"
            width={96}
            height={96}
            className="relative h-24 w-24 rounded-full border-4 border-white object-cover shadow-xl"
          />
        </div>

        {/* Name */}
        <h2 className="text-center text-2xl font-bold text-white">
          Kristy Campbell
        </h2>
        <p className="text-center text-sm text-gray-100">
          Property Investor at Pinkpony
        </p>
      </div>

      {/* Consultant Stats section */}
      <div className="space-y-6 p-8">
        {/* Following and Followers */}
        <div className="flex gap-8 text-center">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">187</h3>
            <p className="text-sm text-gray-500">Following</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">17k</h3>
            <p className="text-sm text-gray-500">Followers</p>
          </div>
        </div>

        {/* Consultz Stats */}
        <div>
          <h3 className="mb-4 text-lg font-bold text-gray-900">
            Consultz stats
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {/* Consultz Points */}
            <div className="rounded-lg bg-pink-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-200 text-pink-600">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <p className="text-xs font-semibold text-pink-600">
                  Consultz Points
                </p>
              </div>
              <h4 className="text-2xl font-bold text-gray-900">526</h4>
            </div>

            {/* Av. star rating */}
            <div className="rounded-lg bg-yellow-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-200 text-yellow-600">
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <p className="text-xs font-semibold text-yellow-600">
                  Av. star rating
                </p>
              </div>
              <h4 className="text-2xl font-bold text-gray-900">4.9</h4>
            </div>

            {/* Av. attendance */}
            <div className="rounded-lg bg-purple-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-200 text-purple-600">
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-2.96-3.83c-.3-.39-.97-.39-1.25 0-.31.4-.32 1.02.05 1.37l3.6 4.55c.3.39.97.39 1.25 0L17.3 7.74c.37-.35.36-.98.05-1.37-.28-.39-.95-.39-1.25 0z" />
                  </svg>
                </div>
                <p className="text-xs font-semibold text-purple-600">
                  Av. attendance
                </p>
              </div>
              <h4 className="text-2xl font-bold text-gray-900">100%</h4>
            </div>

            {/* Advising time */}
            <div className="rounded-lg bg-green-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-200 text-green-600">
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                  </svg>
                </div>
                <p className="text-xs font-semibold text-green-600">
                  Advising time
                </p>
              </div>
              <h4 className="text-2xl font-bold text-gray-900">60 hrs</h4>
            </div>
          </div>
        </div>

        {/* Key expertise */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h4 className="font-bold text-gray-900">Key expertise</h4>
            <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
              Finance
            </a>
          </div>
        </div>

        {/* Language */}
        <div>
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-gray-900">Language</h4>
            <span className="text-sm text-gray-600">
              <a href="#" className="text-blue-600 hover:text-blue-700">
                +2
              </a>{" "}
              <a href="#" className="text-blue-600 hover:text-blue-700">
                English
              </a>
            </span>
          </div>
        </div>

        {/* Skills */}
        <div>
          <h4 className="mb-2 font-bold text-gray-900">Skills</h4>
          <div className="flex gap-2">
            <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
              Procurement
            </span>
            <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
              Sales
            </span>
          </div>
        </div>
      </div>
    </>
  );

  // User view component
  const UserView = () => (
    <>
      <div className="relative bg-gradient-to-br from-[#962E84] via-[#1b71a7] to-[#D83578] px-8 pb-12 pt-8">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-purple-500/10 blur-2xl" />

        <div className="relative mx-auto mb-4 h-24 w-24">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#D83578] to-[#962E84] blur-md" />
          <Image
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop"
            alt="Profile"
            width={96}
            height={96}
            className="relative h-24 w-24 rounded-full border-4 border-white object-cover shadow-xl"
          />
        </div>

        <h2 className="text-center text-2xl font-bold text-white">
          Justina Ojayluv
        </h2>
      </div>

      <div className="space-y-2 p-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded border p-10 pr-4">
            <h1 className="text-4xl font-semibold">10</h1>
            <h1>Total bookings</h1>
          </div>
          <div className="rounded-md border p-10 pl-4">
            <h1 className="text-4xl font-semibold">606</h1>
            <h1>Consultz points</h1>
          </div>
        </div>

        <div className="group rounded-xl border border-gray-100 p-4 transition-all hover:border-gray-200 hover:bg-gray-50">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Full Name
              </p>
              <p className="mt-1 text-base font-semibold text-gray-900">
                Justina Ojayluv
              </p>
            </div>
          </div>
        </div>

        <div className="group rounded-xl border border-gray-100 p-4 transition-all hover:border-gray-200 hover:bg-gray-50">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600 transition-colors group-hover:bg-purple-100">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Email Address
              </p>
              <p className="mt-1 text-base font-semibold text-gray-900">
                justina@gmail.com
              </p>
            </div>
          </div>
        </div>

        <div className="group rounded-xl border border-gray-100 p-4 transition-all hover:border-gray-200 hover:bg-gray-50">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600 transition-colors group-hover:bg-green-100">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Phone Number
              </p>
              <p className="mt-1 text-base font-semibold text-gray-900">
                +234 813 123 4567
              </p>
            </div>
          </div>
        </div>

        <div className="group rounded-xl border border-gray-100 p-4 transition-all hover:border-gray-200 hover:bg-gray-50">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600 transition-colors group-hover:bg-amber-100">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Job Role
              </p>
              <div className="mt-1">
                <span className="inline-flex items-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-3 py-1 text-sm font-semibold text-white shadow-sm">
                  Graphic Designer
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="group rounded-xl border border-gray-100 p-4 transition-all hover:border-gray-200 hover:bg-gray-50">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600 transition-colors group-hover:bg-amber-100">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Account Type
              </p>
              <div className="mt-1">
                <span className="inline-flex items-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-3 py-1 text-sm font-semibold text-white shadow-sm">
                  User
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <Modal
      centered
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={700}
    >
      <div className="overflow-hidden rounded-2xl">
        {role === "Consultant" ? <ConsultantView /> : <UserView />}
      </div>
    </Modal>
  );
}
