"use client";

import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
import type { LowPerformingAd } from "./analytics-data";

interface LowPerformingChartProps {
  data: LowPerformingAd[];
}

export function LowPerformingChart({ data }: LowPerformingChartProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Low performing ads</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="percentage"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              content={({ payload }) => (
                <ul className="list-none">
                  {payload?.map((entry: any, index) => (
                    <li key={`item-${index}`} className="mb-2">
                      <span className="text-[#171A1F]">
                        {entry.payload.name} ${entry.payload.amount}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
