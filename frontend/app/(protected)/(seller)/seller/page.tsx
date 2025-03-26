"use client"

import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Bell, TrendingUp, TrendingDown, AlertCircle, User, CheckCircle, Bug, ArrowDownCircleIcon, ArrowUpCircleIcon } from 'lucide-react';
import { dashboardApi } from '@/lib/api/dashboard';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  const [selectedPeriod, setSelectedPeriod] = useState<"today" | "week" | "month" | "year">('today');
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
      const [metricsRes] = await Promise.all([
        dashboardApi.getMetrics(),
      ]);

      setDashboardData({
        totalOrders: metricsRes?.totalOrders || 0,
        totalProducts: metricsRes?.totalProducts || 0,
        totalRequests: metricsRes?.totalRequests || 0,
        totalReturns: metricsRes?.totalReturns || 0,
        totalRevenue: metricsRes?.totalRevenue || 0,
        ordersDifference: metricsRes?.ordersDifference || 0,
        pendingOrders: metricsRes?.pendingOrders || 0,
        pendingOrdersWorth: metricsRes?.pendingOrdersWorth || 0,
        requestsDifference: metricsRes?.requestsDifference || 0,
        returnedProductsWorth: metricsRes?.returnedProductsWorth || 0,
        returnsDifference: metricsRes?.returnsDifference || 0,
        revenueDifference: metricsRes?.revenueDifference || 0,
        totalMessages: metricsRes?.totalMessages || 0,
        requestsRevenue: metricsRes?.requestsRevenue || 0,
        requestsRevenueDifference: metricsRes?.requestsRevenueDifference || 0,
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const loadPeriodMetrics = async (period: "today" | "week" | "month" | "year") => {
    try {
      const metricsRes = await dashboardApi.getOrderAnalytics(period);
      setChartData(metricsRes?.chartData);
      setPeriodMetrics({
        activeProducts: metricsRes?.metrics.activeProducts,
        messages: metricsRes?.metrics.messages,
        currentRequests: metricsRes.metrics.requests.current,
        requestDifference: metricsRes.metrics.requests.difference,
        requestPercentageChange: metricsRes.metrics.requests.percentageChange,
        previousRequests: metricsRes.metrics.requests.previous,
      });

    } catch (error) {
      console.error('Failed to load period metrics:', error);
      toast.error('Failed to load period metrics');
    }
  };

  const calculatePercentageChange = (current: number, previous: number): number => {
    if (previous === 0) {
      // If there were no orders last month, any current orders would be 100% increase
      return current > 0 ? 100 : 0;
    }
    return (((current - previous) / previous) * 100).toFixed(2);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      {/* <header className="bg-white border-b">
        <div className="flex justify-between items-center px-6 py-4">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg">
              Upgrade
            </button>
            <img
              src="/api/placeholder/32/32"
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
          </div>
        </div>
      </header> */}

      <div className="">
        <div className="flex flex-row w-full justify-between gap-6">
          {/* Main Content Area */}
          <div className="w-[85%] space-y-6">
            {/* Orders Overview */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Orders Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <StatCard
                  title="TOTAL ORDERS"
                  value={dashboardData.totalOrders.toString()}
                  change={dashboardData.revenueDifference}
                  changeText="from last month"
                  trend={dashboardData.revenueDifference <= 0 ? "down" : "up"}
                  percentage={calculatePercentageChange(dashboardData.totalRevenue, dashboardData.totalRevenue - dashboardData.revenueDifference)}
                />
                <StatCard
                  title="TOTAL RECEIVED"
                  value={dashboardData.totalRequests.toString()}
                  change={dashboardData.requestsDifference}
                  changeText="Revenue"
                  trend={dashboardData.requestsDifference <= 0 ? "down" : "up"}
                  percentage={calculatePercentageChange(dashboardData.totalRequests, dashboardData.totalRequests - dashboardData.requestsDifference)}
                />
                <StatCard
                  title="RETURNED PRODUCTS"
                  value={dashboardData.totalReturns.toString()}
                  change={dashboardData.returnsDifference}
                  changeText="from last month"
                  trend={dashboardData.returnsDifference <= 0 ? "down" : "up"}
                  percentage={calculatePercentageChange(dashboardData.totalReturns, dashboardData.totalReturns - dashboardData.returnsDifference)}
                />
                <StatCard
                  title="ON THE WAY TO SHIP"
                  value={dashboardData.pendingOrders.toString()}
                  change={dashboardData.pendingOrdersWorth}
                  changeText="Products shipping"
                  trend="neutral"
                  percentage=""
                />
                <StatCard
                  title="AVERAGE SALES"
                  value={`₹${(dashboardData.totalRevenue + dashboardData.requestsRevenue).toLocaleString()}`}
                  change={dashboardData.revenueDifference + dashboardData.requestsRevenueDifference}
                  changeText="from last month"
                  trend={
                    dashboardData.revenueDifference + dashboardData.requestsRevenueDifference <= 0 
                      ? "down" 
                      : "up"
                  }
                  percentage={calculatePercentageChange(
                    dashboardData.totalRevenue + dashboardData.requestsRevenue,
                    (dashboardData.totalRevenue + dashboardData.requestsRevenue) - 
                    (dashboardData.revenueDifference + dashboardData.requestsRevenueDifference)
                  )}
                />
              </div>
            </div>

            <div className='bg-white p-4 rounded-xl'>
            <div className='flex flex-row justify-end pb-3'>
            <Select value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value)}>
              <SelectTrigger className="w-fit space-x-2 font-semibold border-none">
                <SelectValue placeholder={selectedPeriod} />
              </SelectTrigger>
              <SelectContent className='bg-white border-none'>
                <SelectItem className="cursor-pointer bg-gray-100" value="today">Today</SelectItem>
                <SelectItem className="cursor-pointer bg-gray-100" value="week">This Week</SelectItem>
                <SelectItem className="cursor-pointer bg-gray-100" value="month">This Month</SelectItem>
                <SelectItem className="cursor-pointer bg-gray-100" value="year">This Year</SelectItem>
              </SelectContent>
            </Select>

            </div>
            {/* Charts and Stats */}
            <div className="grid grid-cols-3 gap-4  ">
              <div className="bg-red-50 rounded-xl p-6">
                <h3 className="font-semibold text-sm">Requests</h3>
                <div className='flex flex-row items-center justify-between'>
                <div className="text-2xl font-bold mt-2">{periodMetrics.currentRequests}</div>
                <div className="text-sm flex items-center space-x-2">{periodMetrics.requestPercentageChange}% <span className='ml-2'>{periodMetrics.requestDifference <= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}</span> </div>
                </div>
              </div>
              <div className="bg-neutral-100 rounded-xl p-6">
                <h3 className="font-semibold text-sm">Messages</h3>
                <div className="text-2xl font-bold mt-2">{periodMetrics.messages}</div>
              </div>
              <div className="bg-neutral-100 rounded-xl p-6">
                <h3 className="font-semibold text-sm">Published Products</h3>
                <div className="text-2xl font-bold mt-2">{periodMetrics.activeProducts}</div>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold">Total Orders</h3>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="flex items-center"><span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>Orders</span>
                  <span className="flex items-center"><span className="w-2 h-2 bg-orange-500 rounded-full mr-1"></span>Requests</span>
                </div>
              </div>
              <div className="h-64 -ml-10 relative">
                <LineChart width={650} height={250} data={chartData} className='cursor-pointer'>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="ccc" />
                  <XAxis dataKey="name"  tick={{ fill: "#616161", fontSize: 14 }} tickLine={false} />
                  <YAxis stroke='#616161' tick={{ fill: "#616161", fontSize: 14 }} tickLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="orders" stroke="#ef4444" />
                  <Line type="monotone" dataKey="requests" stroke="#f97316" />
                </LineChart>

                <div className='absolute w-80 h-40 rounded-lg top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/4 flex flex-col items-center justify-center'>
                  <span className='text-gray-500 text-sm'>No Data Currently</span>
                </div>
              </div>
            </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-[35%] space-y-6">
            {/* Profile Strength */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold mb-4">Your Profile Strength</h3>
              <div className="relative w-32 h-32 mx-auto">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#eee"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="3"
                    strokeDasharray="75, 100"
                  />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg font-bold">
                  75%
                </div>
              </div>
              <div className="mt-6">
                <h4 className="font-medium mb-2">List to updates</h4>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <span className="w-3 h-3 bg-blue-600 rounded-sm mr-2"></span>
                    Company Details
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="w-3 h-3 bg-pink-500 rounded-sm mr-2"></span>
                    Certifications
                  </div>
                </div>
              </div>
              <button className="bg-gradient-to-r from-[#9e1171] to-[#f0b168] text-white px-6 py-2 rounded-[6px] mt-4 w-full" onClick={() => router.push('/seller/profile/seller')}>
                Take Action
              </button>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold mb-4">Notifications/Event Alerts</h3>
              {/* <div className="space-y-4">
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
              </div> */}

              <p className='p-10 flex items-center justify-center text-sm font-semibold text-gray-400'>No New Notifications</p>
            </div>

            {/* Latest Orders */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold mb-4">Latest Orders</h3>
              {/* <div className="space-y-4">
                <OrderItem
                  icon={<Bug className="w-4 h-4" />}
                  text="You have a bug that needs to be fixed"
                  time="Just now"
                />
                <OrderItem
                  icon={<CheckCircle className="w-4 h-4" />}
                  text="Released a new version"
                  time="39 minutes ago"
                />
                <OrderItem
                  icon={<AlertCircle className="w-4 h-4" />}
                  text="Submitted a bug"
                  time="12 hours ago"
                />
              </div> */}
              <p className='p-10 flex items-center justify-center text-sm font-semibold text-gray-400'>No Orders Yet</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, change, changeText, trend, percentage }) => (
  <div className="border rounded-lg p-2">
    <div className="flex items-center justify-between mb-2">
      <span className="text-gray-600 text-xs">{title}</span>
      {trend === 'up' ? (
        <TrendingUp className="w-4 h-4 text-green-500" />
      ) : (
        <TrendingDown className="w-4 h-4 text-red-500" />
      )}
    </div>
    <div className='flex items-center space-x-4'>
    <div className="text-2xl mb-1">{value}</div>
    {percentage && (
        <span className={`ml-2 -mt-1 ${percentage <= 0 ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"} px-2 py-0.5 rounded-xl text-sm flex flex-row items-center`}>
          {percentage <= 0 ? <ArrowDownCircleIcon className='w-4 h-4 mr-1' /> : <ArrowUpCircleIcon className='w-4 h-4 mr-1' />}
          {Math.abs(percentage)}%
        </span>
      )}
    </div>
    <hr className='w-full mt-3 mb-1'></hr>
    <div className='flex items-center space-x-2'>
    <div className="flex items-center text-sm">
      <span className="font-[800]">
        ${change}
      </span>
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