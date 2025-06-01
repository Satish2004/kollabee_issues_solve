"use client";

import {Accordion} from "@/components/ui/accordion";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import { CheckCircle, AlertCircle, XCircle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react" ;

type FinalReviewFormProps = {
  profileData: any;
  onSubmitForApproval: () => Promise<void>;
  isSubmitting: boolean;
  pendingSteps: string[];
  approvalStatus?: {
    approvalRequested: boolean;
    approvalRequestedAt: Date | null;
    isApproved: boolean;
    message?: string;
  };
};

const FinalReviewForm = ({
  profileData,
  onSubmitForApproval,
  isSubmitting,
  pendingSteps,
  approvalStatus,
}: FinalReviewFormProps) => {
  const [confirmSubmit, setConfirmSubmit] = useState(
    approvalStatus?.approvalRequested || false
  );
  const [error, setError] = useState<string | null>(null);

  // Effect to update confirmSubmit if approvalStatus changes from parent
  useEffect(() => {
    if (approvalStatus?.approvalRequested) {
      setConfirmSubmit(true);
    }
  }, [approvalStatus?.approvalRequested]);

  const handleSubmit = async () => {
    // If already requested and not approved (e.g. pending/rejected), don't allow resubmit from this button
    if (approvalStatus?.approvalRequested && !approvalStatus?.isApproved) {
      // Or, if it's rejected, you might want a different flow / button
      // For now, this button remains disabled if requested.
      return;
    }

    if (!confirmSubmit) {
      setError("Please confirm that all information is correct.");
      return;
    }

    if (pendingSteps && pendingSteps.length > 0) {
      setError(
        `Please complete the following sections before submitting: ${pendingSteps.join(
          ", "
        )}.`
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
    } catch (e) {
      console.error("Error parsing social media links:", e);
      return (
        <p className="text-red-500 text-sm">Error displaying social links.</p>
      );
    }
  };

  const hasActiveApprovalRequest = approvalStatus?.approvalRequested === true;
  const isProfileApproved = approvalStatus?.isApproved === true;
  const isProfileRejected =
    hasActiveApprovalRequest &&
    !isProfileApproved &&
    approvalStatus?.message?.toLowerCase().includes("rejected");

  let alertBoxContent;
  let alertBoxBgColor = "bg-amber-50 border-amber-200";
  let alertBoxIcon = (
    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
  );

  if (isProfileApproved) {
    alertBoxBgColor = "bg-green-50 border-green-200";
    alertBoxIcon = (
      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
    );
    alertBoxContent = (
      <>
        <h3 className="font-medium text-green-800">Profile Approved!</h3>
        <p className="text-sm text-green-700 mt-1">
          Congratulations! Your profile has been approved.{" "}
          {approvalStatus?.message}
        </p>
      </>
    );
  } else if (isProfileRejected) {
    alertBoxBgColor = "bg-red-50 border-red-200";
    alertBoxIcon = (
      <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
    );
    alertBoxContent = (
      <>
        <h3 className="font-medium text-red-800">Approval Action Required</h3>
        <p className="text-sm text-red-700 mt-1">{approvalStatus?.message}</p>
        <p className="text-sm text-red-700 mt-1">
          Please review the feedback, update your profile accordingly, and then
          you may be able to request approval again.
        </p>
      </>
    );
  } else if (hasActiveApprovalRequest) {
    alertBoxBgColor = "bg-blue-50 border-blue-200"; // Using blue for pending
    alertBoxIcon = (
      <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
    ); // Or Loader2
    alertBoxContent = (
      <>
        <h3 className="font-medium text-blue-800">
          Profile Submitted for Review
        </h3>
        <p className="text-sm text-blue-700 mt-1">
          Your profile was submitted for approval on{" "}
          {approvalStatus?.approvalRequestedAt
            ? new Date(approvalStatus.approvalRequestedAt).toLocaleDateString()
            : "a previous date"}
          . Our team is currently reviewing it.
        </p>
        <p className="text-sm text-blue-700 mt-1">
          You will be notified once the review is complete.
        </p>
      </>
    );
  } else {
    // Default: Not requested yet
    alertBoxContent = (
      <>
        <h3 className="font-medium text-amber-800">Review Your Profile</h3>
        <p className="text-sm text-amber-700 mt-1">
          Please review all the information below carefully before submitting
          your profile for approval. Once submitted, your profile will be
          reviewed by our team.
        </p>
      </>
    );
  }

  return (
    <div className="space-y-8">
      <div className={`border rounded-md p-4 ${alertBoxBgColor}`}>
        <div className="flex items-start gap-3">
          {alertBoxIcon}
          <div>
            {alertBoxContent}
            {pendingSteps &&
              Array.isArray(pendingSteps) &&
              pendingSteps.length > 0 && (
                <div
                  className={`mt-3 pt-3 ${
                    isProfileApproved
                      ? "border-green-300"
                      : isProfileRejected
                      ? "border-red-300"
                      : hasActiveApprovalRequest
                      ? "border-blue-300"
                      : "border-amber-300"
                  } border-t`}
                >
                  <p className="text-sm font-medium text-red-600">
                    The following sections are incomplete and must be filled
                    before submission:
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
        {/* Accordion sections remain the same as your provided code */}
        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue="business-overview"
        >
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
                          src={
                            profileData.businessLogo ||
                            "/placeholder.svg?width=80&height=80&text=Logo"
                          }
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
                    <p className="whitespace-pre-wrap">
                      {profileData.businessDescription || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Website Link
                    </h4>
                    {profileData.websiteLink ? (
                      <a
                        href={profileData.websiteLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {profileData.websiteLink}
                      </a>
                    ) : (
                      <p>Not provided</p>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Business Address
                    </h4>
                    <p className="whitespace-pre-wrap">
                      {profileData.businessAddress || "Not provided"}
                    </p>
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
          {/* Other AccordionItems (Capabilities, Compliance, Brand Presence) go here, unchanged */}
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
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-1">
                        {profileData.factoryImages.map(
                          (image: string, index: number) => (
                            <div
                              key={index}
                              className="aspect-square border rounded-md overflow-hidden"
                            >
                              <img
                                src={
                                  image ||
                                  "/placeholder.svg?width=100&height=100&text=Factory" ||
                                  "/placeholder.svg"
                                }
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
                        ? "Document uploaded"
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
                    <p className="whitespace-pre-wrap">
                      {profileData.notableClients || "Not provided"}
                    </p>
                  </div>

                  {profileData.clientLogos?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Client Logos
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-1">
                        {profileData.clientLogos.map(
                          (logo: string, index: number) => (
                            <div
                              key={index}
                              className="aspect-square border rounded-md overflow-hidden bg-white"
                            >
                              <img
                                src={
                                  logo ||
                                  "/placeholder.svg?width=100&height=100&text=Client" ||
                                  "/placeholder.svg"
                                }
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
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-1">
                        {profileData.projectImages.map(
                          (image: string, index: number) => (
                            <div
                              key={index}
                              className="aspect-square border rounded-md overflow-hidden"
                            >
                              <img
                                src={
                                  image ||
                                  "/placeholder.svg?width=100&height=100&text=Project" ||
                                  "/placeholder.svg"
                                }
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
                      {profileData.brandVideo
                        ? "Link provided"
                        : "Not provided"}
                    </p>
                    {profileData.brandVideo && (
                      <a
                        href={profileData.brandVideo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm truncate block"
                      >
                        {profileData.brandVideo}
                      </a>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Social Media Links
                    </h4>
                    <div className="mt-1 space-y-1">
                      {formatSocialLinks() || <p>Not provided</p>}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Additional Notes
                    </h4>
                    <p className="whitespace-pre-wrap">
                      {profileData.additionalNotes || "Not provided"}
                    </p>
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
            checked={hasActiveApprovalRequest || confirmSubmit}
            disabled={hasActiveApprovalRequest || isProfileApproved}
            onCheckedChange={(checked) => {
              if (!hasActiveApprovalRequest && !isProfileApproved) {
                setConfirmSubmit(checked === true);
                if (
                  checked === true &&
                  error === "Please confirm that all information is correct."
                ) {
                  setError(null);
                }
              }
            }}
            aria-labelledby="confirm-submit-label"
          />
          <label
            id="confirm-submit-label"
            htmlFor="confirm-submit"
            className={`text-sm leading-none ${
              hasActiveApprovalRequest || isProfileApproved
                ? "cursor-not-allowed opacity-70"
                : "peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            }`}
          >
            I confirm that all the information provided is accurate and
            complete. I understand that this profile will be reviewed by the
            KollaBee team before being approved.
          </label>
        </div>

        {error &&
          !isProfileApproved && ( // Only show submission errors if not approved
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

        {/* Submit Button Area */}
        {/* Only show submit button if not approved AND (not requested OR rejected) */}
        {/* If rejected, you might want a different button like "Resubmit for Approval" or guide them to edit */}
        {!isProfileApproved &&
          (!hasActiveApprovalRequest || isProfileRejected) && (
            <div className="flex justify-end">
              <Button
                onClick={handleSubmit}
                disabled={
                  isSubmitting ||
                  (pendingSteps && pendingSteps.length > 0) ||
                  (!hasActiveApprovalRequest && !confirmSubmit) || // confirmSubmit only matters if not already requested
                  (hasActiveApprovalRequest && !isProfileRejected) // If requested and not rejected (i.e. pending), disable
                }
                className="bg-[#a11770] text-white hover:bg-[#a11770]/70 flex items-center gap-2 px-6 py-2.5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    {isProfileRejected
                      ? "Resubmit for Approval"
                      : "Submit for Approval"}
                  </>
                )}
              </Button>
            </div>
          )}
        {/* If profile is approved, or pending (requested but not rejected), no submit button is shown here. */}
        {/* You might want a message here if it's pending, e.g., "Your submission is pending review." */}
        {hasActiveApprovalRequest &&
          !isProfileApproved &&
          !isProfileRejected && (
            <div className="text-right text-sm text-blue-700 mt-4">
              Your profile submission is currently pending review.
            </div>
          )}
      </div>
    </div>
  );
};

export default FinalReviewForm;
