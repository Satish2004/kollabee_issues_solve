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
import TimelineStatusDropdown from "../../TimelineStatusDropdown";

const getSpecialCaseCountryCode = (
  dialCode: string,
  countryName: string
): string => {
  const specialCases: Record<string, string> = {
    "United Kingdom": "GB",
    "United States": "US",
    "South Korea": "KR",
    "North Korea": "KP",
    "South Africa": "ZA",
  };

  return specialCases[countryName] || countryName.substring(0, 2).toUpperCase();
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
  const [timelineStatus, setTimelineStatus] = useState<string>(
    request.rawData?.project?.timelineStatus || "ORDER_PLACED"
  );

  const formattedDate = new Date(request.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const buyerCountry = request.buyer?.user?.country || "India";
  const countryData = countries.find((c) => c.name === buyerCountry);
  const countryCode = countryData
    ? getSpecialCaseCountryCode(countryData.code, countryData.name)
    : "US";

  const project = request.rawData?.project;
  const buyer = request.rawData?.buyer;
  const user = buyer?.user;

  return (
    <Card className="mb-4 sm:mb-6 overflow-hidden max-w-full">
      <CardContent className="p-0">
        {/* Header with buyer info */}
        <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 border-b">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-full flex items-center justify-center">
            {user?.imageUrl ? (
              <Image
                src={user.imageUrl}
                alt={user.name || "Buyer"}
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <span className="text-rose-600 font-semibold text-xs sm:text-base">
                {user?.name?.charAt(0) || "B"}
              </span>
            )}
          </div>
          <div className="overflow-hidden">
            <div className="font-medium text-sm sm:text-base truncate">
              {user?.name || "Unknown Buyer"}
            </div>
            <div className="text-xs sm:text-sm text-gray-500">
              Request submitted on {formattedDate}
            </div>
          </div>
          <div className="flex items-center gap-1 ml-auto">
            <ReactCountryFlag
              countryCode={countryCode}
              svg
              style={{ width: "1.5em", height: "1.5em" }}
              title={buyerCountry}
            />
            <span className="text-gray-700 text-xs sm:text-sm">
              {buyerCountry.substring(0, 2).toUpperCase()}
            </span>
          </div>

          <TimelineStatusDropdown
            timelineId={request.id}
            currentStatus={timelineStatus}
            onStatusChange={(newStatus) => setTimelineStatus(newStatus)}
            disabled={request.status !== "APPROVED"}
          />

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

        {/* Main content sections */}
        <div className="flex flex-col">
          {/* Project Overview */}
          <div className="p-3 sm:p-4 border-b">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
              Project Overview
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <div className="text-xs sm:text-sm text-gray-500">Project Title</div>
                <div className="font-medium text-sm sm:text-base">
                  {project?.projectTitle || "N/A"}
                </div>
              </div>
              <div>
                <div className="text-xs sm:text-sm text-gray-500">Business Name</div>
                <div className="font-medium text-sm sm:text-base">
                  {project?.businessName || "N/A"}
                </div>
              </div>
              <div>
                <div className="text-xs sm:text-sm text-gray-500">Project Categories</div>
                <div className="flex flex-wrap gap-1">
                  {project?.projectCategoies?.map((cat, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {cat}
                    </Badge>
                  )) || "N/A"}
                </div>
              </div>
              <div>
                <div className="text-xs sm:text-sm text-gray-500">Budget</div>
                <div className="font-medium text-sm sm:text-base">
                  {project?.budget
                    ? `${project.budget} ${project.pricingCurrency}`
                    : "N/A"}
                </div>
              </div>
              <div>
                <div className="text-xs sm:text-sm text-gray-500">Quantity</div>
                <div className="font-medium text-sm sm:text-base">
                  {project?.quantity || "N/A"}
                </div>
              </div>
              <div>
                <div className="text-xs sm:text-sm text-gray-500">Supplier Location</div>
                <div className="font-medium text-sm sm:text-base">
                  {project?.supplierLocation || "N/A"}
                </div>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="p-3 sm:p-4 border-b">
            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
              Product Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
              <div>
                <div className="text-xs sm:text-sm text-gray-500">Product Type</div>
                <div className="font-medium text-sm sm:text-base">
                  {project?.productType || "N/A"}
                </div>
              </div>
              <div>
                <div className="text-xs sm:text-sm text-gray-500">Description</div>
                <div className="font-medium text-sm sm:text-base">
                  {project?.productDescription || "N/A"}
                </div>
              </div>
              <div>
                <div className="text-xs sm:text-sm text-gray-500">Has Design/Formula</div>
                <div className="font-medium text-sm sm:text-base">
                  {project?.hasDesignOrFormula || "N/A"}
                </div>
              </div>
              <div>
                <div className="text-xs sm:text-sm text-gray-500">Customization Level</div>
                <div className="font-medium text-sm sm:text-base">
                  {project?.customizationLevel || "N/A"}
                </div>
              </div>
              <div>
                <div className="text-xs sm:text-sm text-gray-500">Target Benefit</div>
                <div className="font-medium text-sm sm:text-base">
                  {project?.targetBenefit || "N/A"}
                </div>
              </div>
              <div>
                <div className="text-xs sm:text-sm text-gray-500">Formulation Type</div>
                <div className="font-medium text-sm sm:text-base">
                  {project?.formulationType || "N/A"}
                </div>
              </div>
            </div>
          </div>

          {/* Packaging Details */}
          {project?.needsPackaging === "yes" && (
            <div className="p-3 sm:p-4 border-b">
              <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
                Packaging Requirements
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
                <div>
                  <div className="text-xs sm:text-sm text-gray-500">Packaging Type</div>
                  <div className="font-medium text-sm sm:text-base">
                    {project?.packagingType || "N/A"}
                  </div>
                </div>
                <div>
                  <div className="text-xs sm:text-sm text-gray-500">Material</div>
                  <div className="font-medium text-sm sm:text-base">
                    {project?.materialPreferences || "N/A"}
                  </div>
                </div>
                <div>
                  <div className="text-xs sm:text-sm text-gray-500">Eco-Friendly</div>
                  <div className="font-medium text-sm sm:text-base">
                    {project?.ecoFriendly || "N/A"}
                  </div>
                </div>
                <div>
                  <div className="text-xs sm:text-sm text-gray-500">Needs Design</div>
                  <div className="font-medium text-sm sm:text-base">
                    {project?.needsDesign || "N/A"}
                  </div>
                </div>
                <div>
                  <div className="text-xs sm:text-sm text-gray-500">Has Packaging Design</div>
                  <div className="font-medium text-sm sm:text-base">
                    {project?.hasPackagingDesign || "N/A"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Certifications */}
          {project?.certifications && project.certifications.length > 0 && (
            <div className="p-3 sm:p-4 border-b">
              <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
                Certifications Required
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.certifications.map((cert, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Timeline */}
          {project?.projectTimeline && project.projectTimeline.length > 0 && (
            <div className="p-3 sm:p-4 border-b">
              <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
                Project Timeline
              </h3>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <div className="bg-gray-100 px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm">
                  Start: {new Date(project.projectTimeline[0]).toLocaleDateString()}
                </div>
                {project.projectTimeline[1] && (
                  <div className="bg-gray-100 px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm">
                    End: {new Date(project.projectTimeline[1]).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Buyer Contact */}
          <div className="p-3 sm:p-4 border-b">
            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
              Buyer Contact Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
              <div>
                <div className="text-xs sm:text-sm text-gray-500">Name</div>
                <div className="font-medium text-sm sm:text-base">
                  {user?.name || "N/A"}
                </div>
              </div>
              <div>
                <div className="text-xs sm:text-sm text-gray-500">Email</div>
                <div className="font-medium text-sm sm:text-base">
                  {user?.email || "N/A"}
                </div>
              </div>
              <div>
                <div className="text-xs sm:text-sm text-gray-500">Phone</div>
                <div className="font-medium text-sm sm:text-base">
                  {user?.phoneNumber || "N/A"}
                </div>
              </div>
              <div>
                <div className="text-xs sm:text-sm text-gray-500">Company</div>
                <div className="font-medium text-sm sm:text-base">
                  {user?.companyName || "N/A"}
                </div>
              </div>
              <div>
                <div className="text-xs sm:text-sm text-gray-500">Address</div>
                <div className="font-medium text-sm sm:text-base">
                  {user?.address || "N/A"}, {user?.state || "N/A"}, {user?.country || "N/A"}
                </div>
              </div>
            </div>
          </div>

          {/* Approval Buttons */}
          {request.status === "PENDING" && (
            <div className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm h-8 sm:h-10 px-3 rounded"
                  onClick={() => onApprove(request)}
                >
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 inline" />
                  Approve Request
                </Button>
                <Button
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 text-xs sm:text-sm h-8 sm:h-10 px-3 rounded"
                  onClick={() => onReject(request)}
                >
                  <XCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 inline" />
                  Decline Request
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};