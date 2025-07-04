"use client"
import { AdminApi } from '@/lib/api';
import React, { useState, useEffect } from 'react'
import { Chart } from "react-google-charts";

type UserType = 'buyer' | 'seller';

interface UserRegionMetrics {
  type: UserType;
  total: {
    current: number;
    past: number;
    percentageChange: string;
  };
  active: {
    current: number;
    past: number;
    percentageChange: string;
  };
  new: {
    current: number;
    past: number;
    percentageChange: string;
  };
  topCountries: {
    current: {
      country: string;
      count: number;
      percentage: number;
    }[];
    past: {
      country: string;
      count: number;
      percentage: number;
    }[];
  };
  requests?: {
    current: number;
    past: number;
    percentageChange: string;
  };
  products?: {
    current: number;
    past: number;
    percentageChange: string;
  };
}

function UserGeoChart({ defaultType = 'seller' }: { defaultType?: UserType }) {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<UserRegionMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userType, setUserType] = useState<UserType>(defaultType);

  const fetchMetrics = async (type: UserType) => {
    try {
      setLoading(true);
      const response = await AdminApi.getSupplierRegionMetrics(type);
      setMetrics(response);
    } catch (err) {
      console.error(`Error fetching ${type} region metrics:`, err);
      setError(`Failed to load ${type} data`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics(userType);
  }, [userType]);

  const toggleUserType = () => {
    const newType = userType === 'seller' ? 'buyer' : 'seller';
    setUserType(newType);
  };

  // Transform API data for the GeoChart (all countries)
  const getGeoChartData = () => {
    if (!metrics?.topCountries?.current) return [["Country", userType === 'seller' ? 'Suppliers' : 'Buyers']];

    return [
      ["Country", userType === 'seller' ? 'Suppliers' : 'Buyers'],
      ...metrics.topCountries.current.map(country => [
        country.country,
        country.count
      ])
    ];
  };

  // Transform API data for progress bars (top 5 countries)
  const getTopCountriesData = () => {
    if (!metrics?.topCountries?.current) return [];

    return metrics.topCountries.current.slice(0, 5).map(country => ({
      country: country.country,
      count: country.count,
      percentage: country.percentage
    }));
  };

  const options = {
    datalessRegionColor: "#fdeff0",
    defaultColor: "#f5f5f5",
    colorAxis: {
      colors: ["#efaf68", "#6e114c"],
      minValue: 1
    },
    tooltip: {
      textStyle: { fontSize: 14 },
      showColorCode: true
    },
    legend: 'none',
    backgroundColor: '#ffffff',
    keepAspectRatio: true
  };

  if (error) return (
    <div className="p-4 bg-red-50 text-red-600 rounded-lg">
      {error}
    </div>
  );

  if (loading) return (
    <div className="w-full h-64 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between items-center pb-2 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">
          {userType === 'seller' ? 'Supplier' : 'Buyer'} Geographic Distribution
        </h2>
        <button
          onClick={toggleUserType}
          className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          Show {userType === 'seller' ? 'Buyers' : 'Suppliers'}
        </button>
      </div>

      <div className="mt-4 p-5 bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-start mb-6">
          <div className="flex-1">
            <h3 className="text-base font-medium text-gray-800">
              {userType === 'seller' ? 'Supplier' : 'Buyer'} Geographic Distribution
            </h3>
            <p className="text-sm text-gray-500">
              {metrics && `Total: ${metrics?.total?.current} ${userType === 'seller' ? 'suppliers' : 'buyers'} (${metrics?.active?.current} active)`}
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left side - Top 5 countries with progress bars */}
          <div className="w-full md:w-1/3 space-y-6">
            {getTopCountriesData().map((item) => (
              <div key={item.country} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{item.country}</span>
                  <span className="text-sm text-gray-500">
                    {item.count} ({item.percentage}%)
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-l from-[#6f124c] via-[#db4e60] to-[#ecac67] rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Right side - Geo Chart (All countries) */}
          <div className="w-full md:w-2/3 h-[300px]">
            <Chart
              chartType="GeoChart"
              width="100%"
              height="100%"
              data={getGeoChartData()}
              options={options}
              loader={<div className="w-full h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>}
            />
          </div>
        </div>

        {/* Additional metrics */}
        {metrics && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm text-gray-500">Total {userType === 'seller' ? 'Suppliers' : 'Buyers'}</h4>
              <p className="text-xl font-semibold">{metrics?.total?.current}</p>
              <p className={`text-sm ${parseInt(metrics?.total?.percentageChange) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {metrics.total.percentageChange} from last period
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm text-gray-500">Active {userType === 'seller' ? 'Suppliers' : 'Buyers'}</h4>
              <p className="text-xl font-semibold">{metrics?.active?.current}</p>
              <p className={`text-sm ${parseInt(metrics?.active?.percentageChange) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {metrics.active.percentageChange} from last period
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm text-gray-500">New {userType === 'seller' ? 'Suppliers' : 'Buyers'}</h4>
              <p className="text-xl font-semibold">{metrics.new.current}</p>
              <p className={`text-sm ${parseInt(metrics.new.percentageChange) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {metrics.new.percentageChange} from last period
              </p>
            </div>

            {/* Type-specific metrics */}
            {userType === 'buyer' && metrics.requests && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm text-gray-500">Requests</h4>
                <p className="text-xl font-semibold">{metrics.requests.current}</p>
                <p className={`text-sm ${parseInt(metrics.requests.percentageChange) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {metrics.requests.percentageChange} from last period
                </p>
              </div>
            )}

            {userType === 'seller' && metrics.products && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm text-gray-500">Products</h4>
                <p className="text-xl font-semibold">{metrics.products.current}</p>
                <p className={`text-sm ${parseInt(metrics.products.percentageChange) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {metrics.products.percentageChange} from last period
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserGeoChart;