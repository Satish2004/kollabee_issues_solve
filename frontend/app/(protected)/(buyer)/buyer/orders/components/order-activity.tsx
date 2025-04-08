import { CheckCircle, Package, Truck, AlertCircle } from "lucide-react";

type OrderActivity = {
  id: number;
  message: string;
  date: string;
  time: string;
  type: "success" | "info" | "warning" | "primary";
};

export default function OrderActivity() {
  // Hardcoded activity data
  const activities: OrderActivity[] = [
    {
      id: 1,
      message:
        "Your order has been delivered. Thank you for shopping at Clover!",
      date: "23 Jan, 2021",
      time: "7:32 PM",
      type: "success",
    },
    {
      id: 2,
      message:
        "Our delivery man John Wick has picked up your order for delivery",
      date: "23 Jan, 2021",
      time: "2:00 PM",
      type: "info",
    },
    {
      id: 3,
      message: "Your order has reached at our info hub.",
      date: "22 Jan, 2021",
      time: "8:00 AM",
      type: "info",
    },
    {
      id: 4,
      message: "Your order on the way to our info hub.",
      date: "21 Jan, 2021",
      time: "9:32 AM",
      type: "info",
    },
    {
      id: 5,
      message: "Your order is successfully verified",
      date: "20 Jan, 2021",
      time: "7:32 PM",
      type: "success",
    },
    {
      id: 6,
      message: "Your order has been confirmed.",
      date: "19 Jan, 2021",
      time: "2:41 PM",
      type: "primary",
    },
  ];

  // Helper function to get the right icon for activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-3.5 w-3.5 text-green-600" />;
      case "info":
        return <Truck className="h-3.5 w-3.5 text-blue-600" />;
      case "warning":
        return <AlertCircle className="h-3.5 w-3.5 text-yellow-600" />;
      case "primary":
        return <Package className="h-3.5 w-3.5 text-indigo-600" />;
      default:
        return <Package className="h-3.5 w-3.5 text-indigo-600" />;
    }
  };

  return (
    <div className="bg-white p-4 mt-2 rounded-md">
      <h2 className="text-xl font-bold mb-4">Order Activity</h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5 ${
                activity.type === "success"
                  ? "bg-green-100"
                  : activity.type === "info"
                  ? "bg-blue-100"
                  : activity.type === "warning"
                  ? "bg-yellow-100"
                  : "bg-indigo-100"
              }`}
            >
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium">{activity.message}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {activity.date} at {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
