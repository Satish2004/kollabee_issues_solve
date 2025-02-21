import { topSellingProducts, lowPerformingAds } from "./analytics-data";
import { TopSellingTable } from "./top-selling-table";
import { LowPerformingChart } from "./low-performing-chart";

export function ProductAnalytics() {
  return (
    <div className="p-6 bg-white rounded-lg">
      <h1 className="text-2xl font-semibold mb-6">Analytics of Products</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#F7F9FB] p-6 rounded-lg shadow-sm">
          <TopSellingTable products={topSellingProducts} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <LowPerformingChart data={lowPerformingAds} />
        </div>
      </div>
    </div>
  );
}
