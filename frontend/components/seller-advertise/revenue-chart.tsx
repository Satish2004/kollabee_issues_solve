"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { RevenueData } from "./revenue-data";

interface RevenueChartProps {
  data: RevenueData[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div className="flex-1 h-[200px] mt-4 bg-white">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
          <XAxis
            dataKey="date"
            axisLine={{ stroke: "#eee" }}
            tickLine={false}
            tick={{ fill: "#666" }}
            fontSize={9}
          />
          <YAxis
            tickFormatter={(value) => {
              if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
              if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
              return value;
            }}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#666" }}
            fontSize={9}
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#ff4d4d"
            name="TOTAL"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="firstCampaign"
            stroke="#EA3D4F"
            name="1ST AD CAMPAIGN"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="bumpX"
            dataKey="secondCampaign"
            stroke="#FF922B"
            name="2ND AD CAMPAIGN"
            strokeWidth={2}
            dot={false}
          />
          <Legend fontSize={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
