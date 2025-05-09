"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type FinalReviewFormProps = {
  profileData: any;
  onSubmitForApproval: () => Promise<void>;
  isSubmitting: boolean;
  pendingSteps: string[];
};

const FinalReviewForm = ({
  profileData,
  onSubmitForApproval,
  isSubmitting,
  pendingSteps,
}: FinalReviewFormProps) => {
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!confirmSubmit) {
      setError("Please confirm that all information is correct");
      return;
    }

    if (pendingSteps.length > 0) {
      setError(
        `Please complete the following steps before submitting: ${pendingSteps.join(
          ", "
        )}`
      );
      return;
    }

    setError(null);
    await onSubmitForApproval();
  };

  const formatSocialLinks = () => {
    try {
      const links = profileData.socialMediaLinks
        ? JSON.parse(profileData.socialMediaLinks)
        : {};
      return Object.entries(links)
        .filter(([_, value]) => value)
        .map(([platform, value]) => (
          <div key={platform} className="flex items-center gap-2">
            <span className="capitalize">{platform}:</span>
            <a
              href={value as string}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline truncate"
            >
              {value as string}
            </a>
          </div>
        ));
    } catch (error) {
      return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-amber-800">Review Your Profile</h3>
            <p className="text-sm text-amber-700 mt-1">
              Please review all the information below carefully before
              submitting your profile for approval. Once submitted, your profile
              will be reviewed by our team.
            </p>
            {pendingSteps &&
              Array.isArray(pendingSteps) &&
              pendingSteps.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-red-600">
                    The following sections are incomplete:
                  </p>
                  <ul className="list-disc list-inside text-sm text-red-600 mt-1">
                    {pendingSteps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ul>
                </div>
              )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="business-overview">
            <AccordionTrigger className="text-lg font-medium">
              Business Overview
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-md">
                <div className="space-y-4">
                  {profileData.businessLogo && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Business Logo
                      </h4>
                      <div className="mt-1 w-20 h-20 border rounded-md overflow-hidden">
                        <img
                          src={profileData.businessLogo || "/placeholder.svg"}
                          alt="Business Logo"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Business Name
                    </h4>
                    <p>{profileData.businessName || "Not provided"}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Business Description
                    </h4>
                    <p>{profileData.businessDescription || "Not provided"}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Website Link
                    </h4>
                    <p>{profileData.websiteLink || "Not provided"}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Business Address
                    </h4>
                    <p>{profileData.businessAddress || "Not provided"}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Business Types
                    </h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {profileData.businessTypes?.length > 0 ? (
                        profileData.businessTypes.map((type: string) => (
                          <span
                            key={type}
                            className="inline-block bg-gray-200 px-2 py-1 rounded text-xs"
                          >
                            {type}
                          </span>
                        ))
                      ) : (
                        <p>Not provided</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Business Categories
                    </h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {profileData.businessCategories?.length > 0 ? (
                        profileData.businessCategories.map(
                          (category: string) => (
                            <span
                              key={category}
                              className="inline-block bg-gray-200 px-2 py-1 rounded text-xs"
                            >
                              {category}
                            </span>
                          )
                        )
                      ) : (
                        <p>Not provided</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Year Founded
                    </h4>
                    <p>{profileData.yearFounded || "Not provided"}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Team Size
                    </h4>
                    <p>{profileData.teamSize || "Not provided"}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Annual Revenue
                    </h4>
                    <p>{profileData.annualRevenue || "Not provided"}</p>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="capabilities-operations">
            <AccordionTrigger className="text-lg font-medium">
              Capabilities & Operations
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-md">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Services Provided
                    </h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {profileData.servicesProvided?.length > 0 ? (
                        profileData.servicesProvided.map((service: string) => (
                          <span
                            key={service}
                            className="inline-block bg-gray-200 px-2 py-1 rounded text-xs"
                          >
                            {service}
                          </span>
                        ))
                      ) : (
                        <p>Not provided</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Minimum Order Quantity (MOQ)
                    </h4>
                    <p>{profileData.minimumOrderQuantity || "Not provided"}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      MOQ Flexibility
                    </h4>
                    <p>
                      {profileData.lowMoqFlexibility
                        ? "Yes, willing to work with low MOQs"
                        : "No"}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Production Model
                    </h4>
                    <p>{profileData.productionModel || "Not provided"}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Production Countries
                    </h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {profileData.productionCountries?.length > 0 ? (
                        profileData.productionCountries.map(
                          (country: string) => (
                            <span
                              key={country}
                              className="inline-block bg-gray-200 px-2 py-1 rounded text-xs"
                            >
                              {country}
                            </span>
                          )
                        )
                      ) : (
                        <p>Not provided</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Provides Samples
                    </h4>
                    <p>{profileData.providesSamples ? "Yes" : "No"}</p>
                  </div>

                  {profileData.providesSamples && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Sample Dispatch Time
                      </h4>
                      <p>{profileData.sampleDispatchTime || "Not provided"}</p>
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Production Timeline
                    </h4>
                    <p>{profileData.productionTimeline || "Not provided"}</p>
                  </div>

                  {profileData.factoryImages?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Factory Images
                      </h4>
                      <div className="grid grid-cols-3 gap-2 mt-1">
                        {profileData.factoryImages.map(
                          (image: string, index: number) => (
                            <div
                              key={index}
                              className="h-16 border rounded-md overflow-hidden"
                            >
                              <img
                                src={image || "/placeholder.svg"}
                                alt={`Factory ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="compliance-credentials">
            <AccordionTrigger className="text-lg font-medium">
              Compliance & Credentials
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-md">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Business Registration
                    </h4>
                    <p>
                      {profileData.businessRegistration
                        ? "Uploaded"
                        : "Not uploaded"}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Certifications
                    </h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {profileData.certificationTypes?.length > 0 ? (
                        profileData.certificationTypes.map((cert: string) => (
                          <span
                            key={cert}
                            className="inline-block bg-gray-200 px-2 py-1 rounded text-xs"
                          >
                            {cert}
                          </span>
                        ))
                      ) : (
                        <p>Not provided</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Certification Documents
                    </h4>
                    <p>
                      {profileData.certifications?.length > 0
                        ? `${profileData.certifications.length} document(s) uploaded`
                        : "Not uploaded"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Notable Clients
                    </h4>
                    <p>{profileData.notableClients || "Not provided"}</p>
                  </div>

                  {profileData.clientLogos?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Client Logos
                      </h4>
                      <div className="grid grid-cols-3 gap-2 mt-1">
                        {profileData.clientLogos.map(
                          (logo: string, index: number) => (
                            <div
                              key={index}
                              className="h-16 border rounded-md overflow-hidden bg-white"
                            >
                              <img
                                src={logo || "/placeholder.svg"}
                                alt={`Client ${index + 1}`}
                                className="w-full h-full object-contain p-1"
                              />
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="brand-presence">
            <AccordionTrigger className="text-lg font-medium">
              Brand Presence
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-md">
                <div className="space-y-4">
                  {profileData.projectImages?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Project/Product Images
                      </h4>
                      <div className="grid grid-cols-3 gap-2 mt-1">
                        {profileData.projectImages.map(
                          (image: string, index: number) => (
                            <div
                              key={index}
                              className="h-16 border rounded-md overflow-hidden"
                            >
                              <img
                                src={image || "/placeholder.svg"}
                                alt={`Project ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Brand Video
                    </h4>
                    <p>
                      {profileData.brandVideo ? "Uploaded" : "Not uploaded"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Social Media Links
                    </h4>
                    <div className="mt-1">
                      {formatSocialLinks() || <p>Not provided</p>}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Additional Notes
                    </h4>
                    <p>{profileData.additionalNotes || "Not provided"}</p>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="border-t pt-6">
        <div className="flex items-start space-x-3 mb-4">
          <Checkbox
            id="confirm-submit"
            checked={confirmSubmit}
            onCheckedChange={(checked) => setConfirmSubmit(checked === true)}
          />
          <label
            htmlFor="confirm-submit"
            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I confirm that all the information provided is accurate and
            complete. I understand that this profile will be reviewed by the
            KollaBee team before being approved.
          </label>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              (pendingSteps &&
                Array.isArray(pendingSteps) &&
                pendingSteps.length > 0)
            }
            className="bg-[#a11770] text-white hover:bg-[#a11770]/70 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                Submit for Approval
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FinalReviewForm;
