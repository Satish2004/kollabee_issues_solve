// components/TimelineStatusDropdown.tsx
"use client";

import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { TimelineStatus, TimelineStatusDescriptions } from "@/types/api";
import { toast } from "sonner";
import projectApi from "@/lib/api/project";


type Props = {
    timelineId: string;
    currentStatus: TimelineStatus;
    onStatusChange: (newStatus: TimelineStatus) => void;
    disabled?: boolean;
};

export default function TimelineStatusDropdown({
    timelineId,
    currentStatus,
    onStatusChange,
    disabled = false,
}: Props) {
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest(".timeline-dropdown")) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showDropdown]);

    const handleUpdate = async (status: TimelineStatus) => {
        try {
           await projectApi.updateTimelineStatus(timelineId, status);

            onStatusChange(status);
            setShowDropdown(false);
            toast.success(`Status updated to ${status.replace("_", " ")}`);
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    return (
        <div className="relative timeline-dropdown">
            <button
                disabled={disabled}
                className="flex items-center px-3 py-1 rounded-md border text-sm font-medium bg-white hover:bg-gray-50 transition"
                onClick={() => setShowDropdown((prev) => !prev)}
            >
                {currentStatus.replace("_", " ")}
                <ChevronDown className="w-4 h-4 ml-1" />
            </button>

            {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                    {Object.values(TimelineStatus).map((status) => (
                        <button
                            key={status}
                            onClick={() => handleUpdate(status)}
                            className={`w-full text-left px-3 py-3 text-sm hover:bg-gray-50 first:rounded-t-md last:rounded-b-md border-b border-gray-100 last:border-b-0 ${currentStatus === status ? "bg-blue-50 text-blue-700" : ""
                                }`}
                        >
                            <div className="font-medium">{status.replace("_", " ")}</div>
                            <div className="text-xs text-gray-500 mt-1">
                                {TimelineStatusDescriptions[status]}
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
