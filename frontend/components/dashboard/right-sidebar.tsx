"use client";

import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Bell } from "lucide-react"
import { ResponsiveContainer, PieChart, Pie, Label, Tooltip } from 'recharts';
import { useEffect, useState } from "react";
import { getLatestOrdersAction, getProfileStrengthAction } from "@/actions/seller-dashboard";
import { LatestOrder, ProfileStrength, ProfileStrengthData } from "@/types/dashboard";
import { Skeleton } from "../ui/skeleton";
import { formatDistanceToNow } from "date-fns";

const notifications = [
  {
    id: 1,
    message: "You have a bug that needs to h..",
    time: "Just now",
    avatar: "/avatars/01.png",
  },
  {
    id: 2,
    message: "New user registered",
    time: "12 hours ago",
    avatar: "/avatars/02.png",
  },
  {
    id: 3,
    message: "You have a bug that needs to h..",
    time: "12 hours ago",
    avatar: "/avatars/03.png",
  },
]

const CustomTooltip = ({ active, payload }) => {
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

export function RightSidebar() {
  const [isLoading, setIsLoading] = useState(true);
  const [profileStrength, setProfileStrength] = useState<ProfileStrength | null>(null);
  const [latestOrders, setLatestOrders] = useState([]);
  const [profileData, setProfileData] = useState<ProfileStrengthData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [strengthData, orders] = await Promise.all([
          getProfileStrengthAction(),
          getLatestOrdersAction()
        ]);

        setProfileStrength(strengthData);
        setLatestOrders(orders);

        // Transform profile strength data for the pie chart
        const chartData: ProfileStrengthData[] = [
          { 
            name: "Company Details", 
            value: strengthData.companyDetails, 
            fill: "rgb(147, 51, 234)" 
          },
          { 
            name: "Personal Information", 
            value: strengthData.personalInfo, 
            fill: "rgb(250, 204, 21)" 
          },
          { 
            name: "Describe your brand", 
            value: strengthData.brandDescription, 
            fill: "rgb(249, 115, 22)" 
          },
          { 
            name: "Certifications", 
            value: strengthData.certifications, 
            fill: "rgb(236, 72, 153)" 
          },
          { 
            name: "Add details", 
            value: strengthData.additionalDetails, 
            fill: "rgb(209, 213, 219)" 
          }
        ];

        setProfileData(chartData);
      } catch (error) {
        console.error('Error fetching sidebar data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6 rounded-lg">
        <Card className="rounded-lg bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Your Profile Strength</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="mx-auto aspect-square max-h-[200px]">
                <Skeleton className="h-full w-full rounded-full" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-6 w-full" />
                  ))}
                </div>
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <Skeleton key={i} className="h-6 w-full" />
                  ))}
                </div>
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-lg bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Latest Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 rounded-lg">
      <Card className="rounded-lg bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Your Profile Strength</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="mx-auto aspect-square max-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<CustomTooltip />} />
                  <Pie
                    data={profileData}
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
                                {profileStrength?.totalStrength}%
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
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-3">
                {profileData.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="h-4 w-4 rounded" style={{ background: item.fill }} />
                    <span className="ml-2 text-sm">{item.name}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                {profileData.slice(3).map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="h-4 w-4 rounded" style={{ background: item.fill }} />
                    <span className="ml-2 text-sm">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <Button className="w-full bg-gradient-to-r from-purple-600 to-yellow-400 hover:from-purple-700 hover:to-yellow-500 text-white">
              Take Action
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-lg bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Notifications/Event Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-start space-x-4">
                <Bell className="h-5 w-5 text-blue-500" />
                <div className="flex-1">
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-gray-500">{notification.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-lg bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Latest Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {latestOrders.map((order) => (
              <div key={order.id} className="flex items-center space-x-4">
                <Avatar>
                  <AvatarFallback>{order.buyerName?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm">Order {order.status}</p>
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
