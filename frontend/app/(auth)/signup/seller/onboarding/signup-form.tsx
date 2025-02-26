"use client";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Circle, ArrowLeft, Info, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SignupFormProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    role: string;
  };
  setFormData: (data: any) => void;
  generateOTPLoading: boolean;
  otpVerified: boolean;
  onVerifyEmail: () => void;
  isSubmitting: boolean;
  onSubmit: () => void;
}

const companyRoles = [
  "Founder/CEO",
  "Senior - Level Management", 
  "Mid - Level Management",
  "Junior - Level",
  "Intern",
  "Sales Manager", 
  "Export Manager",
  "Other"
];

export function SignupForm({
  formData,
  setFormData,
  generateOTPLoading,
  otpVerified,
  onVerifyEmail,
  isSubmitting,
  onSubmit
}: SignupFormProps) {
  const router = useRouter();

  const isPasswordValid = {
    hasMinLength: formData.password.length >= 12,
    hasNumber: /\d/.test(formData.password),
    hasCapital: /[A-Z]/.test(formData.password)
  };

  const isFormValid = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    return (
      formData.firstName.trim() !== "" &&
      formData.lastName.trim() !== "" &&
      emailRegex.test(formData.email) &&
      phoneRegex.test(formData.phone) &&
      Object.values(isPasswordValid).every(Boolean) &&
      formData.password === formData.confirmPassword &&
      formData.role !== "" &&
      otpVerified
    );
  };



  return (
    <div className="space-y-8">
      <div className="text-start space-y-2">
        <h1 className="text-2xl font-bold">Create Your Account</h1>
        <p className="text-muted-foreground">
          Fill in your details to create your account and get started with Kollabee.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>
              First Name<span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="Enter your First Name"
              value={formData.firstName }
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>
              Password<span className="text-destructive">*</span>
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Create your Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <div className=" text-xs text-muted-foreground flex flex-row justify-between">
              <div
                className={`flex items-center gap-2 ${
                  isPasswordValid.hasMinLength ? "text-green-500" : ""
                }`}
              >
                <Circle
                  className={`w-1.5 h-1.5 ${
                    isPasswordValid.hasMinLength ? "fill-green-500" : "fill-current"
                  }`}
                />
                Min. 12 Characters
              </div>
              <div
                className={`flex items-center gap-2 ${
                  isPasswordValid.hasNumber ? "text-green-500" : ""
                }`}
              >
                <Circle
                  className={`w-1.5 h-1.5 ${
                    isPasswordValid.hasNumber ? "fill-green-500" : "fill-current"
                  }`}
                />
                Contains a number
              </div>
              <div
                className={`flex items-center gap-2 ${
                  isPasswordValid.hasCapital ? "text-green-500" : ""
                }`}
              >
                <Circle
                  className={`w-1.5 h-1.5 ${
                    isPasswordValid.hasCapital ? "fill-green-500" : "fill-current"
                  }`}
                />
                Contains a capital letter
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              Business Email<span className="text-destructive">*</span>
              <Info className="h-3.5 w-3.5 text-muted-foreground" />
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="Enter your Business Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={otpVerified}
                className={`relative`}
              />
              <Button 
                onClick={onVerifyEmail}
                disabled={!formData.email || generateOTPLoading || otpVerified}
                variant={otpVerified ? "outline" : "default"}
                className={`absolute right-0 top-0 h-6 w-20 mt-[6px] mr-2 ${
                  otpVerified 
                    ? " border border-[#9e1171]  bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-yellow-500 hover:from-red-600 hover:to-yellow-600"
                    : " border border-[#9e1171]  bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-yellow-500 hover:from-red-600 hover:to-yellow-600"
                }`}
              >
                {otpVerified ? "Verified" : generateOTPLoading ? "Sending..." : "Verify"}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>
              Describe your Role within the Company<span className="text-destructive">*</span>
            </Label>
            <div className="flex flex-wrap gap-2">
              {companyRoles.map((role) => (
                <Button
                  key={role}
                  variant={formData.role === role ? "default" : "outline"}
                  className={`h-8 text-xs justify-start px-2 w-fit rounded-[6px] border ${formData.role === role ? "border-[#9e1171] bg-clip-text text-transparent bg-gradient-to-r from-[#9e1171] to-[#f0b168]" : "border-[#e5e5e5]"}`}
                  onClick={() => setFormData({ ...formData, role: role })}
                >
                  {role}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-4">
        
          
          </div>
        </div>

        <div className="space-y-4">
        <div className="space-y-2">
            <Label>
              Last Name<span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="Enter your Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
          </div>
          <div className="space-y-2 ">
              <Label>
                Confirm Password<span className="text-destructive">*</span>
              </Label>
              <Input
                type="password"
                placeholder="Re-enter your Password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>
          <div className="space-y-2 ">
            <Label>
              Phone Number<span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="Enter your Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

        
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="ghost" className="text-primary -ml-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          className="rounded-[6px] text-white px-8 py-2  bg-gradient-to-r from-[#9e1171] to-[#f0b168]"
          onClick={onSubmit}
          disabled={isSubmitting || !isFormValid()}
        >
          {isSubmitting ? "Creating Account..." : "Continue"}
        </Button>
      </div>
    </div>
  );
}
