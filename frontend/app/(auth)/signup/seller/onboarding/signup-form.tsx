"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Circle, ArrowLeft, Info, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
    role?: string;
  }>({});

  const isPasswordValid = {
    hasMinLength: formData.password.length >= 12,
    hasNumber: /\d/.test(formData.password),
    hasCapital: /[A-Z]/.test(formData.password)
  };

  const checkPasswordMatch = (confirmPassword: string) => {
    if (confirmPassword && formData.password !== confirmPassword) {
      setShowPasswordError(true);
    } else {
      setShowPasswordError(false);
    }
  };

  const validateForm = () => {
    const newErrors: any = {};
    
    // Required field validations
    const requiredFields = {
      firstName: 'First name',
      lastName: 'Last name',
      email: 'Email',
      phone: 'Phone number',
      password: 'Password',
      confirmPassword: 'Confirm password',
      role: 'Role'
    };

    // Check all required fields
    Object.entries(requiredFields).forEach(([field, label]) => {
      if (!formData[field as keyof typeof formData]?.trim()) {
        newErrors[field as keyof typeof formData] = `${label} is required`;
      }
    });

    // Additional validations if fields are not empty
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    const phoneRegex = /^\d{10}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (formData.password) {
      if (formData.password.length < 12) {
        newErrors.password = 'Password must be at least 12 characters';
      }
      if (!/\d/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one number';
      }
      if (!/[A-Z]/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one capital letter';
      }
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!otpVerified) {
      newErrors.email = 'Please verify your email';
    }

    setErrors(newErrors);
    
    // Show all errors in toast
    if (Object.keys(newErrors).length > 0) {
      toast.error('Please fill in all required fields correctly');
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit();
    }
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
              value={formData.firstName}
              onChange={(e) => {
                setFormData({ ...formData, firstName: e.target.value });
                setErrors({ ...errors, firstName: undefined });
              }}
              className={`bg-[#fcfcfc] border ${
                errors.firstName ? 'border-red-500' : 'border-[#e5e5e5]'
              } rounded-[6px] placeholder:text-[#bababb]`}
              tabIndex={1}
            />
            {errors.firstName && (
              <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>
            )}
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
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="bg-[#fcfcfc] border border-[#e5e5e5] rounded-[6px] placeholder:text-[#bababb]"
              tabIndex={3}
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
              <Info className="h-3.5 w-3.5 text-muted-foreground cursor-pointer"  />
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="Enter your Business Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={otpVerified}
                className={`relative bg-[#fcfcfc] border border-[#e5e5e5] rounded-[6px] placeholder:text-[#bababb]`}
                tabIndex={5}
              />
              <Button 
                onClick={onVerifyEmail}
                disabled={!formData.email || generateOTPLoading || otpVerified}
                variant={otpVerified ? "outline" : "default"}
                className={`absolute right-0 top-0 h-6 w-20 mt-[6px] mr-2 text-[12px] ${
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
                  className={`h-8 text-xs justify-start px-2 w-fit rounded-[6px] border ${formData.role === role ? "border-[#9e1171] border text-[#9e1171]" : "border-[#e5e5e5]"}`}
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
              onChange={(e) => {
                setFormData({ ...formData, lastName: e.target.value });
                setErrors({ ...errors, lastName: undefined });
              }}
              className={`bg-[#fcfcfc] border ${
                errors.lastName ? 'border-red-500' : 'border-[#e5e5e5]'
              } rounded-[6px] placeholder:text-[#bababb]`}
              tabIndex={2}
            />
            {errors.lastName && (
              <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>
            )}
          </div>
          <div className="space-y-2 relative">
            <Label>
              Confirm Password<span className="text-destructive">*</span>
            </Label>
            <Input
              type="password"
              placeholder="Re-enter your Password"
              value={formData.confirmPassword}
              onChange={(e) => {
                setFormData({ ...formData, confirmPassword: e.target.value });
                checkPasswordMatch(e.target.value);
                setErrors({ ...errors, confirmPassword: undefined });
              }}
              className={`bg-[#fcfcfc] border ${
                showPasswordError ? 'border-red-500' : 'border-[#e5e5e5]'
              } rounded-[6px] placeholder:text-[#bababb]`}
              tabIndex={4}
            />
            {showPasswordError && (
              <div className="absolute -bottom-6 left-0 text-xs text-red-500 bg-white px-2 py-1 rounded shadow-sm border border-red-100">
                Passwords do not match
              </div>
            )}
          </div>
          <div className="space-y-2 ">
            <Label>
              Phone Number<span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="Enter your Phone Number"
              value={formData.phone}
              onChange={(e) => {
                setFormData({ ...formData, phone: e.target.value });
                setErrors({ ...errors, phone: undefined });
              }}
              className={`bg-[#fcfcfc] border ${
                errors.phone ? 'border-red-500' : 'border-[#e5e5e5]'
              } rounded-[6px] placeholder:text-[#bababb]`}
              tabIndex={6}
            />
            {errors.phone && (
              <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
            )}
          </div>

        
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="ghost" className="text-primary -ml-4" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          className="rounded-[6px] text-white px-8 py-2 bg-gradient-to-r from-[#9e1171] to-[#f0b168] disabled:opacity-50"
          onClick={handleSubmit}
          // disabled={isSubmitting || Object.keys(errors).length > 0}
        >
          {isSubmitting ? "Creating Account..." : "Continue"}
        </Button>
      </div>
    </div>
  );
}
