"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Circle, ArrowLeft, Info } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface SignupFormProps {
  fullName: string
  setFullName: (value: string) => void
  email: string
  setEmail: (value: string) => void
  phone: string
  setPhone: (value: string) => void
  password: string
  setPassword: (value: string) => void
  confirmPassword: string
  setConfirmPassword: (value: string) => void
  role: string
  setRole: (value: string) => void
  generateOTPLoading: boolean
  otpVerified: boolean
  onVerifyEmail: () => void
  isSubmitting: boolean
  onSubmit: () => void
  checkboxConfirmed: boolean
  setCheckboxConfirmed: (value: boolean) => void
}

export function SignupForm({
  fullName,
  setFullName,
  email,
  setEmail,
  phone,
  setPhone,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  role,
  setRole,
  generateOTPLoading,
  otpVerified,
  onVerifyEmail,
  isSubmitting,
  onSubmit,
  checkboxConfirmed,
  setCheckboxConfirmed
}: SignupFormProps) {
  const router = useRouter()
  const hasMinLength = password.length >= 12
  const hasNumber = /\d/.test(password)
  const hasCapital = /[A-Z]/.test(password)

  const roles = [
    "Founder/CEO",
    "Senior - Level Management",
    "Mid - Level Management",
    "Junior - Level",
    "Intern",
    "Sales Manager",
    "Export Manager",
    "Other",
  ]

  const isFormValid = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phoneRegex = /^\d{10}$/

    return (
      fullName.trim() !== "" &&
      email.trim() !== "" &&
      emailRegex.test(email) &&
      phone.trim() !== "" &&
      phoneRegex.test(phone) &&
      password.length >= 12 &&
      /[A-Z]/.test(password) &&
      /\d/.test(password) &&
      password === confirmPassword &&
      role !== "" &&
      otpVerified === true &&
      checkboxConfirmed === true
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-start space-y-2">
        <h1 className="text-2xl font-bold">Create Your Account</h1>
        <p className="text-sm text-muted-foreground">
          Fill in your details to create your account and get started with Kollabee.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
        {/* Left Column */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">
              Full Name<span className="text-destructive">*</span>
            </Label>
            <Input
              id="fullName"
              placeholder="Enter your Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              Password<span className="text-destructive">*</span>
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Create your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="space-y-2 text-xs text-muted-foreground">
              <div
                className={`flex items-center gap-2 ${
                  hasMinLength ? "text-green-500" : ""
                }`}
              >
                <Circle
                  className={`w-1.5 h-1.5 ${
                    hasMinLength ? "fill-green-500" : "fill-current"
                  }`}
                />
                Min. 12 Characters
              </div>
              <div
                className={`flex items-center gap-2 ${
                  hasNumber ? "text-green-500" : ""
                }`}
              >
                <Circle
                  className={`w-1.5 h-1.5 ${
                    hasNumber ? "fill-green-500" : "fill-current"
                  }`}
                />
                Contains a number
              </div>
              <div
                className={`flex items-center gap-2 ${
                  hasCapital ? "text-green-500" : ""
                }`}
              >
                <Circle
                  className={`w-1.5 h-1.5 ${
                    hasCapital ? "fill-green-500" : "fill-current"
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                variant="outline"
                size="sm"
                className={`absolute right-2 top-1/2 -translate-y-1/2 text-xs py-1 px-3 ${
                  otpVerified ? "text-green-500 border border-green-500" : ""
                }`}
                onClick={onVerifyEmail}
              >
                {otpVerified ? "Verified" : generateOTPLoading ? "Verifying..." : "Verify"}
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              Phone Number<span className="text-destructive">*</span>
              <Info className="h-3.5 w-3.5 text-muted-foreground" />
            </Label>
            <div className="flex gap-2">
              <div className="w-[90px] flex-shrink-0">
                <div className="flex items-center h-10 px-3 rounded-md border border-input bg-background text-sm">
                  {/* <Image
                    src="/india-flag.png"
                    alt="India"
                    width={20}
                    height={15}
                    className="mr-2"
                  /> */}
                  <span>+91</span>
                </div>
              </div>
              <Input
                id="phone"
                type="tel"
                placeholder="1234567890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              Re-enter Password<span className="text-destructive">*</span>
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Re-enter your Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>
              Describe your Role within the Company<span className="text-destructive">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {roles.map((r) => (
                <Button
                  key={r}
                  variant={role === r ? "default" : "outline"}
                  className="h-8 text-xs justify-start px-2"
                  onClick={() => setRole(r)}
                >
                  {r}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-start space-x-2">
          <Checkbox
            id="terms"
            checked={checkboxConfirmed}
            onCheckedChange={() => setCheckboxConfirmed(!checkboxConfirmed)}
          />
          <Label htmlFor="terms" className="text-xs leading-normal">
            By creating an account, you confirm that you have read and agree to our{" "}
            <Link href="#" className="text-primary hover:underline">
              Terms and Conditions
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </Label>
        </div>

        <div className="flex items-center justify-between">
          <Button onClick={() => router.back()} variant="ghost" size="sm" className="text-primary -ml-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            className="bg-gradient-to-r from-red-500 to-yellow-500 hover:from-red-600 hover:to-yellow-600 text-white px-8"
            onClick={onSubmit}
            disabled={isSubmitting || !isFormValid()}
          >
            {isSubmitting ? "Creating Account..." : "Continue"}
            <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  )
}
