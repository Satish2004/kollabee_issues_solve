import { ArrowRight } from "lucide-react";
import type { Metric } from "./metrics-data";

interface MetricCardProps {
  metric: Metric;
}

export function MetricCard({ metric }: MetricCardProps) {
  const formatValue = (
    value: number,
    format: Metric["format"],
    suffix?: string
  ) => {
    if (format === "currency") {
      return `$${Math.abs(value).toLocaleString()}`;
    }
    if (format === "compact") {
      return `${Math.abs(Math.round(value / 1000))}${suffix}`;
    }
    return Math.abs(value).toLocaleString();
  };

  const isPositive = metric.percentageChange >= 0;
  const isPositiveAdditional = metric.additionalValue >= 0;

  return (
    <div className="bg-[#ffffff] p-6 rounded-lg shadow-sm relative">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-[#78787a] uppercase tracking-wide">
          {metric.title}
        </h3>
        <div className="w-8 h-8 flex items-center justify-center">
          <metric.icon className="w-5 h-5 text-[#78787a]" />
        </div>
      </div>

      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl font-bold text-[#000000]">
          {formatValue(metric.value, metric.format, metric.suffix)}
        </span>
        <span
          className={`px-2 py-1 rounded-full text-sm ${
            isPositive
              ? "text-[#359900] bg-[#359900]/10"
              : "text-[#eb3223] bg-[#eb3223]/10"
          }`}
        >
          {isPositive ? "+" : ""}
          {metric.percentageChange}%
        </span>
      </div>

      <div className="flex items-center text-sm text-[#78787a]">
        <span className="mr-1">
          {isPositiveAdditional ? "+" : ""}
          {formatValue(metric.additionalValue, metric.format)}
        </span>
        <span className="mr-2">from advertise</span>
        <ArrowRight className="w-4 h-4" />
      </div>
    </div>
  );
}
