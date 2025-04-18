import React from "react";
import { Badge } from "../ui/badge";

type StatusConfig = {
  [key: string]: {
    className: string;
    icon?: React.ReactNode;
  };
};

type StatusBadgeProps = {
  status: string;
  statusConfig?: StatusConfig;
};

export function StatusBadge({ status, statusConfig }: StatusBadgeProps) {
  // Default status styles if not provided
  const defaultStatusConfig: StatusConfig = {
    "In Progress": {
      className: "bg-blue-50 text-blue-600 border-blue-200",
      icon: <span className="mr-1">•</span>,
    },
    PENDING: {
      className: "bg-blue-50 text-blue-600 border-blue-200",
      icon: <span className="mr-1">•</span>,
    },
    Completed: {
      className: "bg-emerald-50 text-emerald-600 border-emerald-200",
      icon: <span className="mr-1 text-emerald-500">+</span>,
    },
    Pending: {
      className: "bg-amber-50 text-amber-600 border-amber-200",
      icon: <span className="mr-1 text-amber-500">+</span>,
    },
    Canceled: {
      className: "bg-orange-50 text-orange-600 border-orange-200",
      icon: <span className="mr-1 text-orange-500">-</span>,
    },
    Rejected: {
      className: "bg-rose-50 text-rose-600 border-rose-200",
      icon: <span className="mr-1 text-rose-500">-</span>,
    },
  };

  const config = statusConfig || defaultStatusConfig;
  const statusStyle = config[status] || { className: "" };

  return (
    <Badge variant="outline" className={`${statusStyle.className} font-normal`}>
      {statusStyle.icon}
      {status}
    </Badge>
  );
}
