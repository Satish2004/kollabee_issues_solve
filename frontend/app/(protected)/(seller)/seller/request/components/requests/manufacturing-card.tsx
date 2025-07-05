"use client";

import { countries } from "@/app/(auth)/signup/seller/onboarding/signup-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { OrderStatus, ProjectStatus, type ManufacturingRequest } from "@/types/api";
import { Check, ChevronDown, XCircle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { toast } from "sonner";


const getSpecialCaseCountryCode = (
  dialCode: string,
  countryName: string
): string => {
  // Handle special cases where the country code doesn't match the first two letters
  const specialCases: Record<string, string> = {
    "United Kingdom": "GB",
    "United States": "US",
    "South Korea": "KR",
    "North Korea": "KP",
    "South Africa": "ZA",
  };

  if (specialCases[countryName]) {
    return specialCases[countryName];
  }

  // For countries with dial code +1 (US, Canada, and some Caribbean nations)
  if (dialCode === "+1") {
    if (countryName === "Canada") return "CA";
    if (countryName === "United States") return "US";
    // For other +1 countries, try to derive from name
    return countryName.substring(0, 2).toUpperCase();
  }

  // Default: try to derive from country name
  return countryName.substring(0, 2).toUpperCase();
};

interface ManufacturingCardProps {
  request: ManufacturingRequest;
  onApprove: (request: ManufacturingRequest) => void;
  onReject: (request: ManufacturingRequest) => void;
}

export const ManufacturingCard = ({
  request,
  onApprove,
  onReject,
}: ManufacturingCardProps) => {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [orderData, setOrderData] = useState({
    status: request.status,
    id: request.id,
  });
  const [isLoading, setIsLoading] = useState(false);
  // const [countries, setCountries] = useState(countries);

  const handleStatusUpdate = async (newStatus: string) => {
    if (isUpdatingStatus) return;

    setIsUpdatingStatus(true);
    setShowStatusDropdown(false);

    try {
      // Simulate API call to update status
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setOrderData((prev) => ({ ...prev, status: newStatus }));
      toast.success(`Request status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update request status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      case "APPROVED":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "REJECTED":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Awaiting approval from the supplier";
      case "APPROVED":
        return "Request has been approved by the supplier";
      case "REJECTED":
        return "Request has been rejected by the supplier";
      default:
        return "Unknown status";
    }
  };


  // Format date
  const formattedDate = new Date(request.createdAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );

  // Find the country data and get proper country code
  const buyerCountry = request.buyer?.location || "India";
  const countryData = countries.find((c) => c.name === buyerCountry);
  const countryCode = countryData
    ? getSpecialCaseCountryCode(countryData.code, countryData.name)
    : "US"; // Default to US if no match

  return (
    <Card key={request.id} className="mb-4 sm:mb-6 overflow-hidden max-w-full">
      <CardContent className="p-0">
        {/* Header with buyer info */}
        <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 border-b">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-full flex items-center justify-center">
            {request.buyer?.user?.imageUrl ? (
              <Image
                src={request.buyer.user.imageUrl || "/placeholder.svg"}
                alt={request.buyer.user.name || "Buyer"}
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <span className="text-rose-600 font-semibold text-xs sm:text-base">
                {request.buyer?.user?.name
                  ? request.buyer.user.name.charAt(0)
                  : "B"}
              </span>
            )}
          </div>
          <div className="overflow-hidden">
            <div className="font-medium text-sm sm:text-base truncate">
              {request.buyer?.user?.name || "Unknown Buyer"}
            </div>
            <div className="text-xs sm:text-sm text-gray-500">
              Request submitted on {formattedDate}
            </div>
          </div>
          <div className="flex items-center gap-1 ml-auto">
            <ReactCountryFlag
              countryCode={countryCode}
              svg
              style={{
                width: "1.5em",
                height: "1.5em",
              }}
              title={buyerCountry}
            />
            <span className="text-gray-700 text-xs sm:text-sm">
              {buyerCountry.substring(0, 2).toUpperCase()}
            </span>
          </div>
          <Badge
            className={`text-xs sm:text-sm px-1.5 sm:px-2.5 py-0.5 ${request.status === "PENDING"
                ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                : request.status === "APPROVED"
                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                  : "bg-red-100 text-red-800 hover:bg-red-100"
              }`}
          >
            {request.status}
          </Badge>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1">Status</p>
          <div className="relative status-dropdown">
            <button
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              disabled={isUpdatingStatus}
              className={`flex items-center justify-between w-full px-3 py-1 rounded-md text-sm font-medium ${getStatusColor(orderData.status)} hover:opacity-80 transition-opacity`}
            >
              <span>{orderData.status.replace('_', ' ')}</span>
              <ChevronDown className="w-4 h-4 ml-1" />
            </button>

            {showStatusDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                {Object.values(ProjectStatus).map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusUpdate(status)}
                    disabled={isUpdatingStatus}
                    className={`w-full text-left px-3 py-3 text-sm hover:bg-gray-50 first:rounded-t-md last:rounded-b-md border-b border-gray-100 last:border-b-0 ${orderData.status === status ? "bg-blue-50 text-blue-700" : ""
                      }`}
                  >
                    <div className="font-medium">{status.replace('_', ' ')}</div>
                    <div className="text-xs text-gray-500 mt-1">{getStatusDescription(status)}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          {/* Project Details */}
          <ProjectDetails project={request.project} />

          {/* Product Specifications */}
          <ProductSpecifications project={request.project} />

          {/* Timeline */}
          <ProjectTimeline timeline={request.project?.projectTimeline} />

          {/* Milestones */}
          <ProjectMilestones milestones={request.project?.milestones} />

          {/* Buyer Contact Info */}
          {/* <BuyerContactInfo buyer={request.buyer} /> */}

          {/* Action buttons */}
          <div className="p-3 sm:p-4">
            {request.status === "PENDING" && (
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Button
                  variant="default"
                  className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm h-8 sm:h-10"
                  onClick={() => onApprove(request)}
                >
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Approve Request
                </Button>
                <Button
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 text-xs sm:text-sm h-8 sm:h-10"
                  onClick={() => onReject(request)}
                >
                  <XCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Decline Request
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Sub-components to keep the main component smaller
const ProjectDetails = ({
  project,
}: {
  project: ManufacturingRequest["project"];
}) => (
  <div className="p-3 sm:p-4 border-b">
    <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
      <div className="font-medium text-sm sm:text-base truncate max-w-full">
        {project?.businessName || "Project Details"}
      </div>
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-3 sm:mt-4 w-full">
      <div>
        <div className="text-xs sm:text-sm text-gray-500">Category</div>
        <div className="font-medium text-sm sm:text-base">
          {project?.category || "N/A"}
        </div>
      </div>
      <div>
        <div className="text-xs sm:text-sm text-gray-500">Product Type</div>
        <div className="font-medium text-sm sm:text-base">
          {project?.productType || "N/A"}
        </div>
      </div>
      <div>
        <div className="text-xs sm:text-sm text-gray-500">Budget</div>
        <div className="font-medium text-sm sm:text-base">
          {project?.budget
            ? `${project.budget} ${project.pricingCurrency.toUpperCase()}`
            : "N/A"}
        </div>
      </div>
      {project?.minimumOrderQuantity && (
        <div>
          <div className="text-xs sm:text-sm text-gray-500">
            Minimum Order Quantity
          </div>
          <div className="font-medium text-sm sm:text-base">
            {project.minimumOrderQuantity}
          </div>
        </div>
      )}
      {project?.selectedServices && project.selectedServices.length > 0 && (
        <div className="md:col-span-2">
          <div className="text-xs sm:text-sm text-gray-500">
            Services Required
          </div>
          <div className="flex flex-wrap gap-1 sm:gap-2 mt-1">
            {project.selectedServices.map((service, index) => (
              <Badge
                key={index}
                variant="outline"
                className="capitalize text-xs py-0 px-1.5 sm:px-2 sm:py-0.5"
              >
                {service.replace(/-/g, " ")}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

const ProductSpecifications = ({
  project,
}: {
  project: ManufacturingRequest["project"];
}) => {
  if (
    !(
      project?.formulationType ||
      project?.targetBenefit ||
      project?.texturePreferences ||
      project?.colorPreferences ||
      project?.fragrancePreferences ||
      project?.packagingType ||
      project?.materialPreferences ||
      project?.bottleSize ||
      project?.labelingNeeded ||
      project?.certificationsRequired ||
      project?.sampleRequirements
    )
  ) {
    return null;
  }

  return (
    <div className="p-3 sm:p-4 border-b">
      <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
        Product Specifications
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
        {project?.formulationType && (
          <div>
            <div className="text-xs sm:text-sm text-gray-500">
              Formulation Type
            </div>
            <div className="font-medium capitalize text-sm sm:text-base">
              {project.formulationType}
            </div>
          </div>
        )}
        {project?.targetBenefit && (
          <div>
            <div className="text-xs sm:text-sm text-gray-500">
              Target Benefit
            </div>
            <div className="font-medium capitalize text-sm sm:text-base">
              {project.targetBenefit}
            </div>
          </div>
        )}
        {project?.texturePreferences && (
          <div>
            <div className="text-xs sm:text-sm text-gray-500">Texture</div>
            <div className="font-medium capitalize text-sm sm:text-base">
              {project.texturePreferences}
            </div>
          </div>
        )}
        {project?.colorPreferences && (
          <div>
            <div className="text-xs sm:text-sm text-gray-500">Color</div>
            <div className="font-medium capitalize text-sm sm:text-base">
              {project.colorPreferences}
            </div>
          </div>
        )}
        {project?.fragrancePreferences && (
          <div>
            <div className="text-xs sm:text-sm text-gray-500">Fragrance</div>
            <div className="font-medium capitalize text-sm sm:text-base">
              {project.fragrancePreferences.replace(/-/g, " ")}
            </div>
          </div>
        )}
        {project?.packagingType && (
          <div>
            <div className="text-xs sm:text-sm text-gray-500">
              Packaging Type
            </div>
            <div className="font-medium capitalize text-sm sm:text-base">
              {project.packagingType}
            </div>
          </div>
        )}
        {project?.materialPreferences && (
          <div>
            <div className="text-xs sm:text-sm text-gray-500">Material</div>
            <div className="font-medium capitalize text-sm sm:text-base">
              {project.materialPreferences}
            </div>
          </div>
        )}
        {project?.bottleSize && (
          <div>
            <div className="text-xs sm:text-sm text-gray-500">Bottle Size</div>
            <div className="font-medium text-sm sm:text-base">
              {project.bottleSize}
            </div>
          </div>
        )}
        {project?.labelingNeeded && (
          <div>
            <div className="text-xs sm:text-sm text-gray-500">
              Labeling Needed
            </div>
            <div className="font-medium capitalize text-sm sm:text-base">
              {project.labelingNeeded}
            </div>
          </div>
        )}
        {project?.certificationsRequired && (
          <div>
            <div className="text-xs sm:text-sm text-gray-500">
              Certifications Required
            </div>
            <div className="font-medium capitalize text-sm sm:text-base">
              {project.certificationsRequired}
            </div>
          </div>
        )}
        {project?.sampleRequirements && (
          <div>
            <div className="text-xs sm:text-sm text-gray-500">
              Sample Requirements
            </div>
            <div className="font-medium capitalize text-sm sm:text-base">
              {project.sampleRequirements}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ProjectTimeline = ({ timeline }: { timeline?: string[] }) => {
  if (!timeline || timeline.length === 0) return null;

  return (
    <div className="p-3 sm:p-4 border-b">
      <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
        Project Timeline
      </h3>
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {timeline.length === 2 ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <div className="bg-gray-100 px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm">
              From:{" "}
              {new Date(timeline[0]).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
            <div className="bg-gray-100 px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm">
              To:{" "}
              {new Date(timeline[1]).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
          </div>
        ) : (
          timeline.map((date, index) => (
            <div
              key={index}
              className="bg-gray-100 px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm"
            >
              {new Date(date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const ProjectMilestones = ({
  milestones,
}: {
  milestones?: ManufacturingRequest["project"]["milestones"];
}) => {
  return (
    <div className="p-3 sm:p-4 border-b">
      <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
        Project Milestones
      </h3>
      {milestones && milestones.length > 0 ? (
        <div className="space-y-3 sm:space-y-4">
          {milestones.map((milestone) => (
            <div key={milestone.id} className="border rounded-lg p-2 sm:p-3">
              <div className="flex justify-between items-start">
                <div className="overflow-hidden">
                  <h4 className="font-medium text-sm sm:text-base truncate">
                    {milestone.name}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                    {milestone.description}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="ml-2 text-xs sm:text-sm shrink-0"
                >
                  {milestone.paymentPercentage}%
                </Badge>
              </div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                Due: {new Date(milestone.dueDate).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-xs sm:text-sm">
          No milestones have been defined for this project yet.
        </p>
      )}
    </div>
  );
};

const BuyerContactInfo = ({
  buyer,
}: {
  buyer: ManufacturingRequest["buyer"];
}) => (
  <div className="p-3 sm:p-4 border-b">
    <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
      Buyer Contact Information
    </h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
      <div>
        <div className="text-xs sm:text-sm text-gray-500">Name</div>
        <div className="font-medium text-sm sm:text-base">
          {buyer?.user?.name || "N/A"}
        </div>
      </div>

      <div>
        <div className="text-xs sm:text-sm text-gray-500">Location</div>
        <div className="font-medium text-sm sm:text-base">
          {buyer?.location || "N/A"}
        </div>
      </div>
    </div>
  </div>
);
