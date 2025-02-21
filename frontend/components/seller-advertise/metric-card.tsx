import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { MetricCard as MetricCardType } from "./revenue-data";

interface MetricCardProps {
  metric: MetricCardType;
}

export function MetricCard({ metric }: MetricCardProps) {
  const isPositive = metric.change >= 0;

  return (
    <div
      className={`p-4 rounded-lg ${
        metric.label === "Growth"
          ? "bg-gradient-to-br from-[#FCE6EF] via-[#F8C3C8] to-[#FFEBBE]"
          : metric.label === "Customers"
          ? "bg-gradient-to-b from-[#E0026133] to-[#FFFFFF33] "
          : "bg-white"
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm text-[#78787a]">{metric.label}</h3>
        <div className="flex items-center gap-1 text-sm">
          {isPositive ? (
            <ArrowUpRight className="w-4 h-4 text-green-600" />
          ) : (
            <ArrowDownRight className="w-4 h-4 text-red-600" />
          )}
          <span className={isPositive ? "text-green-600" : "text-red-600"}>
            {isPositive ? "+" : ""}
            {metric.change}%
          </span>
        </div>
      </div>
      <p className="text-2xl font-bold">
        {metric.prefix}
        {metric.value.toLocaleString()}
        {metric.suffix}
      </p>
    </div>
  );
}
