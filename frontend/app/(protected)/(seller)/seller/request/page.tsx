"use client";
import { useState, useEffect } from "react";
import { CheckCheck, Factory } from "lucide-react";
import { ordersApi } from "@/lib/api/orders";
import { toast } from "sonner";
import type { Order, ManufacturingRequest } from "@/types/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RequestCard } from "./components/requests/request-card";
import { ManufacturingCard } from "./components/requests/manufacturing-card";
import { ActionDialog } from "./components/requests/action-dialog";
import { LoadingSkeletons } from "./components/requests/loading-skeletons";

const KollaBeeRequests = () => {
  const [requests, setRequests] = useState<Order[]>([]);
  const [manufacturingRequests, setManufacturingRequests] = useState<
    ManufacturingRequest[]
  >([]);
  const [activeTab, setActiveTab] = useState("received");
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
      setManufacturingRequests(manufacturingResponse || []);
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
    <div className="flex min-h-screen">
      <div className="flex-1 flex flex-col">
        {/* Tabs */}
        <Tabs
          defaultValue="received"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="p-4 bg-white rounded-xl">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="received" className="flex items-center gap-2">
                <CheckCheck className="w-4 h-4" />
                Product Requests
              </TabsTrigger>
              <TabsTrigger
                value="manufacturing"
                className="flex items-center gap-2"
              >
                <Factory className="w-4 h-4" />
                Manufacturing Requests
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Request List */}
          <div className="p-4 bg-white mt-6 rounded-xl">
            <TabsContent
              value="received"
              className="mt-0 max-h-[calc(100vh-180px)] overflow-y-auto"
            >
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-4">
                  Showing all requests
                </h3>
              </div>

              {isLoading ? (
                <LoadingSkeletons />
              ) : requests.length > 0 ? (
                <div className="space-y-8">
                  {requests.map((request) => (
                    <RequestCard key={request.id} request={request} />
                  ))}
                </div>
              ) : (
                <div className="px-8 pt-20 text-center flex items-center justify-center">
                  No requests found
                </div>
              )}
            </TabsContent>

            <TabsContent
              value="manufacturing"
              className="mt-0 max-h-[calc(100vh-180px)] overflow-y-auto"
            >
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-4">
                  Manufacturing Requests
                </h3>
              </div>

              {isLoading ? (
                <LoadingSkeletons />
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
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <Factory className="w-12 h-12 text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium text-gray-700">
                    No manufacturing requests
                  </h3>
                  <p className="text-gray-500 mt-2">
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

export default KollaBeeRequests;
