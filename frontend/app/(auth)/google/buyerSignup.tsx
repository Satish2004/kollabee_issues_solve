"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import Image from "next/image";
import { ProgressStepper } from "@/components/onboarding/progress-stepper";
import { AboutYouForm } from "../signup/buyer/onboarding/AboutYouForm";
import { LookingForForm } from "../signup/buyer/onboarding/looking-for-form";
import { SuccessMessage } from "../signup/buyer/onboarding/success-message";
import { ErrorBoundary } from "react-error-boundary";
import { authApi } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
// import { ProgressStepper } from "./onboarding/ProgressStepper";

export default function SignupBuyerPage({ token }: { token: string }) {
  const router = useRouter();
  const [currentStage, setCurrentStage] = useState(1);
  const [formData, setFormData] = useState({
    businessName: "",
    businessDescription: "",
    businessType: "", // Brand Owner, Retailer, Startup, Individual Entrepreneur, Other
    otherBusinessType: "",
    lookingFor: [] as string[], // What the buyer is looking for
    role: "",
  });

  const [submitLoading, setSubmitLoading] = useState(false);

  const steps = [
    {
      number: "01",
      label: "Tell Us About You",
      isActive: currentStage === 1,
      isCompleted: currentStage > 1,
    },
    {
      number: "02",
      label: "What Are You Looking For?",
      isActive: currentStage === 2,
      isCompleted: currentStage > 2,
    },
  ];

  const handleSubmit = async () => {
    setSubmitLoading(true);
    try {
      const response = await authApi.buyerGoogleLogin({
        // Company details
        businessName: formData.businessName,
        businessDescription: formData.businessDescription,
        businessType: formData.businessType,
        otherBusinessType: formData.otherBusinessType,
        lookingFor: formData.lookingFor,
        role: formData.role,
        token: token,
      });

      setCurrentStage(3); // Move to success screen
      toast.success("Account created successfully!");
    } catch (error: any) {
      console.error("Error creating account:", error);
      toast.error(error.response?.data?.message || "Failed to create account");
    } finally {
      setSubmitLoading(false);
    }
  };

  const validateStage2 = () => {
    const {
      businessName,
      businessDescription,
      businessType,
      otherBusinessType,
    } = formData;

    if (!businessName || !businessType || !businessDescription) {
      toast.error("Please fill all required fields");
      return false;
    }

    if (businessType === "Other" && !otherBusinessType) {
      toast.error("Please specify your business type");
      return false;
    }

    return true;
  };

  const validateStage3 = () => {
    const { lookingFor } = formData;

    if (lookingFor.length === 0) {
      toast.error("Please select at least one option");
      return false;
    }

    return true;
  };

  const handleNextStage = () => {
    if (currentStage === 1 && validateStage2()) {
      setCurrentStage(2);
    } else if (currentStage === 2 && validateStage3()) {
      handleSubmit();
    }
  };

  const handlePreviousStage = () => {
    if (currentStage > 1) {
      setCurrentStage(currentStage - 1);
    }
  };

  return (
    <ErrorBoundary
      FallbackComponent={({ error }) => (
        <div className="text-center p-4">
          <h2 className="text-2xl font-bold mb-4">
            Oops! Something went wrong.
          </h2>
          <p className="mb-4">{error.message}</p>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => window.location.reload()}
          >
            Try again
          </button>
        </div>
      )}
    >
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-50 to-orange-50 p-10">
        <div className="bg-white rounded-xl shadow-sm w-full min-h-[calc(100vh-5rem)] p-8">
          <div className="max-w-[1000px] mx-auto">
            <div className="space-y-8 mb-8">
              <div className="flex justify-center">
                <Image
                  onClick={() => router.push("/")}
                  src="https://res.cloudinary.com/dodniqtyv/image/upload/f_auto,q_auto/w0knrjcs0l7mqswxuway"
                  alt="KollaBee Logo"
                  width={160}
                  height={42}
                  className="mx-auto"
                />
              </div>
              <div className="flex justify-center">
                <ProgressStepper steps={steps} />
              </div>
            </div>

            <Card className="p-8 shadow-none border-none">
              {currentStage === 1 && (
                <AboutYouForm
                  formData={formData}
                  setFormData={setFormData}
                  onNext={handleNextStage}
                  onPrevious={handlePreviousStage}
                />
              )}

              {currentStage === 2 && (
                <LookingForForm
                  formData={formData}
                  setFormData={setFormData}
                  onSubmit={handleNextStage}
                  onPrevious={handlePreviousStage}
                  isSubmitting={submitLoading}
                />
              )}

              {currentStage === 3 && (
                <SuccessMessage
                  userType="buyer"
                  onContinue={() => router.push("/buyer")}
                />
              )}
            </Card>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
