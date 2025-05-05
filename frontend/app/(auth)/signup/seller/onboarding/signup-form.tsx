"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Circle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import InfoButton from "../../../../../components/ui/IButton";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import ReactCountryFlag from "react-country-flag";
import {
  getCountryCode,
  getSpecialCaseCountryCode,
} from "@/components/country-utils";

interface SignupFormProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    role: string;
    countryCode: string;
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
  "Executive/Leadership",
  "Manager",
  "Team Member",
  "Intern",
  "Sales Manager",
  "Export Manager",
  "Other",
];

export const countries = [
  { code: "+93", name: "Afghanistan", flag: "🇦🇫" },
  { code: "+355", name: "Albania", flag: "🇦🇱" },
  { code: "+213", name: "Algeria", flag: "🇩🇿" },
  { code: "+376", name: "Andorra", flag: "🇦🇩" },
  { code: "+244", name: "Angola", flag: "🇦🇴" },
  { code: "+1", name: "Antigua and Barbuda", flag: "🇦🇬" },
  { code: "+54", name: "Argentina", flag: "🇦🇷" },
  { code: "+374", name: "Armenia", flag: "🇦🇲" },
  { code: "+61", name: "Australia", flag: "🇦🇺" },
  { code: "+43", name: "Austria", flag: "🇦🇹" },
  { code: "+994", name: "Azerbaijan", flag: "🇦🇿" },
  { code: "+1", name: "Bahamas", flag: "🇧🇸" },
  { code: "+973", name: "Bahrain", flag: "🇧🇭" },
  { code: "+880", name: "Bangladesh", flag: "🇧🇩" },
  { code: "+1", name: "Barbados", flag: "🇧🇧" },
  { code: "+375", name: "Belarus", flag: "🇧🇾" },
  { code: "+32", name: "Belgium", flag: "🇧🇪" },
  { code: "+501", name: "Belize", flag: "🇧🇿" },
  { code: "+229", name: "Benin", flag: "🇧🇯" },
  { code: "+975", name: "Bhutan", flag: "🇧🇹" },
  { code: "+591", name: "Bolivia", flag: "🇧🇴" },
  { code: "+387", name: "Bosnia and Herzegovina", flag: "🇧🇦" },
  { code: "+267", name: "Botswana", flag: "🇧🇼" },
  { code: "+55", name: "Brazil", flag: "🇧🇷" },
  { code: "+673", name: "Brunei", flag: "🇧🇳" },
  { code: "+359", name: "Bulgaria", flag: "🇧🇬" },
  { code: "+226", name: "Burkina Faso", flag: "🇧🇫" },
  { code: "+257", name: "Burundi", flag: "🇧🇮" },
  { code: "+855", name: "Cambodia", flag: "🇰🇭" },
  { code: "+237", name: "Cameroon", flag: "🇨🇲" },
  { code: "+1", name: "Canada", flag: "🇨🇦" },
  { code: "+238", name: "Cape Verde", flag: "🇨🇻" },
  { code: "+236", name: "Central African Republic", flag: "🇨🇫" },
  { code: "+235", name: "Chad", flag: "🇹🇩" },
  { code: "+56", name: "Chile", flag: "🇨🇱" },
  { code: "+86", name: "China", flag: "🇨🇳" },
  { code: "+57", name: "Colombia", flag: "🇨🇴" },
  { code: "+269", name: "Comoros", flag: "🇰🇲" },
  { code: "+242", name: "Congo", flag: "🇨🇬" },
  { code: "+243", name: "Congo, Democratic Republic of the", flag: "🇨🇩" },
  { code: "+506", name: "Costa Rica", flag: "🇨🇷" },
  { code: "+385", name: "Croatia", flag: "🇭🇷" },
  { code: "+53", name: "Cuba", flag: "🇨🇺" },
  { code: "+357", name: "Cyprus", flag: "🇨🇾" },
  { code: "+420", name: "Czech Republic", flag: "🇨🇿" },
  { code: "+45", name: "Denmark", flag: "🇩🇰" },
  { code: "+253", name: "Djibouti", flag: "🇩🇯" },
  { code: "+1", name: "Dominica", flag: "🇩🇲" },
  { code: "+1", name: "Dominican Republic", flag: "🇩🇴" },
  { code: "+670", name: "East Timor", flag: "🇹🇱" },
  { code: "+593", name: "Ecuador", flag: "🇪🇨" },
  { code: "+20", name: "Egypt", flag: "🇪🇬" },
  { code: "+503", name: "El Salvador", flag: "🇸🇻" },
  { code: "+240", name: "Equatorial Guinea", flag: "🇬🇶" },
  { code: "+291", name: "Eritrea", flag: "🇪🇷" },
  { code: "+372", name: "Estonia", flag: "🇪🇪" },
  { code: "+251", name: "Ethiopia", flag: "🇪🇹" },
  { code: "+679", name: "Fiji", flag: "🇫🇯" },
  { code: "+358", name: "Finland", flag: "🇫🇮" },
  { code: "+33", name: "France", flag: "🇫🇷" },
  { code: "+241", name: "Gabon", flag: "🇬🇦" },
  { code: "+220", name: "Gambia", flag: "🇬🇲" },
  { code: "+995", name: "Georgia", flag: "🇬🇪" },
  { code: "+49", name: "Germany", flag: "🇩🇪" },
  { code: "+233", name: "Ghana", flag: "🇬🇭" },
  { code: "+30", name: "Greece", flag: "🇬🇷" },
  { code: "+1", name: "Grenada", flag: "🇬🇩" },
  { code: "+502", name: "Guatemala", flag: "🇬🇹" },
  { code: "+224", name: "Guinea", flag: "🇬🇳" },
  { code: "+245", name: "Guinea-Bissau", flag: "🇬🇼" },
  { code: "+592", name: "Guyana", flag: "🇬🇾" },
  { code: "+509", name: "Haiti", flag: "🇭🇹" },
  { code: "+504", name: "Honduras", flag: "🇭🇳" },
  { code: "+36", name: "Hungary", flag: "🇭🇺" },
  { code: "+354", name: "Iceland", flag: "🇮🇸" },
  { code: "+91", name: "India", flag: "🇮🇳" },
  { code: "+62", name: "Indonesia", flag: "🇮🇩" },
  { code: "+98", name: "Iran", flag: "🇮🇷" },
  { code: "+964", name: "Iraq", flag: "🇮🇶" },
  { code: "+353", name: "Ireland", flag: "🇮🇪" },
  { code: "+972", name: "Israel", flag: "🇮🇱" },
  { code: "+39", name: "Italy", flag: "🇮🇹" },
  { code: "+1", name: "Jamaica", flag: "🇯🇲" },
  { code: "+81", name: "Japan", flag: "🇯🇵" },
  { code: "+962", name: "Jordan", flag: "🇯🇴" },
  { code: "+7", name: "Kazakhstan", flag: "🇰🇿" },
  { code: "+254", name: "Kenya", flag: "🇰🇪" },
  { code: "+686", name: "Kiribati", flag: "🇰🇮" },
  { code: "+850", name: "North Korea", flag: "🇰🇵" },
  { code: "+82", name: "South Korea", flag: "🇰🇷" },
  { code: "+965", name: "Kuwait", flag: "🇰🇼" },
  { code: "+996", name: "Kyrgyzstan", flag: "🇰🇬" },
  { code: "+856", name: "Laos", flag: "🇱🇦" },
  { code: "+371", name: "Latvia", flag: "🇱🇻" },
  { code: "+961", name: "Lebanon", flag: "🇱🇧" },
  { code: "+266", name: "Lesotho", flag: "🇱🇸" },
  { code: "+231", name: "Liberia", flag: "🇱🇷" },
  { code: "+218", name: "Libya", flag: "🇱🇾" },
  { code: "+423", name: "Liechtenstein", flag: "🇱🇮" },
  { code: "+370", name: "Lithuania", flag: "🇱🇹" },
  { code: "+352", name: "Luxembourg", flag: "🇱🇺" },
  { code: "+389", name: "North Macedonia", flag: "🇲🇰" },
  { code: "+261", name: "Madagascar", flag: "🇲🇬" },
  { code: "+265", name: "Malawi", flag: "🇲🇼" },
  { code: "+60", name: "Malaysia", flag: "🇲🇾" },
  { code: "+960", name: "Maldives", flag: "🇲🇻" },
  { code: "+223", name: "Mali", flag: "🇲🇱" },
  { code: "+356", name: "Malta", flag: "🇲🇹" },
  { code: "+692", name: "Marshall Islands", flag: "🇲🇭" },
  { code: "+222", name: "Mauritania", flag: "🇲🇷" },
  { code: "+230", name: "Mauritius", flag: "🇲🇺" },
  { code: "+52", name: "Mexico", flag: "🇲🇽" },
  { code: "+691", name: "Micronesia", flag: "🇫🇲" },
  { code: "+373", name: "Moldova", flag: "🇲🇩" },
  { code: "+377", name: "Monaco", flag: "🇲🇨" },
  { code: "+976", name: "Mongolia", flag: "🇲🇳" },
  { code: "+382", name: "Montenegro", flag: "🇲🇪" },
  { code: "+212", name: "Morocco", flag: "🇲🇦" },
  { code: "+258", name: "Mozambique", flag: "🇲🇿" },
  { code: "+95", name: "Myanmar", flag: "🇲🇲" },
  { code: "+264", name: "Namibia", flag: "🇳🇦" },
  { code: "+674", name: "Nauru", flag: "🇳🇷" },
  { code: "+977", name: "Nepal", flag: "🇳🇵" },
  { code: "+31", name: "Netherlands", flag: "🇳🇱" },
  { code: "+64", name: "New Zealand", flag: "🇳🇿" },
  { code: "+505", name: "Nicaragua", flag: "🇳🇮" },
  { code: "+227", name: "Niger", flag: "🇳🇪" },
  { code: "+234", name: "Nigeria", flag: "🇳🇬" },
  { code: "+47", name: "Norway", flag: "🇳🇴" },
  { code: "+968", name: "Oman", flag: "🇴🇲" },
  { code: "+92", name: "Pakistan", flag: "🇵🇰" },
  { code: "+680", name: "Palau", flag: "🇵🇼" },
  { code: "+970", name: "Palestine", flag: "🇵🇸" },
  { code: "+507", name: "Panama", flag: "🇵🇦" },
  { code: "+675", name: "Papua New Guinea", flag: "🇵🇬" },
  { code: "+595", name: "Paraguay", flag: "🇵🇾" },
  { code: "+51", name: "Peru", flag: "🇵🇪" },
  { code: "+63", name: "Philippines", flag: "🇵🇭" },
  { code: "+48", name: "Poland", flag: "🇵🇱" },
  { code: "+351", name: "Portugal", flag: "🇵🇹" },
  { code: "+974", name: "Qatar", flag: "🇶🇦" },
  { code: "+40", name: "Romania", flag: "🇷🇴" },
  { code: "+7", name: "Russia", flag: "🇷🇺" },
  { code: "+250", name: "Rwanda", flag: "🇷🇼" },
  { code: "+1", name: "Saint Kitts and Nevis", flag: "🇰🇳" },
  { code: "+1", name: "Saint Lucia", flag: "🇱🇨" },
  { code: "+1", name: "Saint Vincent and the Grenadines", flag: "🇻🇨" },
  { code: "+685", name: "Samoa", flag: "🇼🇸" },
  { code: "+378", name: "San Marino", flag: "🇸🇲" },
  { code: "+239", name: "Sao Tome and Principe", flag: "🇸🇹" },
  { code: "+966", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+221", name: "Senegal", flag: "🇸🇳" },
  { code: "+381", name: "Serbia", flag: "🇷🇸" },
  { code: "+248", name: "Seychelles", flag: "🇸🇨" },
  { code: "+232", name: "Sierra Leone", flag: "🇸🇱" },
  { code: "+65", name: "Singapore", flag: "🇸🇬" },
  { code: "+421", name: "Slovakia", flag: "🇸🇰" },
  { code: "+386", name: "Slovenia", flag: "🇸🇮" },
  { code: "+677", name: "Solomon Islands", flag: "🇸🇧" },
  { code: "+252", name: "Somalia", flag: "🇸🇴" },
  { code: "+27", name: "South Africa", flag: "🇿🇦" },
  { code: "+211", name: "South Sudan", flag: "🇸🇸" },
  { code: "+34", name: "Spain", flag: "🇪🇸" },
  { code: "+94", name: "Sri Lanka", flag: "🇱🇰" },
  { code: "+249", name: "Sudan", flag: "🇸🇩" },
  { code: "+597", name: "Suriname", flag: "🇸🇷" },
  { code: "+268", name: "Eswatini", flag: "🇸🇿" },
  { code: "+46", name: "Sweden", flag: "🇸🇪" },
  { code: "+41", name: "Switzerland", flag: "🇨🇭" },
  { code: "+963", name: "Syria", flag: "🇸🇾" },
  { code: "+886", name: "Taiwan", flag: "🇹🇼" },
  { code: "+992", name: "Tajikistan", flag: "🇹🇯" },
  { code: "+255", name: "Tanzania", flag: "🇹🇿" },
  { code: "+66", name: "Thailand", flag: "🇹🇭" },
  { code: "+228", name: "Togo", flag: "🇹🇬" },
  { code: "+676", name: "Tonga", flag: "🇹🇴" },
  { code: "+1", name: "Trinidad and Tobago", flag: "🇹🇹" },
  { code: "+216", name: "Tunisia", flag: "🇹🇳" },
  { code: "+90", name: "Turkey", flag: "🇹🇷" },
  { code: "+993", name: "Turkmenistan", flag: "🇹🇲" },
  { code: "+688", name: "Tuvalu", flag: "🇹🇻" },
  { code: "+256", name: "Uganda", flag: "🇺🇬" },
  { code: "+380", name: "Ukraine", flag: "🇺🇦" },
  { code: "+971", name: "United Arab Emirates", flag: "🇦🇪" },
  { code: "+44", name: "United Kingdom", flag: "🇬🇧" },
  { code: "+1", name: "United States", flag: "🇺🇸" },
  { code: "+598", name: "Uruguay", flag: "🇺🇾" },
  { code: "+998", name: "Uzbekistan", flag: "🇺🇿" },
  { code: "+678", name: "Vanuatu", flag: "🇻🇺" },
  { code: "+379", name: "Vatican City", flag: "🇻🇦" },
  { code: "+58", name: "Venezuela", flag: "🇻🇪" },
  { code: "+84", name: "Vietnam", flag: "🇻🇳" },
  { code: "+967", name: "Yemen", flag: "🇾🇪" },
  { code: "+260", name: "Zambia", flag: "🇿🇲" },
  { code: "+263", name: "Zimbabwe", flag: "🇿🇼" },
];

export function SignupForm({
  formData,
  setFormData,
  generateOTPLoading,
  otpVerified,
  onVerifyEmail,
  isSubmitting,
  onSubmit,
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
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  const [search, setSearch] = useState("");
  const [filteredCountries, setFilteredCountries] = useState(countries);
  const [isSelecting, setIsSelecting] = useState(false);

  useEffect(() => {
    setFilteredCountries(
      countries.filter(
        (country) =>
          country.name.toLowerCase().includes(search.toLowerCase()) ||
          country.code.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, countries]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key } = event;

      if (/^[a-zA-Z0-9]$/.test(key)) {
        setSearch((prev) => prev + key);
      } else if (key === "Backspace") {
        setSearch((prev) => prev.slice(0, -1));
      }
    };

    if (isSelecting) window.addEventListener("keydown", handleKeyDown);

    return () => {
      if (isSelecting) window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSelecting]);

  const isPasswordValid = {
    hasMinLength: formData.password.length >= 12,
    hasNumber: /\d/.test(formData.password),
    hasCapital: /[A-Z]/.test(formData.password),
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
      firstName: "First name",
      lastName: "Last name",
      email: "Email",
      phone: "Phone number",
      password: "Password",
      confirmPassword: "Confirm password",
      role: "Role",
    };

    // Check all required fields
    Object.entries(requiredFields).forEach(([field, label]) => {
      if (!formData[field as keyof typeof formData]?.trim()) {
        newErrors[field] = `${label} is required`;
      }
    });

    // Additional validations if fields are not empty
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    const phoneRegex = /^\d{6,15}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (formData.password) {
      if (!formData.password) {
        newErrors.password = "Password is required";
      }

      if (formData.password.length < 12) {
        newErrors.password = "Password must be at least 12 characters";
      }
      if (!/\d/.test(formData.password)) {
        newErrors.password = "Password must contain at least one number";
      }
      if (!/[A-Z]/.test(formData.password)) {
        newErrors.password =
          "Password must contain at least one capital letter";
      }
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!otpVerified) {
      newErrors.email = "Please verify your email";
    }

    if (!formData.role) {
      newErrors.role = "Please let us know your role";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit();
    }
  };

  useEffect(() => {
    if (!formData.countryCode) {
      setFormData({ ...formData, countryCode: "+1" });
    }
  }, []);

  // Close country dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showCountryDropdown) {
        setShowCountryDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCountryDropdown]);

  return (
    <div className="space-y-8 font-futura font-normal">
      <div className="text-start space-y-2">
        <h1 className="text-2xl font-futura">Create Your Account</h1>
        <p className="text-muted-foreground">
          Fill in your details to create your account and get started with
          Kollabee.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="font-futura font-normal">
              {" "}
              First Name<span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="Enter your First Name"
              value={formData.firstName}
              onChange={(e) => {
                setFormData({ ...formData, firstName: e.target.value });
                setErrors({ ...errors, firstName: undefined });
              }}
              className={`bg-[#fcfcfc] font-futura font-normal border ${
                errors.firstName ? "border-red-500" : "border-[#e5e5e5]"
              } rounded-[6px] placeholder:text-[#bababb]`}
              tabIndex={1}
            />
            {errors.firstName && (
              <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="font-futura font-normal">
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
              className="bg-[#fcfcfc] border font-futura font-normal border-[#e5e5e5] rounded-[6px] placeholder:text-[#bababb]"
              tabIndex={3}
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password}</p>
            )}
            <div className="text-xs text-muted-foreground flex flex-col sm:flex-row gap-2 sm:justify-between">
              <div
                className={`flex items-center gap-2 ${
                  isPasswordValid.hasMinLength ? "text-green-500" : ""
                }`}
              >
                <Circle
                  className={`w-1.5 h-1.5 font-futura font-normal ${
                    isPasswordValid.hasMinLength
                      ? "fill-green-500"
                      : "fill-current"
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
                    isPasswordValid.hasNumber
                      ? "fill-green-500"
                      : "fill-current"
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
                    isPasswordValid.hasCapital
                      ? "fill-green-500"
                      : "fill-current"
                  }`}
                />
                Contains a capital letter
              </div>
            </div>
          </div>

          <div className="space-y-2 ">
            <Label
              htmlFor="email"
              className="flex font-normal items-center gap-2"
            >
              Business Email<span className="text-destructive">*</span>
              <InfoButton
                text={
                  "Enter your business email address. This email will be used to send you OTP for verification"
                }
              />
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="Enter your Business Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                disabled={otpVerified}
                className={`relative bg-[#fcfcfc] border border-[#e5e5e5] rounded-[6px] placeholder:text-[#bababb]`}
                tabIndex={5}
              />
              <Button
                onClick={onVerifyEmail}
                disabled={!formData.email || generateOTPLoading || otpVerified}
                variant={otpVerified ? "outline" : "default"}
                className={`absolute  right-0 top-0 h-6  w-20 mt-[6px] mr-2 text-[12px] ${
                  otpVerified
                    ? " border border-[#9e1171]  bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-yellow-500 hover:from-red-600 hover:to-yellow-600"
                    : " border border-[#9e1171]  bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-yellow-500 hover:from-red-600 hover:to-yellow-600"
                }`}
              >
                {otpVerified
                  ? "Verified"
                  : generateOTPLoading
                  ? "Sending..."
                  : "Verify"}
              </Button>

              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label className="font-futura font-normal">
              Describe your Role within the Company
              <span className="text-destructive">*</span>
            </Label>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {companyRoles.map((role) => (
                <Button
                  key={role}
                  variant={formData.role === role ? "default" : "outline"}
                  className={`h-8 text-[10px] sm:text-xs font-normal justify-start px-1 sm:px-2 w-fit rounded-[6px] border ${
                    formData.role === role
                      ? "border-[#9e1171] border text-[#9e1171]"
                      : "border-[#e5e5e5]"
                  }`}
                  onClick={() => setFormData({ ...formData, role: role })}
                >
                  {role}
                </Button>
              ))}
            </div>
            {errors.role && (
              <p className="text-sm text-red-500 mt-1">{errors.role}</p>
            )}
          </div>
          <div className="space-y-4"></div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="font-futura font-normal">
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
                errors.lastName ? "border-red-500" : "border-[#e5e5e5]"
              } rounded-[6px] placeholder:text-[#bababb]`}
              tabIndex={2}
            />
            {errors.lastName && (
              <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>
            )}
          </div>
          <div className="space-y-14">
            <div className="space-y-2 relative">
              <Label className="font-futura font-normal">
                Confirm Password<span className="text-destructive">*</span>
              </Label>
              <Input
                type="password"
                placeholder="Re-enter your Password"
                required
                value={formData.confirmPassword}
                onChange={(e) => {
                  setFormData({ ...formData, confirmPassword: e.target.value });
                  checkPasswordMatch(e.target.value);
                  setErrors({ ...errors, confirmPassword: undefined });
                }}
                className={`bg-[#fcfcfc] border ${
                  showPasswordError ? "border-red-500" : "border-[#e5e5e5]"
                } rounded-[6px] placeholder:text-[#bababb]`}
                tabIndex={4}
              />

              {showPasswordError && (
                <div className="absolute -bottom-6 left-0 text-xs text-red-500 bg-white px-2 py-1 rounded shadow-sm border border-red-100">
                  Passwords do not match
                </div>
              )}
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
              <Select
                value={formData.countryCode}
                onValueChange={(value) => {
                  setFormData({
                    ...formData,
                    countryCode: value,
                    country: countries.find((c) => c.code === value)?.name,
                  });
                  setSearch("");
                  setIsSelecting(false);
                }}
                onOpenChange={setIsSelecting}
              >
                <SelectTrigger className="w-[100px] h-10 rounded-l-md bg-white border border-gray-300 px-3">
                  <SelectValue placeholder="🌍 +1">
                    <ReactCountryFlag
                      countryCode={getCountryCode(formData.countryCode || "+1")}
                      svg
                      style={{
                        width: "1em",
                        height: "1em",
                        marginRight: "0.5em",
                      }}
                      title={
                        countries.find((c) => c.code === formData.countryCode)
                          ?.name || "India"
                      }
                    />
                    {formData.countryCode || "+91"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="w-[260px] max-h-[300px] overflow-y-auto p-2 bg-white">
                  {isSelecting && (
                    <input
                      autoFocus
                      type="text"
                      placeholder="Search country..."
                      className="w-full p-2 border border-gray-300 rounded-md mb-2"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  )}
                  {filteredCountries.length > 0 ? (
                    filteredCountries.map((country) => (
                      <SelectItem key={country.name} value={country.code}>
                        <ReactCountryFlag
                          countryCode={getSpecialCaseCountryCode(
                            country.code,
                            country.name
                          )}
                          svg
                          style={{
                            width: "1em",
                            height: "1em",
                            marginRight: "0.5em",
                          }}
                          title={country.name}
                        />
                        {country.name} ({country.code})
                      </SelectItem>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm p-2">
                      No countries found
                    </p>
                  )}
                </SelectContent>
              </Select>

              <Input
                placeholder="Enter your Phone Number"
                value={formData.phone}
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value });
                  setErrors({ ...errors, phone: undefined });
                }}
                className={`flex-1 bg-white border ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                } rounded-md placeholder-gray-400 px-3 py-2`}
                tabIndex={6}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button
          variant="ghost"
          className="text-primary -ml-4"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          className="rounded-[6px] text-white px-8 py-2 button-bg font-semibold disabled:opacity-50"
          onClick={handleSubmit}
          // disabled={isSubmitting || Object.keys(errors).length > 0}
        >
          {isSubmitting ? "Creating Account..." : "Continue"}
        </Button>
      </div>
    </div>
  );
}
