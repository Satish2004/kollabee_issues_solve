"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import Image from "next/image";
import { ProgressStepper } from "@/components/onboarding/progress-stepper";
import { SignupForm } from "../seller/onboarding/signup-form";
import { AboutYouForm } from "./onboarding/AboutYouForm";
import { LookingForForm } from "./onboarding/looking-for-form";
import { SuccessMessage } from "./onboarding/success-message";
import { OTPModal } from "../seller/onboarding/otp-modal";
import { ErrorBoundary } from "react-error-boundary";
import { authApi } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
// import { ProgressStepper } from "./onboarding/ProgressStepper";

export default function SignupBuyerPage() {
  const router = useRouter();
  const [currentStage, setCurrentStage] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    countryCode: "+91",
    country: "India",
    password: "",
    confirmPassword: "",
    role: "",
    businessName: "",
    businessDescription: "",
    businessType: "", // Brand Owner, Retailer, Startup, Individual Entrepreneur, Other
    otherBusinessType: "",
    lookingFor: [] as string[], // What the buyer is looking for
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

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setIsResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const steps = [
    {
      number: "01",
      label: "Create Account",
      isActive: currentStage === 1,
      isCompleted: currentStage > 1,
    },
    {
      number: "02",
      label: "Tell Us About You",
      isActive: currentStage === 2,
      isCompleted: currentStage > 2,
    },
    {
      number: "03",
      label: "What Are You Looking For?",
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
    try {
      const response = await authApi.signup({
        // User details
        email: formData.email,
        password: formData.password,
        name: formData.firstName + " " + formData.lastName,
        role: "BUYER",
        phoneNumber: formData.phone,

        // Company details
        companyName: formData.businessName,
        businessDescription: formData.businessDescription,

        // Additional buyer details
        businessType: formData.businessType,
        otherBusinessType: formData.otherBusinessType,
        lookingFor: formData.lookingFor,
        roleInCompany: formData.role,
      });

      setCurrentStage(4); // Move to success screen
      toast.success("Account created successfully!");
    } catch (error: any) {
      console.error("Error creating account:", error);
      toast.error(error.response?.data?.message || "Failed to create account");
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
      toast.error("Please fill all required fields");
      return false;
    }

    if (password !== confirmPassword) {
      toast.error("Password and confirm password do not match");
      return false;
    }

    if (!otpVerified) {
      toast.error("Please verify your email");
      return false;
    }

    return true;
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
                <AboutYouForm
                  formData={formData}
                  setFormData={setFormData}
                  onNext={handleNextStage}
                  onPrevious={handlePreviousStage}
                />
              )}

              {currentStage === 3 && (
                <LookingForForm
                  formData={formData}
                  setFormData={setFormData}
                  onSubmit={handleNextStage}
                  onPrevious={handlePreviousStage}
                  isSubmitting={submitLoading}
                />
              )}

              {currentStage === 4 && (
                <SuccessMessage
                  userType="buyer"
                  onContinue={() => router.push("/buyer")}
                />
              )}
            </Card>
          </div>
        </div>

        <OTPModal
          isOpen={showOTP}
          onClose={() => setShowOTP(false)}
          email={formData.email}
          otp={otp}
          setOtp={setOtp}
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
