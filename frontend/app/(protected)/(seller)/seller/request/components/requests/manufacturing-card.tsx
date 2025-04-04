"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check, XCircle } from "lucide-react";
import { countries } from "@/app/(auth)/signup/seller/onboarding/signup-form";
import type { ManufacturingRequest } from "@/types/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
  const router = useRouter();

  // Format date
  const formattedDate = new Date(request.createdAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );

  // Find the country flag
  const buyerCountry = request.buyer?.location || "India";
  const countryData = countries.find((c) => c.name === buyerCountry);
  const countryFlag = countryData?.flag || "🌍";

  return (
    <Card key={request.id} className="mb-6 overflow-hidden">
      <CardContent className="p-0">
        {/* Header with buyer info */}
        <div className="flex items-center gap-3 p-3 border-b">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            {request.buyer?.user?.imageUrl ? (
              <Image
                src={request.buyer.user.imageUrl || "/placeholder.svg"}
                alt={request.buyer.user.name || "Buyer"}
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <span className="text-rose-600 font-semibold">
                {request.buyer?.user?.name
                  ? request.buyer.user.name.charAt(0)
                  : "B"}
              </span>
            )}
          </div>
          <div>
            <div className="font-medium">
              {request.buyer?.user?.name || "Unknown Buyer"}
            </div>
            <div className="text-sm text-gray-500">
              Request submitted on {formattedDate}
            </div>
          </div>
          <div className="flex items-center gap-1 ml-auto">
            <span className="text-xl">{countryFlag}</span>
            <span className="text-gray-700">
              {buyerCountry.substring(0, 2).toUpperCase()}
            </span>
          </div>
          <Badge
            className={
              request.status === "PENDING"
                ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                : request.status === "APPROVED"
                ? "bg-green-100 text-green-800 hover:bg-green-100"
                : "bg-red-100 text-red-800 hover:bg-red-100"
            }
          >
            {request.status}
          </Badge>
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

          {/* Buyer Contact Information */}
          <BuyerContactInfo buyer={request.buyer} />

          {/* Action buttons */}
          <div className="p-4">
            {request.status === "PENDING" && (
              <div className="flex gap-3">
                <Button
                  variant="default"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => onApprove(request)}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Approve Request
                </Button>
                <Button
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                  onClick={() => onReject(request)}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Decline Request
                </Button>
              </div>
            )}

            {/* {request.status !== "PENDING" && (
              <Button variant="outline" onClick={() => router.push(`/seller/manufacturing/${request.projectId}`)}>
                View Full Details
              </Button>
            )} */}
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
  <div className="p-4 border-b">
    <h2 className="text-xl font-bold text-gray-800 mb-2">
      {project?.businessName || "Project Details"}
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      <div>
        <div className="text-sm text-gray-500">Category</div>
        <div className="font-medium">{project?.category || "N/A"}</div>
      </div>
      <div>
        <div className="text-sm text-gray-500">Product Type</div>
        <div className="font-medium">{project?.productType || "N/A"}</div>
      </div>
      <div>
        <div className="text-sm text-gray-500">Budget</div>
        <div className="font-medium">
          {project?.budget
            ? `${project.budget} ${project.pricingCurrency.toUpperCase()}`
            : "N/A"}
        </div>
      </div>
      {project?.minimumOrderQuantity && (
        <div>
          <div className="text-sm text-gray-500">Minimum Order Quantity</div>
          <div className="font-medium">{project.minimumOrderQuantity}</div>
        </div>
      )}
      {project?.selectedServices && project.selectedServices.length > 0 && (
        <div className="md:col-span-2">
          <div className="text-sm text-gray-500">Services Required</div>
          <div className="flex flex-wrap gap-2 mt-1">
            {project.selectedServices.map((service, index) => (
              <Badge key={index} variant="outline" className="capitalize">
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
    <div className="p-4 border-b">
      <h3 className="text-lg font-semibold mb-3">Product Specifications</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {project?.formulationType && (
          <div>
            <div className="text-sm text-gray-500">Formulation Type</div>
            <div className="font-medium capitalize">
              {project.formulationType}
            </div>
          </div>
        )}
        {project?.targetBenefit && (
          <div>
            <div className="text-sm text-gray-500">Target Benefit</div>
            <div className="font-medium capitalize">
              {project.targetBenefit}
            </div>
          </div>
        )}
        {project?.texturePreferences && (
          <div>
            <div className="text-sm text-gray-500">Texture</div>
            <div className="font-medium capitalize">
              {project.texturePreferences}
            </div>
          </div>
        )}
        {project?.colorPreferences && (
          <div>
            <div className="text-sm text-gray-500">Color</div>
            <div className="font-medium capitalize">
              {project.colorPreferences}
            </div>
          </div>
        )}
        {project?.fragrancePreferences && (
          <div>
            <div className="text-sm text-gray-500">Fragrance</div>
            <div className="font-medium capitalize">
              {project.fragrancePreferences.replace(/-/g, " ")}
            </div>
          </div>
        )}
        {project?.packagingType && (
          <div>
            <div className="text-sm text-gray-500">Packaging Type</div>
            <div className="font-medium capitalize">
              {project.packagingType}
            </div>
          </div>
        )}
        {project?.materialPreferences && (
          <div>
            <div className="text-sm text-gray-500">Material</div>
            <div className="font-medium capitalize">
              {project.materialPreferences}
            </div>
          </div>
        )}
        {project?.bottleSize && (
          <div>
            <div className="text-sm text-gray-500">Bottle Size</div>
            <div className="font-medium">{project.bottleSize}</div>
          </div>
        )}
        {project?.labelingNeeded && (
          <div>
            <div className="text-sm text-gray-500">Labeling Needed</div>
            <div className="font-medium capitalize">
              {project.labelingNeeded}
            </div>
          </div>
        )}
        {project?.certificationsRequired && (
          <div>
            <div className="text-sm text-gray-500">Certifications Required</div>
            <div className="font-medium capitalize">
              {project.certificationsRequired}
            </div>
          </div>
        )}
        {project?.sampleRequirements && (
          <div>
            <div className="text-sm text-gray-500">Sample Requirements</div>
            <div className="font-medium capitalize">
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
    <div className="p-4 border-b">
      <h3 className="text-lg font-semibold mb-3">Project Timeline</h3>
      <div className="flex flex-wrap gap-3">
        {timeline.map((date, index) => (
          <div key={index} className="bg-gray-100 px-3 py-1 rounded-md text-sm">
            {new Date(date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
        ))}
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
    <div className="p-4 border-b">
      <h3 className="text-lg font-semibold mb-3">Project Milestones</h3>
      {milestones && milestones.length > 0 ? (
        <div className="space-y-4">
          {milestones.map((milestone) => (
            <div key={milestone.id} className="border rounded-lg p-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{milestone.name}</h4>
                  <p className="text-sm text-gray-600">
                    {milestone.description}
                  </p>
                </div>
                <Badge variant="outline" className="ml-2">
                  {milestone.paymentPercentage}%
                </Badge>
              </div>
              <div className="text-sm text-gray-500 mt-2">
                Due: {new Date(milestone.dueDate).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">
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
  <div className="p-4 border-b">
    <h3 className="text-lg font-semibold mb-3">Buyer Contact Information</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <div className="text-sm text-gray-500">Name</div>
        <div className="font-medium">{buyer?.user?.name || "N/A"}</div>
      </div>
      <div>
        <div className="text-sm text-gray-500">Email</div>
        <div className="font-medium">{buyer?.user?.email || "N/A"}</div>
      </div>
      <div>
        <div className="text-sm text-gray-500">Phone</div>
        <div className="font-medium">{buyer?.user?.phoneNumber || "N/A"}</div>
      </div>
      <div>
        <div className="text-sm text-gray-500">Location</div>
        <div className="font-medium">{buyer?.location || "N/A"}</div>
      </div>
    </div>
  </div>
);
