"use client";
import { DatePicker } from "antd";
import moment from "moment";
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-full bg-black px-3 py-2 text-sm font-medium text-white">
        £ {Math.round(payload[0].value)} Sales in {label}
      </div>
    );
  }
  return null;
};

export default function EarningOverview({ earningOverview, onYearChange }) {
  const [selectedYear, setSelectedYear] = useState(null);

  const data = earningOverview?.map((item, inx) => ({
    key: inx + 1,
    month: item?.month,
    user: item?.total,
  }));

  const handleChange = (date, dateString) => {
    // Date string will contain the selected year
    setSelectedYear(dateString); // DatePicker returns the year in 'YYYY' format
    onYearChange(dateString);
  };

  return (
    <div className="max-w-8xl mx-auto w-full rounded-lg bg-white p-6 shadow-lg">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Earning Report</h2>
        <div>
          <DatePicker
            value={selectedYear ? moment(selectedYear, "YYYY") : null}
            onChange={handleChange}
            picker="year"
            placeholder="Select Year"
            style={{ width: 120 }}
          />
        </div>
      </div>

      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 6"
              stroke="#0B607E"
              horizontal={false}
              vertical={true}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 14, fill: "#000000" }}
              dy={10}
            />
            <YAxis
              domain={[0, 12]}
              ticks={[0, 2, 4, 6, 8, 10, 12]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 14, fill: "#0B607E" }}
              dx={-10}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "transparent" }}
              position={{ y: -10 }}
            />
            <Line
              type="monotone"
              dataKey="user"
              stroke="#BE32B0"
              strokeWidth={3}
              dot={{ fill: "black", strokeWidth: 0, r: 8 }}
              activeDot={{ r: 6, fill: "#ffffff", strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
