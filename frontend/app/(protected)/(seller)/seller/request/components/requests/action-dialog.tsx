"use client";

import { Factory } from "lucide-react";
import type { ManufacturingRequest } from "@/types/requests";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRequest: ManufacturingRequest | null;
  actionType: "APPROVED" | "REJECTED" | null;
  isLoading: boolean;
  onConfirm: () => void;
}

export const ActionDialog = ({
  open,
  onOpenChange,
  selectedRequest,
  actionType,
  isLoading,
  onConfirm,
}: ActionDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>
            {actionType === "APPROVED" ? "Approve Request" : "Decline Request"}
          </DialogTitle>
          <DialogDescription>
            {actionType === "APPROVED"
              ? "Are you sure you want to approve this manufacturing request? This will notify the buyer and allow them to proceed with the order."
              : "Are you sure you want to decline this manufacturing request? This action cannot be undone."}
          </DialogDescription>
        </DialogHeader>

        {selectedRequest && (
          <div className="py-2">
            <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                <Factory className="w-6 h-6 text-gray-500" />
              </div>
              <div>
                <div className="font-medium">
                  {selectedRequest.project?.businessName ||
                    "Manufacturing Project"}
                </div>
                <div className="text-sm text-gray-500">
                  {selectedRequest.project?.category} -{" "}
                  {selectedRequest.project?.productType}
                </div>
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              <div className="flex justify-between mt-2">
                <span>Budget:</span>
                <span className="font-medium">
                  {selectedRequest.project?.budget}{" "}
                  {selectedRequest.project?.pricingCurrency.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Minimum Order:</span>
                <span className="font-medium">
                  {selectedRequest.project?.minimumOrderQuantity || "N/A"}
                </span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Buyer:</span>
                <span className="font-medium">
                  {selectedRequest.buyer?.user?.name}
                </span>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant={actionType === "APPROVED" ? "default" : "destructive"}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                Processing...
              </span>
            ) : actionType === "APPROVED" ? (
              "Approve"
            ) : (
              "Decline"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
