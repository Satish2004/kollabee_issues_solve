"use client";

import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  activeTab: string;
  onAction: () => void;
}

export function EmptyState({ activeTab, onAction }: EmptyStateProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
      <h3 className="text-lg font-medium mb-2">No suppliers found</h3>
      <p className="text-gray-500 mb-4">
        {activeTab === "suggested"
          ? "Try adjusting your filters to see more results"
          : activeTab === "saved"
          ? "You haven't saved any suppliers yet"
          : "You haven't sent requests to any suppliers yet"}
      </p>
      <Button
        variant="outline"
        onClick={onAction}
        className="text-[#e00261] border-[#e00261] hover:bg-[#e00261] hover:text-white"
      >
        {activeTab === "suggested" ? "Clear Filters" : "Browse Suppliers"}
      </Button>
    </div>
  );
}
