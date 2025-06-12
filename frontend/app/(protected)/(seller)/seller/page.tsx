"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { dashboardApi } from "@/lib/api/dashboard";
import {
  TrendingUp,
  TrendingDown,
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
  Bug,
  User,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { toast } from "sonner";
import { PieChart, Pie, Cell } from "recharts"
import Analytics, { OrderAnalytics } from "../../(admin)/admin/order/components/analytics";
import { FunnelChart, Funnel, LabelList } from 'recharts'
import { BulkOrder } from "../../(admin)/admin/order/components/overview";

interface DashboardData {
  totalOrders: number;
  totalProducts: number;
  totalRequests: number;
  totalReturns: number;
  totalRevenue: number;
  ordersDifference: number;
  pendingOrders: number;
  pendingOrdersWorth: number;
  requestsDifference: number;
  returnedProductsWorth: number;
  returnsDifference: number;
  revenueDifference: number;
  totalMessages: number;
  requestsRevenue: number;
  requestsRevenueDifference: number;
}

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalOrders: 0,
    totalProducts: 0,
    totalRequests: 0,
    totalReturns: 0,
    totalRevenue: 0,
    ordersDifference: 0,
    pendingOrders: 0,
    pendingOrdersWorth: 0,
    requestsDifference: 0,
    returnedProductsWorth: 0,
    returnsDifference: 0,
    revenueDifference: 0,
    totalMessages: 0,
    requestsRevenue: 0,
    requestsRevenueDifference: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState<
    "today" | "week" | "month" | "year"
  >("month");
  const [periodMetrics, setPeriodMetrics] = useState<any>({
    activeProducts: 0,
    messages: 0,
    currentRequests: 0,
    requestDifference: 0,
    requestPercentageChange: 0,
    previousRequests: 0,
  });

  const router = useRouter();

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    loadPeriodMetrics(selectedPeriod);
  }, [selectedPeriod]);

  const loadDashboardData = async () => {
    try {
      const [metricsRes] = await Promise.all([dashboardApi.getMetrics()]);

      console.log("Metrics Response:", metricsRes);

      setDashboardData({
        totalOrders: metricsRes?.totalOrders || 14, // Updated with actual data
        totalProducts: metricsRes?.totalProducts || 5, // Updated with actual data
        totalRequests: metricsRes?.totalRequests || 0, // Updated with actual data
        totalReturns: metricsRes?.totalReturns || 0, // Updated with actual data
        totalRevenue: metricsRes?.totalRevenue || 0, // Updated with actual data
        ordersDifference: metricsRes?.ordersDifference || 0,
        pendingOrders: metricsRes?.pendingOrders || 0,
        pendingOrdersWorth: metricsRes?.pendingOrdersWorth || 0,
        requestsDifference: metricsRes?.requestsDifference || 0,
        returnedProductsWorth: metricsRes?.returnedProductsWorth || 0,
        returnsDifference: metricsRes?.returnsDifference || 0,
        revenueDifference: metricsRes?.revenueDifference || 0,
        totalMessages: metricsRes?.totalMessages || 7, // Updated with actual data
        requestsRevenue: metricsRes?.requestsRevenue || 0,
        requestsRevenueDifference: metricsRes?.requestsRevenueDifference || 0,
      });
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const loadPeriodMetrics = async (
    period: "today" | "week" | "month" | "year"
  ) => {
    try {
      // Use the provided data directly
      const metricsRes = {
        period: "month",
        metrics: {
          requests: {
            current: 0,
            previous: 0,
            difference: 0,
            percentageChange: 0
          },
          messages: 7,
          activeProducts: 5,
          responseMetrics: {
            averageResponseTime: 0,
            lateResponses: 0,
            onTimeRate: 100,
            responseScore: 100,
            totalInquiries: 0,
            respondedInquiries: 0,
            responseTimes: []
          }
        },
        chartData: [
          {
            "name": "Week 1",
            "orders": 0,
            "requests": 0
          },
          {
            "name": "Week 2",
            "orders": 0,
            "requests": 0
          }
        ],
        dateRanges: {
          current: {
            start: "2025-05-31T18:30:00.000Z",
            end: "2025-06-11T20:50:08.538Z"
          },
          previous: {
            start: "2025-04-30T18:30:00.000Z",
            end: "2025-05-31T18:29:59.999Z"
          }
        },
        topProducts: [
          {
            "id": "22172baa-1937-4ea4-aff0-de2169c1f14e",
            "name": "raja babu2",
            "price": 20,
            "quantity": 7,
            "amount": 140
          },
          {
            "id": "5fa207c8-bf92-4b56-ae8c-695e8e244868",
            "name": "kollabee",
            "price": 20,
            "quantity": 5,
            "amount": 100
          },
          {
            "id": "f1923231-547b-4873-9140-dd495065e28d",
            "name": "Suraj",
            "price": 55,
            "quantity": 2,
            "amount": 110
          }
        ],
        lowSellingProducts: [
          {
            "id": "3616f517-da7a-438c-ad28-bb5756c8fe96",
            "name": "suraj",
            "price": 1200,
            "quantity": 0,
            "amount": 0
          },
          {
            "id": "73f1d6d4-dee7-4fd0-9280-aff82ca49252",
            "name": "new Suraj",
            "price": 1200,
            "quantity": 0,
            "amount": 0
          },
          {
            "id": "8447b5f2-56d2-47fd-8545-66abca94b836",
            "name": "Raja babu",
            "price": 1200,
            "quantity": 0,
            "amount": 0
          }
        ]
      };

      setChartData(metricsRes.chartData);
      setPeriodMetrics({
        activeProducts: metricsRes.metrics.activeProducts,
        messages: metricsRes.metrics.messages,
        currentRequests: metricsRes.metrics.requests.current,
        requestDifference: metricsRes.metrics.requests.difference,
        requestPercentageChange: metricsRes.metrics.requests.percentageChange,
        previousRequests: metricsRes.metrics.requests.previous,
      });
    } catch (error) {
      console.error("Failed to load period metrics:", error);
      toast.error("Failed to load period metrics");
    }
  };

  const calculatePercentageChange = (
    current: number,
    previous: number
  ): number => {
    if (previous === 0) {
      return current > 0 ? 100 : 0;
    }
    return parseFloat((((current - previous) / previous) * 100).toFixed(2));
  };

  const trendingProducts = [
    { name: "raja babu2", progress: 85 },
    { name: "kollabee", progress: 70 },
    { name: "Suraj", progress: 40 },
  ];

  const topSellingProducts = [
    { name: "raja babu2", price: 20, quantity: 7, amount: 140 },
    { name: "kollabee", price: 20, quantity: 5, amount: 100 },
    { name: "Suraj", price: 55, quantity: 2, amount: 110 },
  ];

  const lowSellerData = [
    { name: "Other", value: 38.6, color: "#000000" },
    { name: "suraj", value: 25, color: "#8884d8", amount: 0 },
    { name: "new Suraj", value: 15, color: "#82ca9d", amount: 0 },
    { name: "Raja babu", value: 15, color: "#8dd1e1", amount: 0 },
  ];

  const funnelData = [
    { label: "Page Views", count: 1200, color: "#60A5FA" },
    { label: "Engaged Buyers", count: 850, color: "#38BDF8" },
    { label: "Viewed Product(s)", count: 600, color: "#0EA5E9" },
    { label: "Last Interaction < 7d", count: 450, color: "#0284C7" },
    { label: "Interest Score > 70", count: 320, color: "#0369A1" },
    { label: "Taken Action", count: 120, color: "#075985" },
  ];

  return (
    <div className="min-h-screen">
      <div className="px-2 sm:px-4">
        <div className="flex flex-col lg:flex-row w-full justify-between gap-4 lg:gap-6">
          {/* Main Content Area */}
          <div className="w-full lg:w-2/3 space-y-4 lg:space-y-6">
            {/* Orders Overview */}
            <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Orders Overview</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                <StatCard
                  title="TOTAL ORDERS"
                  value={dashboardData.totalOrders.toString()}
                  change={dashboardData.revenueDifference}
                  changeText="from last month"
                  trend={dashboardData.revenueDifference <= 0 ? "down" : "up"}
                  percentage={calculatePercentageChange(
                    dashboardData.totalRevenue,
                    dashboardData.totalRevenue - dashboardData.revenueDifference
                  )}
                  router={router}
                  link="/seller/request"
                />
                <StatCard
                  title="TOTAL RECEIVED"
                  value={dashboardData.totalRequests.toString()}
                  change={dashboardData.requestsDifference}
                  changeText="Revenue"
                  trend={dashboardData.requestsDifference <= 0 ? "down" : "up"}
                  percentage={calculatePercentageChange(
                    dashboardData.totalRequests,
                    dashboardData.totalRequests -
                    dashboardData.requestsDifference
                  )}
                  router={router}
                  link="/seller/request"
                />
                <StatCard
                  title="RETURNED PRODUCTS"
                  value={dashboardData.totalReturns.toString()}
                  change={dashboardData.returnsDifference}
                  changeText="from last month"
                  trend={dashboardData.returnsDifference <= 0 ? "down" : "up"}
                  percentage={calculatePercentageChange(
                    dashboardData.totalReturns,
                    dashboardData.totalReturns - dashboardData.returnsDifference
                  )}
                  router={router}
                />
                <StatCard
                  title="ON THE WAY TO SHIP"
                  value={dashboardData.pendingOrders.toString()}
                  change={dashboardData.pendingOrdersWorth}
                  changeText="Products shipping"
                  trend="neutral"
                  percentage=""
                  router={router}
                />
                <StatCard
                  title="AVERAGE SALES"
                  value={`₹${(
                    dashboardData.totalRevenue + dashboardData.requestsRevenue
                  ).toLocaleString()}`}
                  change={
                    dashboardData.revenueDifference +
                    dashboardData.requestsRevenueDifference
                  }
                  changeText="from last month"
                  trend={
                    dashboardData.revenueDifference +
                      dashboardData.requestsRevenueDifference <=
                      0
                      ? "down"
                      : "up"
                  }
                  percentage={calculatePercentageChange(
                    dashboardData.totalRevenue + dashboardData.requestsRevenue,
                    dashboardData.totalRevenue +
                    dashboardData.requestsRevenue -
                    (dashboardData.revenueDifference +
                      dashboardData.requestsRevenueDifference)
                  )}
                  router={router}
                />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl">
              <div className="flex flex-row justify-end pb-3">
                <Select
                  value={selectedPeriod}
                  onValueChange={(value) => setSelectedPeriod(value)}
                >
                  <SelectTrigger className="w-fit space-x-2 font-semibold border-none">
                    <SelectValue placeholder={selectedPeriod} />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-none">
                    <SelectItem
                      className="cursor-pointer bg-gray-100"
                      value="today"
                    >
                      Today
                    </SelectItem>
                    <SelectItem
                      className="cursor-pointer bg-gray-100"
                      value="week"
                    >
                      This Week
                    </SelectItem>
                    <SelectItem
                      className="cursor-pointer bg-gray-100"
                      value="month"
                    >
                      This Month
                    </SelectItem>
                    <SelectItem
                      className="cursor-pointer bg-gray-100"
                      value="year"
                    >
                      This Year
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Charts and Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                <div
                  className="bg-red-50 rounded-xl p-4 lg:p-6 hover:cursor-pointer"
                  onClick={() => router.push("/seller/request")}
                >
                  <h3 className="font-semibold text-sm">Requests</h3>
                  <div className="flex flex-row items-center justify-between">
                    <div className="text-2xl font-bold mt-2">
                      {periodMetrics.currentRequests}
                    </div>
                    <div className="text-sm flex items-center space-x-2">
                      {periodMetrics.requestPercentageChange}%{" "}
                      <span className="ml-2">
                        {periodMetrics.requestDifference <= 0 ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingUp className="w-4 h-4" />
                        )}
                      </span>{" "}
                    </div>
                  </div>
                </div>
                <div
                  className="bg-neutral-100 rounded-xl p-4 lg:p-6 hover:cursor-pointer"
                  onClick={() => router.push("/seller/chat")}
                >
                  <h3 className="font-semibold text-sm">Messages</h3>
                  <div className="text-2xl font-bold mt-2">
                    {periodMetrics.messages}
                  </div>
                </div>
                <div
                  className="bg-neutral-100 rounded-xl p-4 lg:p-6 hover:cursor-pointer"
                  onClick={() => router.push("/seller/products")}
                >
                  <h3 className="font-semibold text-sm">Published Products</h3>
                  <div className="text-2xl font-bold mt-2">
                    {periodMetrics.activeProducts}
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm mt-4">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  {/* Top Selling Products */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-base font-medium mb-4">Top Selling Products In Marketplace</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-sm text-gray-500 border-b">
                            <th className="pb-2 font-normal">Name</th>
                            <th className="pb-2 font-normal">Price</th>
                            <th className="pb-2 font-normal">Quantity</th>
                            <th className="pb-2 font-normal">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {topSellingProducts.map((product, index) => (
                            <tr key={index} className="border-b border-gray-100 last:border-0">
                              <td className="py-3 text-sm">{product.name}</td>
                              <td className="py-3 text-sm">₹{product.price.toFixed(2)}</td>
                              <td className="py-3 text-sm">{product.quantity}</td>
                              <td className="py-3 text-sm">₹{product.amount.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-base font-medium mb-6">Trending Products</h3>
                    <div className="space-y-4">
                      {trendingProducts.map((product) => (
                        <div key={product.name} className="flex items-center">
                          <span className="w-20 text-sm">{product.name}</span>
                          <div className="flex-1 ml-4">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="h-2 rounded-full bg-black" style={{ width: `${product.progress}%` }}></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Low Seller */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-base font-medium mb-4">Low seller</h3>
                    <div className="flex items-center justify-between">
                      <div className="w-1/2 h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={lowSellerData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={0}
                              dataKey="value"
                            >
                              {lowSellerData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-lg font-medium">
                              {lowSellerData[0].value}%
                            </text>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="w-1/2 space-y-3">
                        {lowSellerData.slice(1).map((item, index) => (
                          <div key={index} className="flex items-center">
                            <span className="w-3 h-3 rounded-sm mr-2" style={{ backgroundColor: item.color }}></span>
                            <span className="text-sm mr-2">{item.name}</span>
                            <span className="text-sm ml-auto">₹{item.amount}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                  <h3 className="font-semibold mb-2 sm:mb-0">Orders Requests</h3>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                      Orders
                    </span>
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mr-1"></span>
                      Requests
                    </span>
                  </div>
                </div>
                <div className="h-64 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      className="cursor-pointer"
                      margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="4 4"
                        vertical={false}
                        stroke="#ccc"
                      />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: "#616161", fontSize: 12 }}
                        tickLine={false}
                      />
                      <YAxis
                        stroke="#616161"
                        tick={{ fill: "#616161", fontSize: 12 }}
                        tickLine={false}
                      />
                      <Tooltip />
                      <Line type="monotone" dataKey="orders" stroke="#ef4444" />
                      <Line
                        type="monotone"
                        dataKey="requests"
                        stroke="#f97316"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <OrderAnalytics />
            <BulkOrder />
            <div className="w-full h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <FunnelChart>
                  <Tooltip />
                  <Funnel dataKey="count" data={funnelData} isAnimationActive>
                    <LabelList position="right" fill="#fff" stroke="none" dataKey="label" />
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-1/3 space-y-4 lg:space-y-6">
            {/* Notifications */}
            <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm">
              <h3 className="font-semibold mb-4">Notifications/Event Alerts</h3>
              <div className="space-y-4">
                <NotificationItem
                  icon={<Bug className="w-4 h-4" />}
                  text="You have a bug that needs to be fixed"
                  time="Just now"
                />
                <NotificationItem
                  icon={<User className="w-4 h-4" />}
                  text="New user registered"
                  time="39 minutes ago"
                />
                <NotificationItem
                  icon={<AlertCircle className="w-4 h-4" />}
                  text="You have a bug that needs to be fixed"
                  time="12 hours ago"
                />
              </div>
            </div>

            {/* Latest Orders */}
            <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm">
              <h3 className="font-semibold mb-4">Latest Orders</h3>
              <div className="space-y-4">
                <OrderItem
                  icon={<Bug className="w-4 h-4" />}
                  text="Order #12345 for raja babu2 (Qty: 2)"
                  time="Just now"
                />
                <OrderItem
                  icon={<CheckCircle className="w-4 h-4" />}
                  text="Order #12344 for kollabee (Qty: 1)"
                  time="39 minutes ago"
                />
                <OrderItem
                  icon={<AlertCircle className="w-4 h-4" />}
                  text="Order #12343 for Suraj (Qty: 1)"
                  time="12 hours ago"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({
  title,
  value,
  change,
  changeText,
  trend,
  percentage,
  router,
  link = "",
}) => (
  <div
    className={`border rounded-lg p-2${link ? " hover:cursor-pointer" : ""}`}
    onClick={() => link && router.push(link)}
  >
    <div className="flex items-center justify-between mb-2">
      <span className="text-gray-600 text-xs">{title}</span>
      {trend === "up" ? (
        <TrendingUp className="w-4 h-4 text-green-500" />
      ) : trend === "down" ? (
        <TrendingDown className="w-4 h-4 text-red-500" />
      ) : null}
    </div>
    <div className="flex items-center space-x-2 flex-wrap">
      <div className="text-xl sm:text-2xl mb-1">{value}</div>
      {percentage && (
        <span
          className={`ml-2 -mt-1 ${percentage <= 0
            ? "bg-red-100 text-red-600"
            : "bg-green-100 text-green-600"
            } px-2 py-0.5 rounded-xl text-xs sm:text-sm flex flex-row items-center`}
        >
          {percentage <= 0 ? (
            <ArrowDownCircleIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
          ) : (
            <ArrowUpCircleIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
          )}
          {Math.abs(percentage)}%
        </span>
      )}
    </div>
    <hr className="w-full mt-3 mb-1"></hr>
    <div className="flex items-center space-x-2">
      <div className="flex items-center text-xs sm:text-sm">
        <span className="font-[800]">₹{change}</span>
      </div>
      <div className="text-gray-500 text-xs">{changeText}</div>
    </div>
  </div>
);

const NotificationItem = ({ icon, text, time }) => (
  <div className="flex items-start space-x-3">
    <div className="bg-gray-100 p-2 rounded-lg">{icon}</div>
    <div>
      <p className="text-sm">{text}</p>
      <span className="text-xs text-gray-500">{time}</span>
    </div>
  </div>
);

const OrderItem = NotificationItem;

export default Dashboard;