import React from 'react';
import { MessageSquare, Clock, AlertTriangle } from 'lucide-react';
import type { SupplierMetrics } from './use-supplier-metrics';

interface SupplierMetricsBarProps {
  metrics: SupplierMetrics;
  loading?: boolean;
}

export default function SupplierMetricsBar({ metrics, loading = false }: SupplierMetricsBarProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="bg-gray-200 p-3 rounded-full">
                <div className="h-6 w-6"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const metricsConfig = [
    {
      key: 'unreadMessages',
      label: 'Unread Messages',
      value: metrics.unreadMessages,
      icon: MessageSquare,
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      iconColor: 'text-blue-600'
    },
    {
      key: 'awaitingReply',
      label: 'Awaiting Your Reply',
      value: metrics.awaitingReply,
      icon: Clock,
      color: 'amber',
      bgColor: 'bg-amber-100',
      textColor: 'text-amber-600',
      iconColor: 'text-amber-600'
    },
    {
      key: 'delayedReplies',
      label: 'Delayed Replies',
      value: metrics.delayedReplies,
      icon: AlertTriangle,
      color: 'red',
      bgColor: 'bg-red-100',
      textColor: 'text-red-600',
      iconColor: 'text-red-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {metricsConfig.map((metric) => {
        const Icon = metric.icon;
        return (
          <div
            key={metric.key}
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {metric.label}
                </p>
                <p className={`text-2xl font-bold ${metric.textColor}`}>
                  {metric.value}
                </p>
              </div>
              <div className={`${metric.bgColor} p-3 rounded-full`}>
                <Icon className={`h-6 w-6 ${metric.iconColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}