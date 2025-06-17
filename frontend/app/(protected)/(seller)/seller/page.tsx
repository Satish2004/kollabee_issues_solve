"use client";

import Analytics, {
  OrderAnalytics,
} from "../../(admin)/admin/order/components/analytics";
import { BulkOrder } from "../../(admin)/admin/order/components/overview";
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
import { PieChart, Pie, Cell } from "recharts";
import { FunnelChart, Funnel, LabelList } from "recharts";
import { toast } from "sonner";
import NotificationsList from "@/components/seller/notifications-list";
import OrdersList from "@/components/seller/orders-list";
import ContactsList from "@/components/seller/contacts-list";
import ProfileStrengthCard from "@/components/seller/profile-strength-card";
import React from "react";

interface DashboardData {
  totalOrders: {
    current: number;
    past: number;
    percentageChange: string;
  };
  totalReceived: {
    current: number;
    past: number;
    percentageChange: string;
  };
  returnedOrders: {
    current: number;
    past: number;
    percentageChange: string;
  };
  onWayToShip: {
    current: number;
    past: number;
    percentageChange: string;
  };
  averageSales: {
    current: number;
    past: number;
    percentageChange: string;
  };
  averageResponseTime: {
    current: string;
    past: string;
    percentageChange: string;
  };
}

type contact = { id: string | number; name: string; image: string };

function SellerDashboardMainCard({
  selectedPeriod,
  setSelectedPeriod,
  periodMetrics,
  router,
  trendingProducts,
  normalizedData,
  topSellingProducts,
  lowSellerData,
}) {
  console.log({periodMetrics}); 
  console.log({normalizedData});
  console.log({topSellingProducts});
  console.log({lowSellerData});
  console.log({trendingProducts});


  return (
    <div className="bg-white p-4 rounded-xl">
      <div className="flex flex-row justify-end pb-3">
        <Select
          value={selectedPeriod}
          onValueChange={(value) => setSelectedPeriod(value as "today" | "week" | "month" | "year")}
        >
          <SelectTrigger className="w-fit space-x-2 font-semibold border-none">
            <SelectValue placeholder={selectedPeriod} />
          </SelectTrigger>
          <SelectContent className="bg-white border-none">
            <SelectItem className="cursor-pointer bg-gray-100" value="today">Today</SelectItem>
            <SelectItem className="cursor-pointer bg-gray-100" value="week">This Week</SelectItem>
            <SelectItem className="cursor-pointer bg-gray-100" value="month">This Month</SelectItem>
            <SelectItem className="cursor-pointer bg-gray-100" value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* Charts and Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        <div className="bg-red-50 rounded-xl p-4 lg:p-6 hover:cursor-pointer" onClick={() => router.push("/seller/request")}>
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
        <div className="bg-neutral-100 rounded-xl p-4 lg:p-6 hover:cursor-pointer" onClick={() => router.push("/seller/chat")}>
          <h3 className="font-semibold text-sm">Messages</h3>
          <div className="text-2xl font-bold mt-2">
            {periodMetrics.messages}
          </div>
        </div>
        <div className="bg-neutral-100 rounded-xl p-4 lg:p-6 hover:cursor-pointer" onClick={() => router.push("/seller/products")}>
          <h3 className="font-semibold text-sm">Published Products</h3>
          <div className="text-2xl font-bold mt-2">
            {periodMetrics.activeProducts}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 mt-10 md:gap-4   ">
        <div className="h-64 w-full col-span-2 ">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={normalizedData}>
              <CartesianGrid vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) =>
                  value === 0 ? "0" : `${value}M`
                }
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#e91e63"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, fill: "#e91e63" }}
              />
              <Line
                type="monotone"
                dataKey="requests"
                stroke="#ffc107"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, fill: "#ffc107" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-base font-medium mb-6">
            Trending Products
          </h3>
          <div className="space-y-4">
            {trendingProducts.map((product) => (
              <div key={product.name} className="flex items-center">
                <span className="w-20 text-sm">{product.name}</span>
                <div className="flex-1 ml-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-black"
                      style={{ width: `${product.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Chart */}
      <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm mt-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Top Selling Products */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-base font-medium mb-4">
              Top Selling Products In Marketplace
            </h3>
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
                    <tr
                      key={index}
                      className="border-b border-gray-100 last:border-0"
                    >
                      <td className="py-3 text-sm">{product.name}</td>
                      <td className="py-3 text-sm">
                        ₹{product.price.toFixed(2)}
                      </td>
                      <td className="py-3 text-sm">
                        {product.quantity}
                      </td>
                      <td className="py-3 text-sm">
                        ₹{product.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Low Seller */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-base font-medium mb-4">Low seller</h3>
            {/* Stack items vertically instead of using flex */}
            <div className="flex flex-col items-center">
              {/* Pie chart block */}
              {lowSellerData && lowSellerData.length > 0 && lowSellerData[0] ? (
                <div className="w-full h-48 mb-6">
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
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                          />
                        ))}
                      </Pie>
                      <text
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-lg font-medium"
                      >
                        {lowSellerData[0].value}%
                      </text>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="w-full h-48 mb-6 flex items-center justify-center text-gray-400">
                  No low seller data available.
                </div>
              )}
              {/* Data list below the chart */}
              <div className="w-full space-y-3">
                {lowSellerData.slice(1).map((item, index) => (
                  <div key={index} className="flex items-center">
                    <span
                      className="w-3 h-3 rounded-sm mr-2"
                      style={{ backgroundColor: item.color }}
                    ></span>
                    <span className="text-sm mr-2">{item.name}</span>
                    <span className="text-sm ml-auto">
                      ₹{item.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalOrders: {
      current: 0,
      past: 0,
      percentageChange: "0%",
    },
    totalReceived: {
      current: 0,
      past: 0,
      percentageChange: "0%",
    },
    returnedOrders: {
      current: 0,
      past: 0,
      percentageChange: "0%",
    },
    onWayToShip: {
      current: 0,
      past: 0,
      percentageChange: "0%",
    },
    averageSales: {
      current: 0,
      past: 0,
      percentageChange: "0%",
    },
    averageResponseTime: {
      current: "0m",
      past: "0m",
      percentageChange: "0%",
    },
  });

  const [contact, setContact] = useState<contact[]>();
  const [monthlyData, setMonthlyData] = useState();

  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState<{ name: string; orders: number; requests: number }[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<"today" | "week" | "month" | "year">("month");
  const [periodMetrics, setPeriodMetrics] = useState<any>({
    activeProducts: 0,
    messages: 0,
    currentRequests: 0,
    requestDifference: 0,
    requestPercentageChange: 0,
    previousRequests: 0,
  });

  const router = useRouter();

  const [trendingProducts, setTrendingProducts] = useState<any[]>([]);
  const [topSellingProducts, setTopSellingProducts] = useState<any[]>([]);
  const [lowSellerData, setLowSellerData] = useState<any[]>([]);

  const [normalizedData, setNormalizedData] = useState<Array<{ name: string; orders: number; requests: number }>>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    loadPeriodMetrics(selectedPeriod);
  }, [selectedPeriod]);

  const loadDashboardData = async () => {
    try {
      const [metricsRes, allData] = await Promise.all([
        dashboardApi.getMetrics(),
        dashboardApi.getDashboard(selectedPeriod),
      ]);

      console.log("Metrics Response:", metricsRes);
      console.log("All Data Response:", allData);

    
      setDashboardData({
        totalOrders: metricsRes?.totalOrders || {
          current: 0,
          past: 0,
          percentageChange: "0%",
        },
        totalReceived: metricsRes?.totalReceived || {
          current: 0,
          past: 0,
          percentageChange: "0%",
        },
        returnedOrders: metricsRes?.returnedOrders || {
          current: 0,
          past: 0,
          percentageChange: "0%",
        },
        onWayToShip: metricsRes?.onWayToShip || {
          current: 0,
          past: 0,
          percentageChange: "0%",
        },
        averageSales: metricsRes?.averageSales || {
          current: 0,
          past: 0,
          percentageChange: "0%",
        },
        averageResponseTime: metricsRes?.averageResponseTime || {
          current: "0m",
          past: "0m",
          percentageChange: "0%",
        },
      });
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const loadPeriodMetrics = async (period: "today" | "week" | "month" | "year") => {
    try {
      const response = await dashboardApi.getDashboard(period);
      const data :any= response;
      
      // Transform chartData into normalizedData format
      const transformedData = data.chartData.map((item: any) => ({
        name: item.name,
        orders:  item.single, // Combine bulk and single orders
        requests: item.bulk // If you have requests data in the API, use that instead
      }));
      setNormalizedData(transformedData);
      console.log("transformedData",transformedData);
      
      setChartData(data.chartData);
      setPeriodMetrics({
        activeProducts: data.metrics.activeProducts,
        messages: data.metrics.messages,
        currentRequests: data.metrics.requests.current,
        requestDifference: data.metrics.requests.difference,
        requestPercentageChange: data.metrics.requests.percentageChange,
        previousRequests: data.metrics.requests.previous,
      });

      // Transform lowSellingProducts into the format expected by the pie chart
      const totalAmount = data.lowSellingProducts.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
      let transformedLowSellers = data.lowSellingProducts
        .filter((p: any) => p.amount > 0) // Only show products with sales
        .map((product: any, index: number) => {
          const percentage = totalAmount > 0 ? Math.round((product.amount / totalAmount) * 100) : 0;
          return {
            name: product.name,
            value: percentage,
            color: ['#e91e63', '#8884d8', '#82ca9d', '#8dd1e1', '#ffc107'][index % 5],
            amount: product.amount,
            quantity: product.quantity
          };
        });

      // If no products have sales, show a default "No Sales" segment
      if (transformedLowSellers.length === 0) {
        transformedLowSellers = [{
          name: "No Sales",
          value: 100,
          color: "#e0e0e0",
          amount: 0,
          quantity: 0
        }];
      }

      setLowSellerData(transformedLowSellers);
      console.log("Low Seller Data:", transformedLowSellers);
      
      setTopSellingProducts(data.topProducts || []);
      
      // Calculate trending products based on top products
      const maxQuantity = Math.max(...(data.topProducts?.map((p: any) => p.quantity) || [0]));
      const trending = data.topProducts?.map((p: any) => ({
        name: p.name,
        progress: maxQuantity ? Math.round((p.quantity / maxQuantity) * 100) : 0
      })) || [];
      setTrendingProducts(trending);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to generate random colors for the pie chart
  const getRandomColor = () => {
    const colors = ['#e91e63', '#8884d8', '#82ca9d', '#8dd1e1', '#ffc107'];
    return colors[Math.floor(Math.random() * colors.length)];
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

  return (
    <div className="min-h-screen">
      <div className="px-2 ">
        <div className="flex flex-col lg:flex-row w-full justify-between gap-4 lg:gap-6">
          {/* Main Content Area */}
          <div className="w-full lg:w-2/3 space-y-4 lg:space-y-6">
            {/* Orders Overview */}
            <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Orders Overview</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                <StatCard
                  title="TOTAL ORDERS"
                  value={dashboardData.totalOrders.current.toString()}
                  change={dashboardData.totalOrders.current - dashboardData.totalOrders.past}
                  changeText="from last month"
                  trend={dashboardData.totalOrders.current > dashboardData.totalOrders.past ? "up" : "down"}
                  percentage={parseInt(dashboardData.totalOrders.percentageChange.replace('%', ''))}
                  router={router}
                  link="/seller/request"
                  isCurrency={false}
                />
                <StatCard
                  title="TOTAL RECEIVED"
                  value={dashboardData.totalReceived.current.toString()}
                  change={dashboardData.totalReceived.current - dashboardData.totalReceived.past}
                  changeText="from last month"
                  trend={dashboardData.totalReceived.current > dashboardData.totalReceived.past ? "up" : "down"}
                  percentage={parseInt(dashboardData.totalReceived.percentageChange.replace('%', ''))}
                  router={router}
                  link="/seller/request"
                  isCurrency={false}
                />
                <StatCard
                  title="RETURNED PRODUCTS"
                  value={dashboardData.returnedOrders.current.toString()}
                  change={dashboardData.returnedOrders.current - dashboardData.returnedOrders.past}
                  changeText="from last month"
                  trend={dashboardData.returnedOrders.current > dashboardData.returnedOrders.past ? "up" : "down"}
                  percentage={parseInt(dashboardData.returnedOrders.percentageChange.replace('%', ''))}
                  router={router}
                  isCurrency={false}
                />
                <StatCard
                  title="ON THE WAY TO SHIP"
                  value={dashboardData.onWayToShip.current.toString()}
                  change={dashboardData.onWayToShip.current - dashboardData.onWayToShip.past}
                  changeText="Products shipping"
                  trend="neutral"
                  percentage={null}
                  router={router}
                  isCurrency={false}
                />
                <StatCard
                  title="AVERAGE SALES"
                  value={`₹${dashboardData.averageSales.current.toLocaleString()}`}
                  change={dashboardData.averageSales.current - dashboardData.averageSales.past}
                  changeText="from last month"
                  trend={dashboardData.averageSales.current > dashboardData.averageSales.past ? "up" : "down"}
                  percentage={parseInt(dashboardData.averageSales.percentageChange.replace('%', ''))}
                  router={router}
                  isCurrency={true}
                />
                <StatCard
                  title="AVERAGE RESPONSE"
                  value={dashboardData.averageResponseTime.current}
                  change={0} // We'll handle this differently since it's a time string
                  changeText="from last month"
                  trend={dashboardData.averageResponseTime.percentageChange.startsWith('-') ? 'down' : 'up'}
                  percentage={parseInt(dashboardData.averageResponseTime.percentageChange.replace('%', ''))}
                  router={router}
                  isCurrency={false}
                />
              </div>
            </div>
            {/* Order Analytics stacked below Orders Overview */}
            <OrderAnalytics />

            <SellerDashboardMainCard
              selectedPeriod={selectedPeriod}
              setSelectedPeriod={setSelectedPeriod}
              periodMetrics={periodMetrics}
              router={router}
              trendingProducts={trendingProducts}
              normalizedData={normalizedData}
              topSellingProducts={topSellingProducts}
              lowSellerData={lowSellerData}
            />

            {/* <div className="w-full h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <FunnelChart>
                  <Tooltip />
                  <Funnel dataKey="count" data={funnelData} isAnimationActive>
                    <LabelList
                      position="right"
                      fill="#fff"
                      stroke="none"
                      dataKey="label"
                    />
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>
            </div> */}
          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-1/3 space-y-4 lg:space-y-6">
            {/* Profile Strength */}
            <ProfileStrengthCard />
            {/* Notifications */}
            <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm">
              <h3 className="font-semibold mb-4">Notifications/Event Alerts</h3>
              <NotificationsList />
            </div>

            {/* Latest Orders */}
            <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm">
              <h3 className="font-semibold mb-4">Latest Orders</h3>
              <OrdersList />
            </div>

            <div className="bg-white rounded-xl p-4 lg:p-5 shadow-sm">
              <ContactsList />
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
  isCurrency = false,
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
      {percentage !== undefined && percentage !== null && (
        <span
          className={`ml-2 -mt-1 ${
            percentage <= 0
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
        <span className="font-[800]">
          {isCurrency ? `₹${change.toLocaleString()}` : change}
        </span>
      </div>
      <div className="text-gray-500 text-xs">{changeText}</div>
    </div>
  </div>
);

export default Dashboard;
