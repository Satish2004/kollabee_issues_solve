"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { dashboardApi } from "@/lib/api/dashboard";
import { Notification } from "@/types/api";
import { toast } from "sonner";
import { Loader2, Bell } from "lucide-react";
import NotificationItem from "@/components/notifications/notification-item";
import NotificationSkeleton from "@/components/notifications/notification-skeleton";

interface BuyerNotificationsListProps {
  limit?: number;
}

const BuyerNotificationsList = ({ limit = 5 }: BuyerNotificationsListProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [markingAsRead, setMarkingAsRead] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver>();
  const lastElementRef = useRef<HTMLDivElement>(null);

  const loadNotifications = useCallback(async (pageNum: number, isLoadMore = false) => {
    try {
      setLoading(true);
      const response: any = await dashboardApi.getBuyerNotifications(pageNum, limit);
      
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
  }, [limit]);

  useEffect(() => {
    loadNotifications(1);
  }, [loadNotifications]);

  useEffect(() => {
    if (loading) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        const nextPage = page + 1;
        setPage(nextPage);
        loadNotifications(nextPage, true);
      }
    });
    
    if (lastElementRef.current) {
      observer.current.observe(lastElementRef.current);
    }
  }, [loading, hasMore, page, loadNotifications]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      setMarkingAsRead(notificationId);
      await dashboardApi.markNotificationAsRead(notificationId);
      
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true }
            : notification
        )
      );
      
      toast.success("Notification marked as read");
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      toast.error("Failed to mark notification as read");
    } finally {
      setMarkingAsRead(null);
    }
  };

  if (loading && notifications.length === 0) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <NotificationSkeleton count={3} compact={true} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
        {notifications.map((notification, index) => (
          <div
            key={notification.id}
            ref={index === notifications.length - 1 ? lastElementRef : undefined}
          >
            <NotificationItem
              notification={notification}
              onMarkAsRead={handleMarkAsRead}
              markingAsRead={markingAsRead}
              compact={true}
            />
          </div>
        ))}
        {loading && notifications.length > 0 && (
          <div className="flex justify-center py-4">
            <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
          </div>
        )}
        {!hasMore && notifications.length > 0 && (
          <div className="text-center py-2 text-xs text-gray-500">
            No more notifications
          </div>
        )}
        {(notifications?.length ?? 0) === 0 && !loading && (
          <div className="text-center py-4 text-gray-500">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No notifications yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerNotificationsList; 