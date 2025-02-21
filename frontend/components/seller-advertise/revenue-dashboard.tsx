import { Maximize2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MetricCard } from "./metric-card";
import { ProgressCard } from "./progress-card";
import { RevenueChart } from "./revenue-chart";
import { LocationMap } from "./location-map";
import {
  revenueData,
  locationRevenue,
  metrics,
  netIncome,
  averageSpend,
} from "./revenue-data";

export function RevenueDashboard() {
  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 bg-white rounded-lg">
      <Card className="flex-1 border-none shadow-none flex flex-col gap-2">
        <h2 className="text-xl font-semibold">Spending of Money</h2>

        <div className="space-y-4 border-2 border-[#dddddd] px-4 rounded-lg">
          <div className="flex items-center justify-between mb-6 border-b-2 border-[#dddddd] py-2">
            <div>
              <p className="text-lg text-[#343A40]">Revenue</p>
              <p className="text-[#868E96]">Report Center</p>
            </div>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center">
            <h3 className="text-[#78787a] uppercase text-sm">Revenue</h3>
            <h1 className="text-lg font-bold">1.5M</h1>
            <span className="ml-4 text-sm text-red-500">-0.8%</span>
          </div>
          <div className="flex-1 flex">
            <RevenueChart data={revenueData} />
            <div className="flex flex-col gap-4">
              <ProgressCard
                title="Net Income"
                percentage={netIncome.percentage}
                amount={netIncome.amount}
              />
              <ProgressCard
                title="Average Spend"
                percentage={averageSpend.percentage}
                amount={averageSpend.amount}
                gradient={false}
              />
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-6 flex flex-col">
        <div>
          <h2 className="text-xl font-semibold mb-4">Growth in Numbers</h2>
          <div className="grid grid-cols-2 gap-4">
            {metrics.map((metric) => (
              <MetricCard key={metric.label} metric={metric} />
            ))}
          </div>
        </div>

        <Card className="p-6 flex-1">
          <h3 className="text-xl font-semibold mb-4">Revenue by Location</h3>
          <LocationMap locations={locationRevenue} />
          <div className="mt-4 space-y-2">
            {locationRevenue.map((location) => (
              <div
                key={location.city}
                className="flex justify-between items-center"
              >
                <span>{location.city}</span>
                <span className="font-semibold">
                  {(location.amount / 1000).toFixed(0)}K
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
