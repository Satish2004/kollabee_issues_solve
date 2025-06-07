"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Truck, ArrowRight, Clock, MapPin, User, Phone, Mail } from "lucide-react"

export function OrderDetail({ order, open, onOpenChange }) {
  const [activeTab, setActiveTab] = useState("details")

  if (!order) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Order {order.id}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="details">Order Details</TabsTrigger>
            <TabsTrigger value="customer">Customer Info</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
            <TabsTrigger value="history">Order History</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base">Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">Order ID</div>
                      <div className="font-medium">{order.id}</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">Order Date</div>
                      <div className="font-medium">{order.orderDate}</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">Status</div>
                      <StatusBadge status={order.status} />
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">Product Channel</div>
                      <div className="font-medium">{order.productChannel}</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">Subtotal</div>
                      <div className="font-medium">$120.00</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">Shipping</div>
                      <div className="font-medium">$10.00</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">Tax</div>
                      <div className="font-medium">$12.00</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="font-medium">Total</div>
                      <div className="font-bold text-lg">$142.00</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Customer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={order.buyer.avatar || "/placeholder.svg"} alt={order.buyer.name} />
                      <AvatarFallback>{order.buyer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{order.buyer.name}</div>
                      <div className="text-sm text-muted-foreground">Customer since Jan 2023</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab("customer")}>
                    View Customer Details
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-base">Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 border rounded-md">
                    <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center">
                      <Package className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">Premium Product</div>
                      <div className="text-sm text-muted-foreground">SKU: PRD-12345</div>
                    </div>
                    <div className="text-sm text-muted-foreground">Qty: 1</div>
                    <div className="font-medium">$120.00</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customer">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Customer Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={order.buyer.avatar || "/placeholder.svg"} alt={order.buyer.name} />
                        <AvatarFallback>{order.buyer.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-lg">{order.buyer.name}</div>
                        <StatusBadge status={order.status === "Completed" ? "Active Buying" : "Not Active"} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div className="text-sm text-muted-foreground">Customer ID</div>
                      </div>
                      <div className="font-medium">CUST-{order.id.substring(4)}</div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <div className="text-sm text-muted-foreground">Email</div>
                      </div>
                      <div className="font-medium">{order.buyer.name.toLowerCase().replace(" ", ".")}@example.com</div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <div className="text-sm text-muted-foreground">Phone</div>
                      </div>
                      <div className="font-medium">+1 (555) 123-4567</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <div className="text-sm text-muted-foreground">Shipping Address</div>
                      </div>
                      <div className="font-medium">{order.address}</div>
                      <div className="text-sm text-muted-foreground">United States</div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Customer Since</div>
                      <div className="font-medium">January 15, 2023</div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Total Orders</div>
                      <div className="font-medium">12</div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Total Spent</div>
                      <div className="font-medium">$1,245.00</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shipping">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Shipping Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">Shipping Address</div>
                        <div className="font-medium">{order.address}</div>
                        <div className="text-sm text-muted-foreground">United States</div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">Shipping Method</div>
                        <div className="font-medium">Standard Shipping</div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">Tracking Number</div>
                        <div className="font-medium">TRK-{order.id.substring(4)}-123</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">Estimated Delivery</div>
                        <div className="font-medium">
                          {order.status === "Completed"
                            ? "Delivered"
                            : order.status === "In Progress"
                              ? "3-5 business days"
                              : "Pending"}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">Shipping Carrier</div>
                        <div className="font-medium">FedEx</div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">Shipping Cost</div>
                        <div className="font-medium">$10.00</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <div className="text-sm font-medium mb-4">Shipping Status</div>
                    <div className="relative">
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                      <div className="space-y-8">
                        <ShippingStep
                          title="Order Placed"
                          description="Your order has been placed"
                          date="Apr 12, 2023"
                          time="10:30 AM"
                          completed={true}
                        />
                        <ShippingStep
                          title="Processing"
                          description="Your order is being processed"
                          date="Apr 12, 2023"
                          time="2:45 PM"
                          completed={order.status !== "Pending"}
                        />
                        <ShippingStep
                          title="Shipped"
                          description="Your order has been shipped"
                          date="Apr 13, 2023"
                          time="9:15 AM"
                          completed={order.status === "Completed" || order.status === "In Progress"}
                        />
                        <ShippingStep
                          title="Delivered"
                          description="Your order has been delivered"
                          date="Apr 15, 2023"
                          time="2:30 PM"
                          completed={order.status === "Completed"}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Order History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  <div className="space-y-6">
                    <HistoryItem
                      title="Order Placed"
                      description="Order #CMS001 was placed"
                      date="Apr 12, 2023"
                      time="10:30 AM"
                    />
                    <HistoryItem
                      title="Payment Confirmed"
                      description="Payment of $142.00 was confirmed"
                      date="Apr 12, 2023"
                      time="10:35 AM"
                    />
                    <HistoryItem
                      title="Order Processing"
                      description="Your order is being processed"
                      date="Apr 12, 2023"
                      time="2:45 PM"
                    />
                    {order.status !== "Pending" && (
                      <HistoryItem
                        title="Order Shipped"
                        description="Your order has been shipped via FedEx"
                        date="Apr 13, 2023"
                        time="9:15 AM"
                      />
                    )}
                    {order.status === "Completed" && (
                      <HistoryItem
                        title="Order Delivered"
                        description="Your order has been delivered"
                        date="Apr 15, 2023"
                        time="2:30 PM"
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {order.status === "Pending" && (
            <Button>
              Process Order
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
          {order.status === "In Progress" && (
            <Button>
              Mark as Shipped
              <Truck className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function StatusBadge({ status }) {
  const statusStyles = {
    "In Progress": "bg-blue-50 text-blue-600 border-blue-200",
    Completed: "bg-emerald-50 text-emerald-600 border-emerald-200",
    Pending: "bg-amber-50 text-amber-600 border-amber-200",
    Canceled: "bg-orange-50 text-orange-600 border-orange-200",
    Rejected: "bg-rose-50 text-rose-600 border-rose-200",
    "Active Buying": "bg-rose-50 text-rose-600 border-rose-200",
    "Not Active": "bg-gray-50 text-gray-600 border-gray-200",
  }

  return (
    <Badge variant="outline" className={`${statusStyles[status] || ""} font-normal`}>
      {status === "In Progress" && <span className="mr-1">•</span>}
      {status === "Completed" && <span className="mr-1 text-emerald-500">+</span>}
      {status === "Pending" && <span className="mr-1 text-amber-500">+</span>}
      {status === "Canceled" && <span className="mr-1 text-orange-500">-</span>}
      {status === "Rejected" && <span className="mr-1 text-rose-500">-</span>}
      {status === "Active Buying" && <span className="mr-1 text-rose-500">•</span>}
      {status}
    </Badge>
  )
}

function ShippingStep({ title, description, date, time, completed }) {
  return (
    <div className="relative pl-10">
      <div
        className={`absolute left-0 top-0 h-8 w-8 rounded-full border-2 flex items-center justify-center ${
          completed ? "bg-emerald-50 border-emerald-500 text-emerald-500" : "bg-white border-gray-300 text-gray-300"
        }`}
      >
        {completed ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-check"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <Clock className="h-4 w-4" />
        )}
      </div>
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-sm text-muted-foreground">{description}</div>
        <div className="text-xs text-muted-foreground mt-1">
          {date} at {time}
        </div>
      </div>
    </div>
  )
}

function HistoryItem({ title, description, date, time }) {
  return (
    <div className="relative pl-10">
      <div className="absolute left-0 top-0 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
        <Clock className="h-4 w-4 text-gray-500" />
      </div>
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-sm text-muted-foreground">{description}</div>
        <div className="text-xs text-muted-foreground mt-1">
          {date} at {time}
        </div>
      </div>
    </div>
  )
}
