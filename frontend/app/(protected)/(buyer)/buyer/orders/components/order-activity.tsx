import { CheckCircle, Package, Truck, Home, Clock, X, AlertCircle } from "lucide-react";

type OrderActivity = {
  id: number;
  message: string;
  date: string;
  time: string;
  type: "success" | "info" | "warning" | "primary" | "pending" | "error";
};

export default function OrderActivity({ order }: { order: any }) {
  // Generate activity data based on order status
  const generateActivities = (): OrderActivity[] => {
    if (!order) return [];

    const activities: OrderActivity[] = [];
    const createdAt = new Date(order.createdAt);
    const updatedAt = new Date(order.updatedAt);

    // Format date and time consistently
    const formatDateTime = (date: Date) => {
      return {
        date: date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
        time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
    };

    // Always show order placed activity
    activities.push({
      id: 1,
      message: "Your order has been placed successfully.",
      ...formatDateTime(createdAt),
      type: "primary"
    });

    // Show different activities based on order status
    switch (order.status) {
      case 'cancelled':
        activities.push({
          id: 2,
          message: "Your order has been cancelled.",
          ...formatDateTime(updatedAt),
          type: "error"
        });
        break;
      case 'delivered':
        activities.push({
          id: 2,
          message: "Your order has been packed and is ready for shipment.",
          ...formatDateTime(new Date(createdAt.getTime() + 3600000)), // 1 hour after creation
          type: "info"
        });
        activities.push({
          id: 3,
          message: "Our delivery partner has picked up your order.",
          ...formatDateTime(new Date(createdAt.getTime() + 7200000)), // 2 hours after creation
          type: "info"
        });
        activities.push({
          id: 4,
          message: "Your order is out for delivery.",
          ...formatDateTime(new Date(createdAt.getTime() + 10800000)), // 3 hours after creation
          type: "info"
        });
        activities.push({
          id: 5,
          message: "Your order has been delivered successfully.",
          ...formatDateTime(updatedAt),
          type: "success"
        });
        break;
      case 'in_progress':
        activities.push({
          id: 2,
          message: "Your order has been packed and is ready for shipment.",
          ...formatDateTime(new Date(createdAt.getTime() + 3600000)),
          type: "info"
        });
        activities.push({
          id: 3,
          message: "Our delivery partner has picked up your order.",
          ...formatDateTime(new Date(createdAt.getTime() + 7200000)),
          type: "info"
        });
        activities.push({
          id: 4,
          message: "Your order is on the way to your location.",
          ...formatDateTime(updatedAt),
          type: "info"
        });
        break;
      case 'PACKED':
        activities.push({
          id: 2,
          message: "Your order has been packed and is ready for shipment.",
          ...formatDateTime(updatedAt),
          type: "info"
        });
        break;
      case 'PENDING':
        activities.push({
          id: 2,
          message: "Your order is being processed.",
          ...formatDateTime(new Date()),
          type: "pending"
        });
        break;
      default:
        break;
    }

    return activities;
  };

  const activities = generateActivities();

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
      case "pending":
        return <Clock className="h-3.5 w-3.5 text-amber-600" />;
      case "error":
        return <X className="h-3.5 w-3.5 text-red-600" />;
      default:
        return <Package className="h-3.5 w-3.5 text-indigo-600" />;
    }
  };

  return (
    <div className="bg-white p-4 mt-2 rounded-md border">
      <h2 className="text-lg font-bold mb-4">Order Activity</h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5 ${activity.type === "success"
                  ? "bg-green-100"
                  : activity.type === "info"
                    ? "bg-blue-100"
                    : activity.type === "warning"
                      ? "bg-yellow-100"
                      : activity.type === "pending"
                        ? "bg-amber-100"
                        : activity.type === "error"
                          ? "bg-red-100"
                          : "bg-indigo-100"
                }`}
            >
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{activity.message}</p>
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