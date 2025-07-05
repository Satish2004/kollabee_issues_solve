"use client";

import { ActionDialog } from "./components/requests/action-dialog";
import { LoadingSkeletons } from "./components/requests/loading-skeletons";
import { ManufacturingCard } from "./components/requests/manufacturing-card";
import { RequestCard } from "./components/requests/request-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ordersApi } from "@/lib/api/orders";
import type { Order, ManufacturingRequest } from "@/types/api";
import { CheckCheck, Factory } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect, use } from "react";
import { toast } from "sonner";

const KollaBeeRequests = () => {
  const [requests, setRequests] = useState<Order[]>([]);
  const [manufacturingRequests, setManufacturingRequests] = useState<
    ManufacturingRequest[]
  >([]);

  const router = useRouter();
  const params = useSearchParams();
  const tab = params.get("tab") || "received";

  const [activeTab, setActiveTab] = useState(
    tab === "received" ? "received" : "manufacturing"
  );

  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Dialog state
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] =
    useState<ManufacturingRequest | null>(null);
  const [actionType, setActionType] = useState<"APPROVED" | "REJECTED" | null>(
    null
  );

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const response = await ordersApi.getOrdersForSeller();
      const manufacturingResponse = await ordersApi.getManufactoringRequest();

      setRequests(response?.orders || []);
      setManufacturingRequests(manufacturingResponse);
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.error("Failed to load requests");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveOrReject = async () => {
    if (!selectedRequest || !actionType) return;

    try {
      setIsActionLoading(true);
      await ordersApi.approveOrRejectProject({
        requestId: selectedRequest.id,
        status: actionType,
      });

      toast.success(
        `Request ${
          actionType === "APPROVED" ? "approved" : "rejected"
        } successfully`
      );
      fetchRequests(); // Refresh the data
      setShowActionDialog(false);
    } catch (error) {
      console.error(`Error ${actionType.toLowerCase()}ing request:`, error);
      toast.error(`Failed to ${actionType.toLowerCase()} request`);
    } finally {
      setIsActionLoading(false);
    }
  };

  const openActionDialog = (
    request: ManufacturingRequest,
    action: "APPROVED" | "REJECTED"
  ) => {
    setSelectedRequest(request);
    setActionType(action);
    setShowActionDialog(true);
  };

  return (
    <div className="flex min-h-screen max-w-full overflow-hidden">
      <div className="flex-1 flex flex-col w-full">
        {/* Tabs */}
        <Tabs
          defaultValue="received"
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value);
            router.push(`/seller/request?tab=${value}`);
          }}
          className="w-full"
        >
          <div className="p-2 sm:p-4 bg-white rounded-xl">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger
                value="received"
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-1.5 sm:py-2"
              >
                <CheckCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="truncate">Product Requests</span>
              </TabsTrigger>
              <TabsTrigger
                value="manufacturing"
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-1.5 sm:py-2"
              >
                <Factory className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="truncate">Manufacturing Requests</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Request List */}
          <div className="p-2 sm:p-4 bg-white mt-3 sm:mt-6 rounded-xl">
            <TabsContent
              value="received"
              className="mt-0 max-h-[calc(100vh-180px)] overflow-y-auto overflow-x-hidden"
            >
              <div className="mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-4">
                  Showing all requests
                </h3>
              </div>

              {isLoading ? (
                <LoadingSkeletons type="product" count={2} />
              ) : requests.length > 0 ? (
                <div className="space-y-4 sm:space-y-8">
                  {requests.map((request) => (
                    <RequestCard key={request.id} request={request} />
                  ))}
                </div>
              ) : (
                <div className="px-4 sm:px-8 pt-10 sm:pt-20 text-center flex items-center justify-center">
                  No requests found
                </div>
              )}
            </TabsContent>

            <TabsContent
              value="manufacturing"
              className="mt-0 max-h-[calc(100vh-180px)] overflow-y-auto overflow-x-hidden"
            >
              <div className="mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-4">
                  Manufacturing Requests
                </h3>
              </div>
             
              {isLoading ? (
                <LoadingSkeletons type="manufacturing" count={1} />
              ) : manufacturingRequests.length > 0 ? (
                <div className="space-y-4">
                  {manufacturingRequests.map((request) => (
                    <ManufacturingCard
                      key={request.id}
                      request={request}
                      onApprove={(request) =>
                        openActionDialog(request, "APPROVED")
                      }
                      onReject={(request) =>
                        openActionDialog(request, "REJECTED")
                      }
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 sm:h-64 text-center p-4">
                  <Factory className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mb-3 sm:mb-4" />
                  <h3 className="text-lg sm:text-xl font-medium text-gray-700">
                    No manufacturing requests
                  </h3>
                  <p className="text-gray-500 mt-2 text-sm sm:text-base">
                    When buyers submit manufacturing requests, they will appear
                    here.
                  </p>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>

        {/* Confirmation Dialog */}
        <ActionDialog
          open={showActionDialog}
          onOpenChange={setShowActionDialog}
          selectedRequest={selectedRequest}
          actionType={actionType}
          isLoading={isActionLoading}
          onConfirm={handleApproveOrReject}
        />
      </div>
    </div>
  );
};

const SuspansePage = () => {
  return (
    <React.Suspense fallback={<LoadingSkeletons type="full" count={1} />}>
      <KollaBeeRequests />
    </React.Suspense>
  );
};
export default SuspansePage;
