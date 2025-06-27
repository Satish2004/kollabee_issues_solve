"use client";

import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  activeTab: string;
  onAction: () => void;
  projectCategory?: string | string[];
}

export function EmptyState({ activeTab, onAction, projectCategory }: EmptyStateProps) {
  const getCategoryText = () => {
    if (!projectCategory) return "project";
    if (Array.isArray(projectCategory)) {
      return projectCategory[0] || "project";
    }
    return projectCategory;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
      <h3 className="text-lg font-medium mb-2">No suppliers found</h3>
      <p className="text-gray-500 mb-4">
        {activeTab === "suggested"
          ? `No suppliers found for your ${getCategoryText()} project. Try adjusting your filters to see more results.`
          : activeTab === "saved"
          ? "You haven't saved any suppliers yet. Browse suggested suppliers and save the ones you're interested in."
          : activeTab === "requested"
          ? "You haven't sent requests to any suppliers yet. Send requests to suppliers to start collaborating."
          : "You haven't hired any suppliers yet. Send requests to suppliers and hire them once they accept."}
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
