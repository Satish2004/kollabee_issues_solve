"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SpendingCategory } from "./expense-data";

interface SpendingChartProps {
  data: SpendingCategory[];
}

export function SpendingChart({ data }: SpendingChartProps) {
  return (
    <div className="p-6 bg-white rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Spendings</h2>
          <p className="text-gray-500">Payments</p>
        </div>
      </div>

      <div className="h-[300px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute bottom-0 w-full">
          <div className="grid grid-cols-2 gap-4">
            {data.map((category) => (
              <div key={category.name} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-xs text-gray-600">
                  {category.name} ({category.value}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
