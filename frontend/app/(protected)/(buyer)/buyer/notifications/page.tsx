"use client";

import React, { useState, useEffect, useCallback } from "react";
import { dashboardApi } from "@/lib/api/dashboard";
import { Notification } from "@/types/api";
import { toast } from "sonner";
import {
  Bell,
  Package,
  MessageSquare,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import NotificationSkeleton from "@/components/notifications/notification-skeleton";

function formatDateTime(dateString: string) {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
  return date.toLocaleString("en-US", options);
}

function groupByDate(notifications: Notification[]) {
  const grouped: { [key: string]: Notification[] } = {};
  
  notifications.forEach(notification => {
    const date = new Date(notification.createdAt);
    const dateKey = date.toDateString();
    
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(notification);
  });
  
  return grouped;
}

export default function BuyerNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<string>("all");
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  const loadNotifications = useCallback(async (pageNum: number, isLoadMore = false) => {
    try {
      setLoading(true);
      const response: any = await dashboardApi.getBuyerNotifications(pageNum, 10, filter);
      
      // Handle both old and new API response structures
      let newNotifications = [];
      let totalPages = 1;
      let currentPage = 1;
      
      if (response?.notifications) {
        // New API structure
        newNotifications = response.notifications;
        totalPages = response.totalPages ?? 1;
        currentPage = response.currentPage ?? 1;
      } else if (response?.data) {
        // Old API structure
        newNotifications = response.data;
        totalPages = response.pagination?.totalPages ?? 1;
        currentPage = response.pagination?.currentPage ?? 1;
      }
      
      if (isLoadMore) {
        setNotifications(prev => {
          const existingIds = new Set(prev.map(n => n.id));
          const uniqueNewNotifications = newNotifications.filter((n: Notification) => !existingIds.has(n.id));
          return [...prev, ...uniqueNewNotifications];
        });
      } else {
        setNotifications(newNotifications);
      }
      
      setHasMore(currentPage < totalPages);
      if (!isLoadMore) {
        setPage(1);
      }
    } catch (error) {
      console.error("Failed to load notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadNotifications(1);
  }, [loadNotifications]);

  const handleFilterChange = async (newFilter: string) => {
    setIsFilterLoading(true);
    setFilter(newFilter);
    setPage(1);
    try {
      const response: any = await dashboardApi.getBuyerNotifications(1, 10, newFilter);
      
      // Handle both old and new API response structures
      let newNotifications = [];
      let totalPages = 1;
      let currentPage = 1;
      
      if (response?.notifications) {
        // New API structure
        newNotifications = response.notifications;
        totalPages = response.totalPages ?? 1;
        currentPage = response.currentPage ?? 1;
      } else if (response?.data) {
        // Old API structure
        newNotifications = response.data;
        totalPages = response.pagination?.totalPages ?? 1;
        currentPage = response.pagination?.currentPage ?? 1;
      }
      
      setNotifications(newNotifications);
      setHasMore(currentPage < totalPages);
    } catch (error) {
      console.error("Failed to filter notifications:", error);
      toast.error("Failed to filter notifications");
    } finally {
      setIsFilterLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadNotifications(nextPage, true);
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'ORDER':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'REQUEST':
        return <FileText className="w-5 h-5 text-orange-500" />;
      case 'MESSAGE':
        return <MessageSquare className="w-5 h-5 text-green-500" />;
      case 'PROJECT_REQUEST':
        return <FileText className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationTypeBadge = (type: Notification['type']) => {
    switch (type) {
      case 'ORDER':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Order</span>;
      case 'REQUEST':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">Request</span>;
      case 'MESSAGE':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Message</span>;
      case 'PROJECT_REQUEST':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Project Request</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Notification</span>;
    }
  };

  // Only filter, no search
  const filteredNotifications = notifications.filter(notification => {
    return filter === "all" || notification.type === filter;
  });

  // Group notifications by date
  const grouped = groupByDate(filteredNotifications);
  const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  if (loading && notifications.length === 0) {
    return (
      <div className="w-full max-w-5xl mx-auto px-2 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 mb-6">
          <div className="flex-1 flex sm:justify-start justify-between gap-3">
            <div className="w-56 h-10 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <NotificationSkeleton count={5} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-6 lg:px-8 py-8">
      {/* Top bar: filter only */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 mb-6">
        <div className="flex-1 flex sm:justify-start justify-between gap-3">
          <Select value={filter} onValueChange={handleFilterChange} disabled={isFilterLoading}>
            <SelectTrigger className="w-full sm:w-56 max-w-xs bg-white">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] overflow-y-auto z-50 bg-white border shadow-lg">
              <SelectItem value="all" className="hover:bg-gray-100">All Types</SelectItem>
              <SelectItem value="ORDER" className="hover:bg-gray-100">Orders</SelectItem>
              <SelectItem value="MESSAGE" className="hover:bg-gray-100">Messages</SelectItem>
              <SelectItem value="PROJECT_REQUEST" className="hover:bg-gray-100">Project Requests</SelectItem>
            </SelectContent>
          </Select>
          {isFilterLoading && (
            <div className="flex items-center">
              <svg className="w-4 h-4 animate-spin text-gray-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-8">
        {sortedDates.map(dateKey => (
          <div key={dateKey} className="mb-8">
            <div className="text-gray-400 text-xs font-semibold px-2 sm:px-4 pb-2 tracking-wide">
              {new Date(dateKey).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div className="flex flex-col gap-4">
              {grouped[dateKey].map((notification) => (
                <div
                  key={notification.id}
                  className={
                    "flex items-start gap-4 p-5 sm:p-6 rounded-2xl transition-all duration-150 border border-transparent shadow-sm bg-white hover:shadow-lg hover:bg-gray-50"
                  }
                >
                  <div className="flex flex-col items-center min-w-[44px] pt-1">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100">
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-gray-400 font-medium">
                        {formatDateTime(notification.createdAt)}
                      </span>
                      {getNotificationTypeBadge(notification.type)}
                    </div>
                    <div className="text-base text-gray-900 leading-snug">
                      <span className="font-semibold">
                        {(notification as any).title || notification.message}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Load More Button */}
        {hasMore && (
          <div className="flex justify-center pt-4">
            <Button
              onClick={handleLoadMore}
              disabled={loading}
              variant="outline"
              className="px-8"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  Loading...
                </>
              ) : (
                "Load More"
              )}
            </Button>
          </div>
        )}

        {/* Empty State */}
        {notifications.length === 0 && !loading && (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications yet</h3>
            <p className="text-gray-500">You'll see notifications here when you receive orders, messages, or other updates.</p>
          </div>
        )}
      </div>
    </div>
  );
} 