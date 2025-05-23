"use client";

import { BusinessInfoForm } from "./onboarding/business-info-form";
import { GoalsMetricsForm } from "./onboarding/goals-metrics-form";
import { OTPModal } from "./onboarding/otp-modal";
import { SignupForm } from "./onboarding/signup-form";
import { SuccessMessage } from "./onboarding/success-message";
import { ProgressStepper } from "@/components/onboarding/progress-stepper";
import { Card } from "@/components/ui/card";
import { authApi } from "@/lib/api/auth";
import type { BusinessType, CategoryEnum } from "@/types/api";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "sonner";

export default function SignupSellerPage() {
  const router = useRouter();
  const [currentStage, setCurrentStage] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "India",
    countryCode: "+91",
    password: "",
    confirmPassword: "",
    role: "",
    businessName: "",
    businessType: "",
    businessDescription: "",
    businessAddress: "",
    websiteLink: "",
    otherRole: "",
    businessTypes: [] as BusinessType[],
    businessCategories: [] as CategoryEnum[],
    selectedObjectives: [] as string[],
    selectedChallenges: [] as string[],
    selectedMetrics: [] as string[],
    agreement1: false,
    agreement2: false,
  });

  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [generateOTPLoading, setGenerateOTPLoading] = useState(false);
  const [verifyOTPLoading, setVerifyOTPLoading] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [checkboxConfirmed, setCheckboxConfirmed] = useState(false);

  // useEffect(() => {
  //   const savedData = localStorage.getItem("sellerSignupData");
  //   if (savedData) {
  //     setFormData(JSON.parse(savedData));
  //   }
  // }, []);

  // useEffect(() => {
  //   localStorage.setItem("sellerSignupData", JSON.stringify(formData));
  // }, [formData]);

  const steps = [
    {
      number: "01",
      label: "Create Account",
      isActive: currentStage === 1,
      isCompleted: currentStage > 1,
    },
    {
      number: "02",
      label: "Business Information",
      isActive: currentStage === 2,
      isCompleted: currentStage > 2,
    },
    {
      number: "03",
      label: "Goals and Metrics",
      isActive: currentStage === 3,
      isCompleted: currentStage > 3,
    },
  ];

  const handleVerifyEmail = async () => {
    if (otpVerified) {
      toast.error("Email already verified");
      return;
    }
    setGenerateOTPLoading(true);
    try {
      setCountdown(35);
      setShowOTP(true);
      await authApi.generateOTP(formData.email);
      setIsResendDisabled(true);
    } catch (error: any) {
      console.error("Error generating OTP:", error);
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setGenerateOTPLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError("");

    if (value !== "" && index < 5) {
      const nextInput = document.querySelector(
        `input[name=otp-${index + 1}]`
      ) as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.querySelector(
        `input[name=otp-${index - 1}]`
      ) as HTMLInputElement;
      if (prevInput) prevInput.focus();
    }
  };

  const handleOTPVerify = async () => {
    setVerifyOTPLoading(true);
    try {
      const otpString = otp.join("");
      await authApi.verifyOTP({ email: formData.email, otp: otpString });
      toast.success("Email verified successfully");
      setOtpVerified(true);
      setShowOTP(false);
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      setOtpError(error.response?.data?.message || "Invalid OTP");
    } finally {
      setVerifyOTPLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setOtp(Array(6).fill(""));
    setCountdown(30);
    setIsResendDisabled(true);
    setOtpError("");
    try {
      await authApi.generateOTP(formData.email);
      toast.success("OTP sent again");
    } catch (error: any) {
      console.error("Error resending OTP:", error);
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    }
  };

  const handleSubmit = async () => {
    setSubmitLoading(true);
    try {
      const response = await authApi.signup({
        // User details
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        name: formData.firstName + " " + formData.lastName,
        role: "SELLER",
        phoneNumber: formData.phone,
        country: formData.country,
        countryCode: formData.countryCode,

        // Company details
        companyName: formData.businessName,
        companyWebsite: formData.websiteLink,
        address: formData.businessAddress,

        // Seller profile
        businessName: formData.businessName,
        businessDescription: formData.businessDescription,
        businessAddress: formData.businessAddress,
        websiteLink: formData.websiteLink,
        businessTypes: formData.businessTypes,
        businessCategories: formData.businessCategories,
        roleInCompany:
          formData.role === "other" ? formData.otherRole : formData.role,
        selectedObjectives: formData.selectedObjectives,
        selectedChallenges: formData.selectedChallenges,
        selectedMetrics: formData.selectedMetrics,
        agreement1: formData.agreement1,
        agreement2: formData.agreement2,
      });

      if (response?.error) {
        toast.error(response?.error);
        return;
      }
      toast.success(response?.message);
      router.push("/seller");

      // Token is automatically set by authApi.signup
      toast.success("Account created successfully!");
    } catch (error: any) {
      console.error("Error creating account:", error);
      toast.error("Failed to create account" + response?.error);
    } finally {
      setSubmitLoading(false);
    }
  };

  const validateStage1 = () => {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      confirmPassword,
      role,
    } = formData;
    if (!firstName || !lastName || !email || !phone || !password || !role) {
      toast.error("Please fill all required fields and accept the terms");
      return false;
    }

    if (password !== confirmPassword) {
      toast.error("Password and confirm password do not match");
      return false;
    }

    return true;
  };

  const validateStage2 = () => {
    const {
      businessName,
      businessDescription,
      businessTypes,
      businessAddress,
      websiteLink,
      businessCategories,
    } = formData;

    let isValid = true;
    let errorMessage = "";

    if (!businessName.trim()) {
      errorMessage = "Business name is required";
      isValid = false;
    } else if (!businessDescription.trim()) {
      errorMessage = "Business description is required";
      isValid = false;
    } else if (businessTypes.length === 0) {
      errorMessage = "Please select at least one business type";
      isValid = false;
    } else if (!businessAddress.trim()) {
      errorMessage = "Business address is required";
      isValid = false;
    } else if (!websiteLink.trim()) {
      errorMessage = "Website link is required";
      isValid = false;
    } else if (businessCategories.length === 0) {
      errorMessage = "Please select at least one business category";
      isValid = false;
    }

    if (!isValid) {
      toast.error(errorMessage);
      return false;
    }

    return true;
  };

  const validateStage3 = () => {
    const {
      agreement1,
      agreement2,
      selectedMetrics,
      selectedChallenges,
      selectedObjectives,
    } = formData;
    if (
      !agreement1 ||
      !agreement2 ||
      selectedMetrics.length === 0 ||
      selectedChallenges.length === 0 ||
      selectedObjectives.length === 0
    ) {
      toast.error("Please fill all required fields and accept the agreement");
      return false;
    }
    return true;
  };

  const handleNextStage = () => {
    if (currentStage === 1 && validateStage1()) {
      setCurrentStage(2);
    } else if (currentStage === 2 && validateStage2()) {
      setCurrentStage(3);
    } else if (currentStage === 3 && validateStage3()) {
      handleSubmit();
    }
  };

  const handlePreviousStage = () => {
    if (currentStage > 1) {
      setCurrentStage(currentStage - 1);
    }
  };

  const handleSignup = async (formData: FormData) => {
    try {
      const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        name: formData.get("name") as string,
        role: "SELLER" as const,
      };

      await authApi.signup(data);
      router.push("/seller/onboarding");
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  // Add this after the other useEffect hooks
  useEffect(() => {
    // Reset any validation errors when form data changes
    if (currentStage === 2) {
      const businessInfoForm = document.getElementById("business-info-form");
      if (businessInfoForm) {
        // This will trigger a re-render of the BusinessInfoForm component
        businessInfoForm.dispatchEvent(
          new Event("reset-validation", { bubbles: true })
        );
      }
    }
  }, [formData, currentStage]);

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
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-50 to-orange-50 p-4 md:p-10">
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
              {/* <div className="flex justify-end">
                <Link
                  href="#"
                  className="flex items-center gap-2 text-sm text-[#FF9900]"
                >
                  <Info className="w-4 h-4" />
                  Registration Guide
                </Link>
              </div> */}
            </div>

            <Card className="md:p-8 shadow-none border-none">
              <>
                {currentStage === 1 && (
                  <SignupForm
                    formData={formData}
                    setFormData={setFormData}
                    generateOTPLoading={generateOTPLoading}
                    otpVerified={otpVerified}
                    onVerifyEmail={handleVerifyEmail}
                    isSubmitting={submitLoading}
                    onSubmit={handleNextStage}
                  />
                )}
                {currentStage === 2 && (
                  <BusinessInfoForm
                    formData={{
                      businessName: formData.businessName || "",
                      businessDescription: formData.businessDescription || "",
                      websiteLink: formData.websiteLink || "",
                      businessAddress: formData.businessAddress || "",
                      businessTypes: formData.businessTypes || [],
                      businessCategories: formData.businessCategories || [],
                    }}
                    setFormData={(updater) => {
                      setFormData((prev) => {
                        const updated = updater({
                          businessName: prev.businessName || "",
                          businessDescription: prev.businessDescription || "",
                          websiteLink: prev.websiteLink || "",
                          businessAddress: prev.businessAddress || "",
                          businessTypes: prev.businessTypes || [],
                          businessCategories: prev.businessCategories || [],
                        });
                        return { ...prev, ...updated };
                      });
                    }}
                    onNext={handleNextStage}
                    onPrevious={handlePreviousStage}
                  />
                )}
                {currentStage === 3 && (
                  <GoalsMetricsForm
                    formData={{
                      selectedObjectives: formData.selectedObjectives,
                      selectedChallenges: formData.selectedChallenges,
                      selectedMetrics: formData.selectedMetrics,
                      agreement1: formData.agreement1,
                      agreement2: formData.agreement2,
                    }}
                    setFormData={(data) => {
                      setFormData((prev) => ({
                        ...prev,
                        selectedObjectives: data(prev).selectedObjectives,
                        selectedChallenges: data(prev).selectedChallenges,
                        selectedMetrics: data(prev).selectedMetrics,
                        agreement1: data(prev).agreement1,
                        agreement2: data(prev).agreement2,
                      }));
                    }}
                    onSubmit={handleNextStage}
                    onPrevious={handlePreviousStage}
                    isSubmitting={submitLoading}
                  />
                )}
                {currentStage === 4 && <SuccessMessage />}
              </>
            </Card>
          </div>
        </div>

        <OTPModal
          isOpen={showOTP}
          onClose={() => {
            setShowOTP(false);
            setOtp(Array(6).fill(""));
          }}
          email={formData.email}
          otp={otp}
          setOtp={setOtp}
          onOtpChange={handleOtpChange}
          onKeyDown={handleKeyDown}
          onVerify={handleOTPVerify}
          onResend={handleResendOTP}
          isResendDisabled={isResendDisabled}
          countdown={countdown}
          setCountdown={setCountdown}
          isVerifying={verifyOTPLoading}
          error={otpError}
        />
      </div>
    </ErrorBoundary>
  );
}
