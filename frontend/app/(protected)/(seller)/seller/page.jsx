"use client"

import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Bell, TrendingUp, TrendingDown, AlertCircle, User, CheckCircle, Bug } from 'lucide-react';
import { dashboardApi } from '@/lib/api/dashboard';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalOrders: 4,
    totalRevenue: 0,
    returnedProducts: 0,
    pendingShipments: 0,
    averageOrderValue: 0,
    totalRequests: 4,
    unreadMessages: 0,
    publishedProducts: 1
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  // const [chartData, setChartData] = useState([]);
  // Sample data for the line chart
  const chartData = [
    { name: 'Jan', orders: 0, requests: 0 },
    { name: 'Feb', orders: 0, requests: 0 },
    { name: 'Mar', orders: 0, requests: 0 },
    { name: 'Apr', orders: 0, requests: 0 },
    { name: 'May', orders: 0, requests: 0 },
    { name: 'Jun', orders: 0, requests: 0 },
    { name: 'Jul', orders: 0, requests: 0 },
  ];

  const trendingProducts = [
    'Lux', 'Sanitoor', 'Lifeboy', 'Joy', 'Boro+', 'Gold', 'Diamond'
  ];

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [metricsRes, analyticsRes] = await Promise.all([
        dashboardApi.getMetrics(),
        dashboardApi.getOrderAnalytics('30d')
      ]);

      setDashboardData({
        totalOrders: metricsRes?.totalOrders || 0,
        totalRevenue: metricsRes?.totalRevenue || 0,
        returnedProducts: metricsRes?.returnedProducts || 0,
        pendingShipments: metricsRes?.pendingShipments || 0,
        averageOrderValue: metricsRes?.averageOrderValue || 0,
        totalRequests: metricsRes?.totalRequests || 0,
        unreadMessages: metricsRes?.unreadMessages || 0,
        publishedProducts: metricsRes?.activeProducts || 0
      });

      // Update chart data if needed
      if (analyticsRes.data?.orders?.length) {
        const newChartData = analyticsRes.data.orders.map(order => ({
          name: new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short' }),
          orders: order.totalAmount,
          requests: order.requestCount
        }));
        setChartData(newChartData);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Orders Overview */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Orders Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <StatCard
                  title="TOTAL ORDERS"
                  value={dashboardData.totalOrders.toString()}
                  change={`+${Math.floor(dashboardData.totalOrders * 0.1)}`}
                  changeText="from last month"
                  trend="up"
                  percentage="10%"
                />
                <StatCard
                  title="TOTAL RECEIVED"
                  value={`₹${dashboardData.totalRevenue.toLocaleString()}`}
                  change={`+₹${Math.floor(dashboardData.totalRevenue * 0.1)}`}
                  changeText="Revenue"
                  trend="up"
                  percentage="10.2%"
                />
                <StatCard
                  title="RETURNED PRODUCTS"
                  value={dashboardData.returnedProducts.toString()}
                  change={`-₹${Math.floor(dashboardData.returnedProducts * 0.1)}`}
                  changeText="from last month"
                  trend="down"
                  percentage="0%"
                />
                <StatCard
                  title="ON THE WAY TO SHIP"
                  value={dashboardData.pendingShipments.toString()}
                  change={`₹${Math.floor(dashboardData.pendingShipments * 0.1)}`}
                  changeText="Products shipping"
                  trend="up"
                  percentage="0%"
                />
                <StatCard
                  title="AVERAGE SALES"
                  value={`₹${dashboardData.averageOrderValue.toLocaleString()}`}
                  change={`+₹${Math.floor(dashboardData.averageOrderValue * 0.1)}`}
                  changeText="from last month"
                  trend="up"
                  percentage="3.4%"
                />
              </div>
            </div>

            {/* Charts and Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-red-50 rounded-xl p-4">
                <h3 className="font-semibold">Requests</h3>
                <div className="text-2xl font-bold mt-2">{dashboardData.totalRequests}</div>
                <div className="text-sm text-red-600">+6.08%</div>
              </div>
              <div className="bg-white rounded-xl p-4">
                <h3 className="font-semibold">Messages</h3>
                <div className="text-2xl font-bold mt-2">{dashboardData.unreadMessages}</div>
              </div>
              <div className="bg-white rounded-xl p-4">
                <h3 className="font-semibold">Published Products</h3>
                <div className="text-2xl font-bold mt-2">{dashboardData.publishedProducts}</div>
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
              <div className="h-64">
                <LineChart width={650} height={250} data={chartData} className=''>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="orders" stroke="#ef4444" />
                  <Line type="monotone" dataKey="requests" stroke="#f97316" />
                </LineChart>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
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
  <div className="bg-gray-50 rounded-lg p-4">
    <div className="flex items-center justify-between mb-2">
      <span className="text-gray-600 text-sm">{title}</span>
      {trend === 'up' ? (
        <TrendingUp className="w-4 h-4 text-green-500" />
      ) : (
        <TrendingDown className="w-4 h-4 text-red-500" />
      )}
    </div>
    <div className="text-2xl font-bold mb-1">{value}</div>
    <div className="flex items-center text-sm">
      <span className={trend === 'up' ? 'text-green-500' : 'text-red-500'}>
        {change}
      </span>
      {percentage && (
        <span className="ml-2 bg-red-100 text-red-600 px-1.5 rounded text-xs">
          {percentage}
        </span>
      )}
    </div>
    <div className="text-gray-500 text-sm">{changeText}</div>
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