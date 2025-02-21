import { HandHeart, BarChart3, ShoppingBag, AlertCircle } from "lucide-react";

const MetricCard = ({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
}) => {
  return (
    <div className="bg-white rounded-lg p-6 flex items-center justify-between shadow-sm">
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-[#6B7280] uppercase tracking-wide">
          {title}
        </h3>
        <p className="text-3xl font-bold text-[#111827]">
          {value.toLocaleString()}
        </p>
      </div>
      <div className="w-12 h-12 rounded-full bg-[#FFF1F4] flex items-center justify-center">
        <Icon className="w-6 h-6 text-[#FF4085]" />
      </div>
    </div>
  );
};

export function ProductMetrics({metricsData}) {
  const metrics = [
    {
      title: "Categories", value: metricsData.categories, icon: HandHeart
    },
    { title: "Total Products", value: metricsData.totalProducts, icon: BarChart3 },
    { title: "Top Selling", value: metricsData.topSelling, icon: ShoppingBag },
    { title: "Low Stocks", value: metricsData.lowStocks, icon: AlertCircle },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => (
        <MetricCard
          key={metric.title}
          title={metric.title}
          value={metric.value}
          icon={metric.icon}
        />
      ))}
    </div>
  );
}
