import { Button } from "@/components/ui/button"
// import { prisma } from "@/lib/db"
import { Eye } from "lucide-react"

interface Order {
  id: string
  date: string
  status: "In progress" | "Delivered" | "Cancelled"
  total: number
}

const demoOrders: Order[] = [
  {
    id: "78A6431D409",
    date: "Feb 6, 2023",
    status: "In progress",
    total: 2105.90,
  },
  {
    id: "78A6431D409",
    date: "Feb 6, 2023",
    status: "Delivered",
    total: 2105.90,
  },
  {
    id: "78A6431D409",
    date: "Feb 6, 2023",
    status: "Cancelled",
    total: 2105.90,
  },
  {
    id: "78A6431D409",
    date: "Feb 6, 2023",
    status: "In progress",
    total: 2105.90,
  },
]

interface OrdersListProps {
  onTrackOrder: (orderId: string) => void
  orders: any[]
}

export function OrdersList({ onTrackOrder, orders }: OrdersListProps) {

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Orders</h2>
        <span className="text-muted-foreground">({orders.length})</span>
      </div>
      
      <div className="space-y-4">
        {orders.map((order, index) => (
          <div
            key={index}
            className="grid grid-cols-2 gap-4 rounded-lg border p-4 sm:grid-cols-4 sm:items-center"
          >
            <div className="space-y-1">
              <p className="text-sm font-medium">Order#</p>
              <p className="text-sm text-muted-foreground">{order.id}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium">Order Date</p>
              <p className="text-sm text-muted-foreground">{order?.createdAt?.toLocaleDateString()}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium">Status</p>
              <div className="flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full ${
                    order.status === "In progress"
                      ? "bg-blue-500"
                      : order.status === "Delivered"
                      ? "bg-green-500"
                      : "bg-yellow-500"
                  }`}
                />
                {/* <p className="text-sm text-muted-foreground">{order.status}</p> */}
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between sm:justify-end gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Total</p>
                <p className="text-sm text-muted-foreground">
                  ${order.total.toFixed(2)}
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden sm:flex"
                >
                  View Details
                </Button>
                {/* {order.status === "In progress" && ( */}
                  <Button
                    size="sm"
                    onClick={() => onTrackOrder(order.id)}
                  >
                    Track Order
                  </Button>
                {/* )} */}
                <Button
                  variant="outline"
                  size="icon"
                  className="sm:hidden"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
