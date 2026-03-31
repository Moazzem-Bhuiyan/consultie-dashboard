"use client";

import { DatePicker } from "antd";
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
import moment from "moment";

const EarningSummary = ({ revenueVsCommission, onYearChange }) => {
  const [selectedYear, setSelectedYear] = useState(null);

  const data = revenueVsCommission?.map((item, index) => ({
    month: item.month,
    earning: item?.revenue,
    commission: item?.commission,
  }));
  const handleChange = (date, dateString) => {
    // Date string will contain the selected year
    setSelectedYear(dateString); // DatePicker returns the year in 'YYYY' format
    onYearChange(dateString);
  };

  return (
    <div className="max-w-8xl mx-auto w-full rounded-lg bg-white p-6 shadow-lg">
      <div className="mb-10 flex items-center justify-between gap-2 lg:flex-wrap xl:flex-nowrap">
        <h1 className="text-xl font-bold">Revenue vs Commission</h1>

        <div className="space-x-3">
          <DatePicker
            value={selectedYear ? moment(selectedYear, "YYYY") : null}
            onChange={handleChange}
            picker="year"
            placeholder="Select Year"
            style={{ width: 120 }}
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
