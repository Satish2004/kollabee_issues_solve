"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Bar,
  BarChart,
} from "recharts";
import { dashboardApi } from "@/lib/api/dashboard";
import { OrderSummary } from "@/types/api";
import { TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign } from "lucide-react";

export default function OrderSummaryDashboard() {
  const [period, setPeriod] = useState<'month' | 'week' | 'today' | 'year'>('month');
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchOrderSummary();
  }, [period]);

  const fetchOrderSummary = async () => {
    try {
      setIsLoading(true);
      const response = await dashboardApi.getOrderSummary(period);
      setOrderSummary(response.data);
    } catch (error) {
      console.error("Error fetching order summary:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Order Summary Dashboard</h2>
          <div className="flex items-center gap-2">
            <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!orderSummary) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Order Summary Dashboard</h2>
        <div className="text-center py-12 text-gray-500">
          No order summary data available
        </div>
      </div>
    );
  }

  const { data } = orderSummary;
  const { metrics, buyerDetails, summaryData } = data;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const getTrendIcon = (value: number) => {
    return value >= 0 ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    );
  };

  const getTrendColor = (value: number) => {
    return value >= 0 ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Order Summary Dashboard</h2>
        <div className="flex items-center gap-2">
          <select
            className="text-sm border rounded px-3 py-1"
            value={period}
            onChange={(e) => setPeriod(e.target.value as any)}
          >
            <option value="year">Yearly</option>
            <option value="month">Monthly</option>
            <option value="week">Weekly</option>
            <option value="today">Daily</option>
          </select>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold">{metrics.orders.current}</p>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon(metrics.orders.percentageChange)}
                  <span className={`text-sm ${getTrendColor(metrics.orders.percentageChange)}`}>
                    {formatPercentage(metrics.orders.percentageChange)}
                  </span>
                </div>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(metrics.revenue.current)}</p>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon(metrics.revenue.percentageChange)}
                  <span className={`text-sm ${getTrendColor(metrics.revenue.percentageChange)}`}>
                    {formatPercentage(metrics.revenue.percentageChange)}
                  </span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New Buyers</p>
                <p className="text-2xl font-bold">{metrics.buyers.new.current}</p>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon(metrics.buyers.new.percentageChange)}
                  <span className={`text-sm ${getTrendColor(metrics.buyers.new.percentageChange)}`}>
                    {formatPercentage(metrics.buyers.new.percentageChange)}
                  </span>
                </div>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Repeated Buyers</p>
                <p className="text-2xl font-bold">{metrics.buyers.repeated.current}</p>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon(metrics.buyers.repeated.percentageChange)}
                  <span className={`text-sm ${getTrendColor(metrics.buyers.repeated.percentageChange)}`}>
                    {formatPercentage(metrics.buyers.repeated.percentageChange)}
                  </span>
                </div>
              </div>
              <Users className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Buyer Trends Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Buyer Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={summaryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="new"
                    stackId="1"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.6}
                    name="New Buyers"
                  />
                  <Area
                    type="monotone"
                    dataKey="repeated"
                    stackId="1"
                    stroke="#f97316"
                    fill="#f97316"
                    fillOpacity={0.6}
                    name="Repeated Buyers"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Buyer Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Buyer Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  {
                    name: 'New Buyers',
                    value: metrics.buyers.new.current,
                    color: '#8b5cf6'
                  },
                  {
                    name: 'Repeated Buyers',
                    value: metrics.buyers.repeated.current,
                    color: '#f97316'
                  }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Buyer Details */}
      <Tabs defaultValue="new" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="new">
            New Buyers ({buyerDetails.newBuyers.length})
          </TabsTrigger>
          <TabsTrigger value="repeated">
            Repeated Buyers ({buyerDetails.repeatedBuyers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>New Buyers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {buyerDetails.newBuyers.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No new buyers in this period</p>
                ) : (
                  buyerDetails.newBuyers.map((buyer) => (
                    <div key={buyer.buyerId} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={buyer.buyerImage || ""} alt={buyer.buyerName} />
                          <AvatarFallback>{buyer.buyerName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{buyer.buyerName}</p>
                          <p className="text-sm text-gray-500">{buyer.buyerEmail}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(buyer.orderAmount)}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(buyer.orderDate).toLocaleDateString()}
                        </p>
                        <Badge variant="secondary" className="mt-1">
                          First Order
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="repeated" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Repeated Buyers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {buyerDetails.repeatedBuyers.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No repeated buyers in this period</p>
                ) : (
                  buyerDetails.repeatedBuyers.map((buyer) => (
                    <div key={buyer.buyerId} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={buyer.buyerImage || ""} alt={buyer.buyerName} />
                          <AvatarFallback>{buyer.buyerName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{buyer.buyerName}</p>
                          <p className="text-sm text-gray-500">{buyer.buyerEmail}</p>
                          <p className="text-xs text-gray-400">
                            First order: {new Date(buyer.firstOrderDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(buyer.orderAmount)}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(buyer.orderDate).toLocaleDateString()}
                        </p>
                        <Badge variant="outline" className="mt-1">
                          {buyer.totalOrders} orders
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 