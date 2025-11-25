"use client";
import { DatePicker } from "antd";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const RevenueAnalytics = ({ chartData, setSelectedYear, selectedYear }) => {
  // const data = chartData?.map((item) => ({
  //   month: item.month,
  //   earning: item.amount,
  // }));

  // const handleYearChange = (date, dateString) => {
  //   // Date string will contain the selected year
  //   setSelectedYear(dateString); // DatePicker returns the year in 'YYYY' format
  // };

  const data = [
    { month: "Jan", earning: 1200 },
    { month: "Feb", earning: 1400 },
    { month: "Mar", earning: 1500 },
    { month: "Apr", earning: 1200 },
    { month: "May", earning: 1530 },
    { month: "Jun", earning: 1640 },
    { month: "Jul", earning: 1930 },
    { month: "Aug", earning: 1340 },
    { month: "Sep", earning: 1840 },
    { month: "Oct", earning: 1260 },
    { month: "Nov", earning: 1640 },
    { month: "Dec", earning: 1100 },
  ];

  return (
    <div className="w-full rounded-xl border bg-white p-6 shadow-lg xl:w-full">
      <div className="mb-10 flex items-center justify-between text-black">
        <h1 className="text-xl font-medium">Revenue Analytics </h1>

        <div className="flex items-center justify-start gap-x-4">
          <DatePicker
            // onChange={handleYearChange}
            // value={selectedYear ? moment(selectedYear, "YYYY") : null}
            picker="year"
            placeholder="Select Year"
            style={{ width: 120 }}
            format="YYYY" // Ensure the format matches the expected output
          />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
              <stop offset="30%" stopColor="#BE32B0" stopOpacity={1} />
              <stop offset="100%" stopColor="#BE32B0" stopOpacity={0.0} />
            </linearGradient>
          </defs>

          <XAxis
            tickMargin={10}
            axisLine={false}
            tickLine={false}
            dataKey="month"
          />

          <YAxis tickMargin={20} axisLine={false} tickLine={false} />

          <CartesianGrid
            opacity={0.19}
            stroke="#080E0E"
            strokeDasharray="3 3"
          />

          <Tooltip
            formatter={(value) => [`Monthly Earning: $${value}`]}
            contentStyle={{
              color: "var(--primary-green)",
              fontWeight: "500",
              borderRadius: "5px",
              border: "0",
            }}
            itemStyle={{ color: "#1B70A6" }}
          />

          <Area
            activeDot={{ fill: "#1B70A6" }}
            type="monotone"
            dataKey="earning"
            strokeWidth={0}
            stroke="blue"
            fill="url(#color)"
            fillOpacity={1}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueAnalytics;
