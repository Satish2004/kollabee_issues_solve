// import { ExpenseDashboard } from "@/components/seller-advertise/expense-dashboard";
// import { HeaderActions } from "@/components/seller-advertise/header-actions";
// import { MetricsGrid } from "@/components/seller-advertise/metrics-grid";
// import { ProductAnalytics } from "@/components/seller-advertise/product-analytics";
// import { RevenueDashboard } from "@/components/seller-advertise/revenue-dashboard";

// export default function AdvertisePage() {
//     return (
//         <div className="flex flex-col gap-5">
//             <HeaderActions />
//             <MetricsGrid />
//             <RevenueDashboard />
//             <ProductAnalytics />
//             <ExpenseDashboard />
//         </div>
//     )
// }

"use client"
import React, { useState } from 'react';
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, CartesianGrid ,} from 'recharts';
import { ArrowUpRight, ArrowDownRight, MoreHorizontal, Download } from 'lucide-react';


const StatCard: React.FC<any> = ({ title, value, change }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-600 text-sm">{title}</h3>
        <div className="bg-gray-100 rounded-full p-1">
          {change.trend === 'up' ? (
            <ArrowUpRight className="w-4 h-4 text-green-500" />
          ) : (
            <ArrowDownRight className="w-4 h-4 text-red-500" />
          )}
        </div>
      </div>
      <div className="text-2xl font-bold mb-2">{value}</div>
      <div className="flex items-center space-x-2">
        <span className={`text-sm ${
          change.trend === 'up' ? 'text-green-500' : 'text-red-500'
        }`}>
          {change.percentage}
        </span>
        <span className="text-gray-500 text-sm">{change.text}</span>
      </div>
    </div>
  );
// Add data for all charts
const areaChartData = [
  { name: 'Jan', total: 1200, first: 900, second: 600, third: 300 },
  { name: 'Feb', total: 1400, first: 1100, second: 800, third: 400 },
  { name: 'Mar', total: 1100, first: 800, second: 600, third: 300 },
  { name: 'Apr', total: 1500, first: 1200, second: 900, third: 600 },
  { name: 'May', total: 1300, first: 1000, second: 700, third: 400 },
  { name: 'Jun', total: 1600, first: 1300, second: 1000, third: 700 },
];

const pieChartData = [
  { name: 'Direct', value: 75 },
  { name: 'Other', value: 25 }
];

const locationData = [
  { city: 'New York', visits: '72K', lat: 40.7128, lon: -74.0060 },
  { city: 'San Francisco', visits: '39K', lat: 37.7749, lon: -122.4194 },
  { city: 'Sydney', visits: '25K', lat: -33.8688, lon: 151.2093 },
  { city: 'Singapore', visits: '61K', lat: 1.3521, lon: 103.8198 }
];

const productAnalyticsData = [
  { name: 'Product A', views: 1200, sales: 800, conversion: 66 },
  { name: 'Product B', views: 1400, sales: 900, conversion: 64 },
  { name: 'Product C', views: 1100, sales: 750, conversion: 68 },
  { name: 'Product D', views: 1300, sales: 850, conversion: 65 }
];

interface ChartContainerProps {
  children: React.ReactNode;
  title: string;
  subTitle?: string;
  showMenu?: boolean;
}

const ChartContainer: React.FC<ChartContainerProps> = ({ 
  children, 
  title, 
  subTitle, 
  showMenu = true 
}) => (
  <div className="bg-white rounded-xl p-6 shadow-sm">
    <div className="flex justify-between items-start mb-6">
      <div>
        <h3 className="font-semibold">{title}</h3>
        {subTitle && <div className="text-sm text-gray-500">{subTitle}</div>}
      </div>
      {showMenu && (
        <button>
          <MoreHorizontal className="w-5 h-5 text-gray-400" />
        </button>
      )}
    </div>
    {children}
  </div>
);

const SpendingChart: React.FC = () => {
  const [activeDataKey, setActiveDataKey] = useState('total');

  return (
    <div className="h-[300px]">
      <div className="flex gap-4 mb-4">
        <button 
          className={`text-sm ${activeDataKey === 'total' ? 'text-red-500' : 'text-gray-500'}`}
          onClick={() => setActiveDataKey('total')}
        >
          TOTAL
        </button>
        <button 
          className={`text-sm ${activeDataKey === 'first' ? 'text-red-500' : 'text-gray-500'}`}
          onClick={() => setActiveDataKey('first')}
        >
          1ST AD CAMPAIGN
        </button>
        <button 
          className={`text-sm ${activeDataKey === 'second' ? 'text-red-500' : 'text-gray-500'}`}
          onClick={() => setActiveDataKey('second')}
        >
          2ND AD CAMPAIGN
        </button>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={areaChartData}>
          <defs>
            <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <Tooltip />
          <Area
            type="monotone"
            dataKey={activeDataKey}
            stroke="#ef4444"
            fill="url(#colorSpending)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const RevenueDistribution: React.FC = () => (
  <div className="relative h-[200px]">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={pieChartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill="#ef4444"
          dataKey="value"
        >
          {pieChartData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={index === 0 ? '#ef4444' : '#f3f4f6'} 
            />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
      <div className="text-2xl font-bold">75%</div>
      <div className="text-sm text-gray-500">Net Income</div>
    </div>
  </div>
);

const LocationMap: React.FC = () => (
  <div className="mt-6">
    <h4 className="text-sm text-gray-500 mb-4">Revenue by Location</h4>
    <div className="space-y-3">
      {locationData.map((location, index) => (
        <div key={index} className="flex justify-between items-center">
          <span className="text-sm">{location.city}</span>
          <span className="text-sm font-medium">{location.visits}</span>
        </div>
      ))}
    </div>
  </div>
);

const ProductAnalytics: React.FC = () => (
  <div className="h-[300px]">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={productAnalyticsData}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <Tooltip />
        <Line 
          type="monotone" 
          dataKey="views" 
          stroke="#ef4444" 
          strokeWidth={2}
          dot={false}
        />
        <Line 
          type="monotone" 
          dataKey="sales" 
          stroke="#3b82f6" 
          strokeWidth={2}
          dot={false}
        />
        <Line 
          type="monotone" 
          dataKey="conversion" 
          stroke="#10b981" 
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const AdvertiseDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header section remains the same */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Advertise</h1>
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 text-gray-600 px-4 py-2 border rounded-lg">
            <Download className="w-4 h-4" />
            <span>Download Report</span>
          </button>
          <button className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg">
            Promote New Product
          </button>
        </div>
      </div>

      {/* Stats Grid remains the same */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <StatCard
          title="PROFIT"
          value="$23,000"
          change={{
            value: "+$2,123",
            percentage: "+10.5%",
            trend: "up",
            text: "from advertise"
          }}
        />
        <StatCard
          title="TOTAL SALES"
          value="23,000"
          change={{
            value: "+$1,123",
            percentage: "+5.6%",
            trend: "up",
            text: "from advertise"
          }}
        />
        <StatCard
          title="TOTAL ORDERS"
          value="4,000"
          change={{
            value: "+223",
            percentage: "-10.5%",
            trend: "down",
            text: "from advertise"
          }}
        />
        <StatCard
          title="IMPRESSION"
          value="345K"
          change={{
            value: "-223K",
            percentage: "+10.5%",
            trend: "up",
            text: "from advertise"
          }}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <ChartContainer 
          title="Spending of Money" 
          subTitle="Recent Capital"
        >
          <SpendingChart />
        </ChartContainer>

        <ChartContainer title="Growth in Numbers">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Customers</div>
                <div className="text-2xl font-bold">3,781</div>
                <div className="flex items-center text-green-500 text-sm">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>+11.01%</span>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Revenue</div>
                <div className="text-2xl font-bold">$695</div>
                <div className="flex items-center text-green-500 text-sm">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>+16.51%</span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm text-gray-500">Orders</div>
                <div className="text-sm text-gray-500">Growth</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-xl font-bold">1,219</div>
                <div className="text-xl font-bold text-red-500">30.1%</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center text-red-500 text-sm">
                  <ArrowDownRight className="w-4 h-4" />
                  <span>-0.03%</span>
                </div>
                <div className="flex items-center text-green-500 text-sm">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>+14.08%</span>
                </div>
              </div>
            </div>

            <LocationMap />
          </div>
        </ChartContainer>
      </div>

      {/* Analytics Section */}
      <ChartContainer title="Analytics of Products">
        <ProductAnalytics />
      </ChartContainer>
    </div>
  );
};

export default AdvertiseDashboard;

