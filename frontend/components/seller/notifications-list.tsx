"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { dashboardApi } from "@/lib/api/dashboard";
import { Notification } from "@/types/api";
import { toast } from "sonner";
import { Loader2, Bell, Package, MessageSquare, FileText } from "lucide-react";

interface NotificationsListProps {
  limit?: number;
}

const NotificationsList = ({ limit = 5 }: NotificationsListProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const observer = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  const loadNotifications = useCallback(async (pageNum: number, isLoadMore = false) => {
    try {
      setLoading(true);
      const response:any = await dashboardApi.getNotifications(pageNum, limit);
      const newNotifications = response?.data ?? [];
      const pagination = response?.pagination ?? { hasMore: false };
      if (isLoadMore) {
        setNotifications(prev => [...prev, ...newNotifications]);
      } else {
        setNotifications(newNotifications);
      }
      setHasMore(!!pagination.hasMore);
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

  // Infinite scroll setup
  const lastElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => {
          const nextPage = prevPage + 1;
          loadNotifications(nextPage, true);
          return nextPage;
        });
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore, loadNotifications]);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'ORDER':
        return <Package className="w-4 h-4 text-blue-500" />;
      case 'REQUEST':
        return <FileText className="w-4 h-4 text-orange-500" />;
      case 'MESSAGE':
        return <MessageSquare className="w-4 h-4 text-green-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
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

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      {/* <h3 className="font-semibold text-lg mb-4 text-black">Notifications/Event Alerts</h3> */}
      <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
        {notifications.map((notification, index) => (
          <div
            key={notification.id}
            ref={index === notifications.length - 1 ? lastElementRef : undefined}
            className={`flex items-start gap-3 p-2 rounded-lg `}
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-100">
              {getNotificationIcon(notification.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-black truncate">
                {notification.message}
              </p>
              <span className="text-xs text-gray-500 block mt-0.5">
                {formatTime(notification.createdAt)}
              </span>
            </div>
          </div>
        ))}
        {loading && (
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

export default NotificationsList; 