import { Order } from "@/types/api";
import { Line } from "react-chartjs-2";
import { formatDate } from "@/lib/utils/format";

interface OrdersChartProps {
  data: Order[];
}

function transformOrdersData(orders: Order[]) {
  const grouped = orders.reduce((acc, order) => {
    const date = formatDate(order.createdAt);
    acc[date] = (acc[date] || 0) + order.totalAmount;
    return acc;
  }, {} as Record<string, number>);

  return {
    labels: Object.keys(grouped),
    datasets: [{
      label: 'Order Amount',
      data: Object.values(grouped),
      borderColor: '#e00261',
      tension: 0.4
    }]
  };
}

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false }
  }
};

export function OrdersChart({ data }: OrdersChartProps) {
  const chartData = transformOrdersData(data);
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">Orders Overview</h3>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
} 