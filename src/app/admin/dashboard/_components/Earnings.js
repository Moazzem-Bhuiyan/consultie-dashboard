"use client";

import { Select } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";

const data = [
  { month: "Jan", earning: 120, commission: 10 },
  { month: "Feb", earning: 140, commission: 25 },
  { month: "Mar", earning: 150, commission: 10 },
  { month: "Apr", earning: 120, commission: 65 },
  { month: "May", earning: 153, commission: 10 },
  { month: "Jun", earning: 164, commission: 75 },
  { month: "Jul", earning: 193, commission: 15 },
  { month: "Aug", earning: 134, commission: 90 },
  { month: "Sep", earning: 184, commission: 15 },
  { month: "Oct", earning: 126, commission: 21 },
  { month: "Nov", earning: 164, commission: 15 },
  { month: "Dec", earning: 110, commission: 60 },
];

const EarningSummary = () => {
  const [selectedYear, setSelectedYear] = useState("2024");

  const handleChange = (value) => {
    setSelectedYear(value);
  };

  return (
    <div className="max-w-8xl mx-auto w-full rounded-lg bg-white p-6 shadow-lg">
      <div className="mb-10 flex items-center justify-between gap-2 lg:flex-wrap xl:flex-nowrap">
        <h1 className="text-xl font-bold">Revenue vs Commission</h1>

        <div className="space-x-3">
          <Select
            value={selectedYear}
            style={{ width: 120 }}
            onChange={handleChange}
            options={[
              { value: "2024", label: "2024" },
              { value: "2023", label: "2023" },
              { value: "2022", label: "2022" },
              { value: "2021", label: "2021" },
            ]}
          />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          {/* Define Gradient */}
          <defs>
            <linearGradient id="earningGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#BE32B0" stopOpacity={1} />
              <stop offset="100%" stopColor="#BE32B0" stopOpacity={0.8} />
            </linearGradient>
            <linearGradient id="commissionGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF6B6B" stopOpacity={1} />
              <stop offset="100%" stopColor="#FF6B6B" stopOpacity={0.8} />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="month"
            scale="point"
            padding={{ left: 10, right: 10 }}
            tickMargin={10}
            tickLine={false}
            axisLine={false}
          />
          <YAxis axisLine={false} tickLine={false} tickMargin={20} />

          <Tooltip
            formatter={(value) => [`${value}`]}
            contentStyle={{
              color: "var(--primary-green)",
              fontWeight: "500",
              borderRadius: "5px",
              border: "0",
            }}
          />

          <CartesianGrid
            opacity={0.2}
            horizontal={true}
            vertical={false}
            stroke="#BE32B0"
            strokeDasharray="3 3"
          />

          <Bar
            barSize={30}
            radius={5}
            dataKey="earning"
            fill="url(#earningGradient)"
            name="Earning"
          />
          <Bar
            barSize={30}
            radius={5}
            dataKey="commission"
            fill="url(#commissionGradient)"
            name="Commission"
          />

          <Legend />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EarningSummary;
