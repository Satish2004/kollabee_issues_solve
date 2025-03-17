"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";

import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { Info } from "lucide-react";
import { ProgressStepper } from "@/components/onboarding/progress-stepper";
import { SignupForm } from "./onboarding/signup-form";
import { BusinessInfoForm } from "./onboarding/business-info-form";
import { GoalsMetricsForm } from "./onboarding/goals-metrics-form";
import { SuccessMessage } from "./onboarding/success-message";
import { OTPModal } from "./onboarding/otp-modal";
import { ErrorBoundary } from "react-error-boundary";
import { authApi } from "@/lib/api/auth";
import { sellerApi } from "@/lib/api/seller";
import { useRouter } from "next/navigation";
import { BusinessType, CategoryEnum } from "@/types/api";

export default function SignupSellerPage() {
  const router = useRouter();
  const [currentStage, setCurrentStage] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    countryCode: "",
    password: "",
    confirmPassword: "",
    role: "",
    businessName: "",
    businessType: "",
    businessAddress: "",
    websiteLink: "",
    businessTypes: [] as BusinessType[],
    businessCategories: [] as CategoryEnum[],
    selectedObjectives: [] as string[],
    selectedChallenges: [] as string[],
    selectedMetrics: [] as string[],
    agreement: false,
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
    console.log("API_URL", process.env.API_URL);
    setGenerateOTPLoading(true);
    try {
      console.log("authApi: ", authApi);
      await authApi.generateOTP(formData.email);
      setShowOTP(true);
      setCountdown(30);
      setIsResendDisabled(true);
      toast.success("OTP sent successfully");
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
    console.log(formData);
    try {
      const response = await authApi.signup({
        // User details
        email: formData.email,
        password: formData.password,
        name: formData.firstName + " " + formData.lastName,
        role: "SELLER",
        phoneNumber: formData.phone,

        // Company details
        companyName: formData.businessName,
        companyWebsite: formData.websiteLink,
        address: formData.businessAddress,

        // Seller profile
        businessName: formData.businessName,
        businessAddress: formData.businessAddress,
        websiteLink: formData.websiteLink,
        businessTypes: formData.businessTypes,
        businessCategories: formData.businessCategories,
        roleInCompany: formData.role,
        objectives: formData.selectedObjectives,
        challenges: formData.selectedChallenges,
        metrics: formData.selectedMetrics,
      });
      toast.success(response?.message);
      router.push("/seller");

      // Token is automatically set by authApi.signup
      toast.success("Account created successfully!");
    } catch (error: any) {
      toast.error("Failed to create account");
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
      businessTypes,
      businessAddress,
      websiteLink,
      businessCategories,
    } = formData;
    if (
      !businessName ||
      businessTypes.length === 0 ||
      !businessAddress ||
      !websiteLink ||
      businessCategories.length === 0
    ) {
      toast.error("Please fill all required fields");
      return false;
    }
    return true;
  };

  const validateStage3 = () => {
    const {
      agreement,
      selectedMetrics,
      selectedChallenges,
      selectedObjectives,
    } = formData;
    if (
      !agreement ||
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
                  src="/kollabee.jpg"
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

            <Card className="p-8 shadow-none border-none">
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
                      websiteLink: formData.websiteLink || "",
                      businessAddress: formData.businessAddress || "",
                      businessTypes: formData.businessTypes || [],
                      businessCategories: formData.businessCategories || [],
                    }}
                    setFormData={(updater) => {
                      setFormData((prev) => {
                        const updated = updater({
                          businessName: prev.businessName || "",
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
                      agreement: formData.agreement,
                    }}
                    setFormData={(data) => {
                      setFormData((prev) => ({
                        ...prev,
                        selectedObjectives: data(prev).selectedObjectives,
                        selectedChallenges: data(prev).selectedChallenges,
                        selectedMetrics: data(prev).selectedMetrics,
                        agreement: data(prev).agreement,
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
          onClose={() => setShowOTP(false)}
          email={formData.email}
          otp={otp}
          onOtpChange={handleOtpChange}
          onKeyDown={handleKeyDown}
          onVerify={handleOTPVerify}
          onResend={handleResendOTP}
          isResendDisabled={isResendDisabled}
          countdown={countdown}
          isVerifying={verifyOTPLoading}
          error={otpError}
        />
      </div>
    </ErrorBoundary>
  );
}
