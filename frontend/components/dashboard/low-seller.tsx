"use client"

import { useEffect, useState } from "react";
import { Label, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { TrendingDown } from "lucide-react"
import { Period, Product } from "@/types/dashboard";
import { getLowSellingProductsAction } from "@/actions/seller-dashboard";
import { Skeleton } from "../ui/skeleton";

interface LowSellerProps {
  period: Period;
}

const chartData = [
  { name: "Loss", value: 38.4, fill: "#000000" },
  { name: "Segment1", value: 20.5, fill: "#60A5FA" },
  { name: "Segment2", value: 20.5, fill: "#34D399" },
  { name: "Segment3", value: 20.6, fill: "#A78BFA" },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-white p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-1">
            <div
              className="h-2 w-2 rounded-full"
              style={{ background: payload[0].payload.fill }}
            />
            <span className="text-sm font-medium">{payload[0].name}</span>
          </div>
          <div className="text-right">
            <span className="text-sm font-medium">{payload[0].value}%</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function LowSeller({ period }: LowSellerProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getLowSellingProductsAction(period);
        setProducts(data as Product[]);
      } catch (error) {
        console.error("Error fetching low selling products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [period]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="mx-auto aspect-square max-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={80}
              startAngle={90}
              endAngle={-270}
              strokeWidth={0}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-2xl font-bold"
                        >
                          38.4%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 20}
                          className="fill-muted-foreground text-sm"
                        >
                          Total loss
                        </tspan>
                      </text>
                    )
                  }
                  return null;
                }}
              />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 space-y-3">
        {products.map((product) => (
          <div key={product.id} className="flex items-center justify-between">
            <span className="text-sm font-medium">{product.name}</span>
            <span className="text-sm text-gray-500">${product.price.toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm text-red-500">
        <TrendingDown className="h-4 w-4" />
        <span>Down by 38.4% this month</span>
      </div>
    </div>
  );
}
