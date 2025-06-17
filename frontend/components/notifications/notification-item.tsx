"use client";

import React from "react";
import { Notification } from "@/types/api";
import { Bell, Package, MessageSquare, FileText, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (notificationId: string) => void;
  markingAsRead?: string | null;
  compact?: boolean;
}

export default function NotificationItem({
  notification,
  onMarkAsRead,
  markingAsRead,
  compact = false
}: NotificationItemProps) {
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

  const getNotificationTypeLabel = (type: Notification['type']) => {
    switch (type) {
      case 'ORDER':
        return 'Order';
      case 'REQUEST':
        return 'Request';
      case 'MESSAGE':
        return 'Message';
      case 'PROJECT_REQUEST':
        return 'Project Request';
      default:
        return 'System';
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

  const handleMarkAsRead = () => {
    if (onMarkAsRead && !notification.read) {
      onMarkAsRead(notification.id);
    }
  };

  // Handle both old and new notification formats
  const notificationTitle = (notification as any).title || notification.message;
  const notificationMessage = (notification as any).title ? notification.message : notification.message;

  if (compact) {
    return (
      <div
        className={`flex items-start gap-3 p-2 rounded-lg ${
          !notification.read ? 'bg-blue-50' : ''
        }`}
      >
        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-100">
          {getNotificationIcon(notification.type)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-black truncate">
            {notificationTitle}
          </p>
          <span className="text-xs text-gray-500 block mt-0.5">
            {formatTime(notification.createdAt)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-4 hover:bg-gray-50 transition-colors ${
        !notification.read ? 'bg-blue-50' : ''
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
          {getNotificationIcon(notification.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className={`text-sm ${!notification.read ? 'font-semibold' : 'font-medium'} text-gray-900`}>
                {notificationTitle}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {getNotificationTypeLabel(notification.type)}
                </Badge>
                <span className="text-xs text-gray-500">
                  {formatTime(notification.createdAt)}
                </span>
              </div>
            </div>
            
            {!notification.read && onMarkAsRead && (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleMarkAsRead}
                disabled={markingAsRead === notification.id}
                className="flex-shrink-0"
              >
                {markingAsRead === notification.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 