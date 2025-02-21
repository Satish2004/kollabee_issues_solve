import { Button } from "@/components/ui/button"
import { ArrowLeft, Box, CheckCircle2, MapPin, Package, Truck, UserCheck2 } from "lucide-react"

interface OrderActivity {
  message: string
  timestamp: string
  icon: React.ReactNode
  type: "success" | "info"
}

const demoOrderActivity: OrderActivity[] = [
  {
    message: "Your order has been delivered. Thank you for shopping at Clicon!",
    timestamp: "23 Jan, 2021 at 7:32 PM",
    icon: <CheckCircle2 className="h-4 w-4" />,
    type: "success",
  },
  {
    message: "Our delivery man (John Wick) Has picked-up your order for delivery.",
    timestamp: "23 Jan, 2021 at 2:00 PM",
    icon: <UserCheck2 className="h-4 w-4" />,
    type: "info",
  },
  {
    message: "Your order has reached at last mile hub.",
    timestamp: "22 Jan, 2021 at 8:00 AM",
    icon: <MapPin className="h-4 w-4" />,
    type: "info",
  },
  {
    message: "Your order on the way to (last mile) hub.",
    timestamp: "21, 2021 at 5:32 AM",
    icon: <Truck className="h-4 w-4" />,
    type: "info",
  },
  {
    message: "Your order is successfully verified.",
    timestamp: "20 Jan, 2021 at 7:32 PM",
    icon: <CheckCircle2 className="h-4 w-4" />,
    type: "success",
  },
  {
    message: "Your order has been confirmed.",
    timestamp: "19 Jan, 2021 at 2:61 PM",
    icon: <Package className="h-4 w-4" />,
    type: "info",
  },
]

interface TrackOrderProps {
  orderId: string
  onBack: () => void
}

export function TrackOrder({ orderId, onBack }: TrackOrderProps) {
  return (
    <div className="space-y-8">
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-2"
        onClick={onBack}
      >
        <ArrowLeft className="h-4 w-4" />
        Track Order
      </Button>

      <div className="space-y-6 rounded-lg bg-muted/50 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xl font-semibold">#{orderId}</p>
            <p className="text-sm text-muted-foreground">
              4 Products • Order Placed in 17 Jan, 2021 at 7:32 PM
            </p>
          </div>
          <p className="text-xl font-semibold">$1199.00</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Order expected arrival 23 Jan, 2021
          </p>
          <div className="mt-6 flex items-center justify-between">
            <div className="flex flex-col items-center gap-2">
              <div className="relative">
                <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" />
                <Package className="h-8 w-8 text-primary" />
              </div>
              <p className="text-xs font-medium">Order Placed</p>
            </div>

            <div className="relative flex-1">
              <div className="absolute left-0 top-4 h-0.5 w-full bg-primary" />
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="relative">
                <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" />
                <Box className="h-8 w-8 text-primary" />
              </div>
              <p className="text-xs font-medium">Packaging</p>
            </div>

            <div className="relative flex-1">
              <div className="absolute left-0 top-4 h-0.5 w-full bg-muted" />
            </div>

            <div className="flex flex-col items-center gap-2">
              <Truck className="h-8 w-8 text-muted-foreground" />
              <p className="text-xs font-medium text-muted-foreground">
                On The Road
              </p>
            </div>

            <div className="relative flex-1">
              <div className="absolute left-0 top-4 h-0.5 w-full bg-muted" />
            </div>

            <div className="flex flex-col items-center gap-2">
              <CheckCircle2 className="h-8 w-8 text-muted-foreground" />
              <p className="text-xs font-medium text-muted-foreground">
                Delivered
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Order Activity</h3>
        <div className="space-y-4">
          {demoOrderActivity.map((activity, index) => (
            <div
              key={index}
              className={`flex gap-4 rounded-lg border p-4 ${
                activity.type === "success" ? "bg-green-50" : "bg-blue-50"
              }`}
            >
              <div
                className={`${
                  activity.type === "success"
                    ? "text-green-500"
                    : "text-blue-500"
                }`}
              >
                {activity.icon}
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm">{activity.message}</p>
                <p className="text-xs text-muted-foreground">
                  {activity.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
