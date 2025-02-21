"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { OrderChartData, Period } from "@/types/dashboard";
import { useEffect, useState } from "react";
import { getOrdersChartDataAction } from "@/actions/seller-dashboard";
import { Skeleton } from "../ui/skeleton";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

interface OrdersChartProps {
  period: Period;
}

export function OrdersChart({ period }: OrdersChartProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState<OrderChartData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getOrdersChartDataAction(period);
        setChartData(data as OrderChartData[]);
      } catch (error) {
        console.error("Error fetching orders chart data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [period]);

  // Calculate chart dimensions based on data length and period
  const getChartWidth = () => {
    const baseWidth = 800; // Base width for standard view
    const minWidth = 500; // Minimum width
    const barWidth = 40; // Width per bar
    const dataLength = chartData.length;

    // Calculate width based on number of bars
    const calculatedWidth = Math.max(minWidth, dataLength * barWidth);

    // Return the larger of base width or calculated width
    return Math.max(baseWidth, calculatedWidth);
  };

  if (isLoading) {
    return (
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Total Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <Skeleton className="h-full w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Total Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full">
          <div style={{ width: '100%', height: '300px' }}>
            <div style={{ width: `${getChartWidth()}px`, height: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis
                    dataKey="date"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    interval={0}
                    angle={period === 'year' || period === 'all' ? -45 : 0}
                    textAnchor={period === 'year' || period === 'all' ? "end" : "middle"}
                    height={60}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white',
                      border: '1px solid #ccc',
                      borderRadius: '4px'
                    }}
                    formatter={(value: number) => [`${value} orders`, 'Orders']}
                    labelFormatter={(label) => {
                      if (period === 'today') {
                        return `${label}:00`;
                      }
                      return label;
                    }}
                  />
                  <Bar
                    dataKey="orders"
                    fill="#adfa1d"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
