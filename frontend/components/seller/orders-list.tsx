"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { dashboardApi } from "@/lib/api/dashboard";
import { DashboardOrder } from "@/types/api";
import { toast } from "sonner";
import { Loader2, Package, CheckCircle, Clock, Truck } from "lucide-react";
import { getUserCurrency, convertCurrency, formatCurrency } from "@/lib/utils/currency";

interface OrdersListProps {
  limit?: number;
}

const OrdersList = ({ limit = 5 }: OrdersListProps) => {
  const [orders, setOrders] = useState<DashboardOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [userCurrency, setUserCurrency] = useState<string>("USD");
  const loadingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeCurrency = async () => {
      const currency = await getUserCurrency();
      setUserCurrency(currency);
      console.log("User currency set to:", currency);
    };
    initializeCurrency();
  }, []);

  const convertOrderAmounts = async (orders: DashboardOrder[]) => {
    return Promise.all(
      orders.map(async (order) => {
        const convertedAmount = await convertCurrency(order.totalAmount, "USD", userCurrency);
        return {
          ...order,
          totalAmount: convertedAmount,
          items: await Promise.all(
            order.items.map(async (item) => ({
              ...item,
              price: await convertCurrency(item.price, "USD", userCurrency),
            }))
          ),
        };
      })
    );
  };

  const loadOrders = useCallback(async (pageNum: number, isLoadMore = false) => {
    try {
      setLoading(true);
      const response:any = await dashboardApi.getLatestOrders(pageNum, limit);
      console.log(" Raw Response:", response);
      const newOrders = response?.data ?? [];
      const hasMore = !!(response?.pagination && typeof response.pagination.hasMore === 'boolean'
        ? response.pagination.hasMore
        : false);

      // Convert currency for new orders
      const convertedOrders = await convertOrderAmounts(newOrders);
      console.log("Converted orders:", convertedOrders);

      if (isLoadMore) {
        setOrders(prev => [...prev, ...convertedOrders]);
      } else {
        setOrders(convertedOrders);
      }
      setHasMore(hasMore);
    } catch (error) {
      setHasMore(false);
      setOrders([]);
      console.error("Failed to load orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [limit, userCurrency]);

  useEffect(() => {
    loadOrders(1);
  }, [loadOrders]);

  // Infinite scroll on container scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (!loading && hasMore && scrollHeight - scrollTop <= clientHeight + 50) {
      setPage(prevPage => {
        const nextPage = prevPage + 1;
        loadOrders(nextPage, true);
        return nextPage;
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'DELIVERED':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'SHIPPED':
      case 'IN_TRANSIT':
      case 'OUT_FOR_DELIVERY':
        return <Truck className="w-4 h-4 text-blue-500" />;
      case 'PENDING':
      case 'PROCESSING':
      case 'PACKED':
        return <Clock className="w-4 h-4 text-orange-500" />;
      default:
        return <Package className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'DELIVERED':
        return 'text-green-600 bg-green-50';
      case 'SHIPPED':
      case 'IN_TRANSIT':
      case 'OUT_FOR_DELIVERY':
        return 'text-blue-600 bg-blue-50';
      case 'PENDING':
      case 'PROCESSING':
      case 'PACKED':
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  console.log("Orders to render:", orders, "Loading:", loading, "HasMore:", hasMore);
  if (orders?.length === 0 && !loading) {
    return (
      <div className="text-center py-4 text-gray-500">
        <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No orders yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto pr-1" ref={loadingRef} onScroll={handleScroll}>
      {orders.map((order) => (
        <div
          key={order.id}
          className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="bg-gray-100 p-2 rounded-lg">
            {getStatusIcon(order.status)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium text-gray-900">
                Order #{order.orderNumber}
              </p>
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                {order.status.replace('_', ' ')}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-1">
              {order.buyer.name} • {formatCurrency(order.totalAmount, userCurrency)}
            </p>
            <div className="text-xs text-gray-500">
              {order.items?.length} item{order.items?.length !== 1 ? 's' : ''} • {formatTime(order.createdAt)}
            </div>
          </div>
        </div>
      ))}
      
      {loading && (
        <div className="flex justify-center py-4">
          <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
        </div>
      )}
      
      {!hasMore && orders.length > 0 && (
        <div className="text-center py-2 text-xs text-gray-500">
          No more orders
        </div>
      )}
    </div>
  );
};

export default OrdersList; 