"use client";

import Star from "@/app/(auth)/signup/seller/onboarding/Star";
import { authApi } from "@/lib/api/auth";
import { profileApi } from "@/lib/api/profile";
import { Country, State } from "country-state-city";
import { Eye, EyeOff } from "lucide-react";
import { User } from "lucide-react";
import { Loader2 } from "lucide-react";
import type React from "react";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import ReactCountryFlag from "react-country-flag";
import { toast } from "sonner";

// Utility functions for country codes
const getCountryCode = (dialCode: string): string => {
  // Convert dial code to ISO country code for ReactCountryFlag
  // This handles special cases and defaults
  const codeMap: Record<string, string> = {
    "+1": "US", // United States/Canada
    "+44": "GB", // United Kingdom
    "+91": "IN", // India
    "+86": "CN", // China
    "+7": "RU", // Russia
    "+81": "JP", // Japan
    "+49": "DE", // Germany
    "+33": "FR", // France
    "+39": "IT", // Italy
    "+34": "ES", // Spain
  };

  // Extract just the country code without the plus sign
  const code = dialCode.replace("+", "");

  // Return the mapped code or try to derive it
  return (
    codeMap[dialCode] ||
    // Try to find a matching country
    countries
      .find((c) => c.code === dialCode)
      ?.name.substring(0, 2)
      .toUpperCase() ||
    "US"
  ); // Default to US if no match
};

const getSpecialCaseCountryCode = (
  dialCode: string,
  countryName: string
): string => {
  // Handle special cases where the country code doesn't match the first two letters
  const specialCases: Record<string, string> = {
    "United Kingdom": "GB",
    "United States": "US",
    "South Korea": "KR",
    "North Korea": "KP",
    "South Africa": "ZA",
  };

  if (specialCases[countryName]) {
    return specialCases[countryName];
  }

  // For countries with dial code +1 (US, Canada, and some Caribbean nations)
  if (dialCode === "+1") {
    if (countryName === "Canada") return "CA";
    if (countryName === "United States") return "US";
    // For other +1 countries, try to derive from name
    return countryName.substring(0, 2).toUpperCase();
  }

  // Default: try to derive from country name
  return countryName.substring(0, 2).toUpperCase();
};

// Move this outside the component
const countries = [
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

type TabType = "account" | "password" | "payment";

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("account");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordResponse, setPasswordResponse] = useState<any>({
    newPassword: "",
    currentPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPassoword, setForgotPassword] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [bankDetails, setBankDetails] = useState<any>({
    fullName: "",
    holderName: "",
    bankName: "",
    bankType: "",
    cvCode: "",
    zipCode: "",
    accountNumber: "",
  });
  const [alert, setAlert] = useState<{
    show: boolean;
    type: "error" | "success";
    message1: string;
    message2: string;
  }>({
    show: false,
    type: "error",
    message1: "",
    message2: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    email: "",
    fullName: "",
    firstName: "",
    lastName: "",
    address: "",
    name: "",
    phoneCountry: "",
    phoneNumber: "",
    country: "",
    state: "",
    accountHolder: "",
    bank: "",
    bankType: "",
    cvCode: "",
    zipCode: "",
    accountNumber: "",
    upinId: "",
    imageUrl: "",
  });
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [filteredCountries, setFilteredCountries] = useState(countries);
  const [isSelecting, setIsSelecting] = useState(false);

  const getUser = useCallback(async () => {
    const response: any = await profileApi.getCurrentUser();
    console.log("User", response);
    setFormData(response);
  }, []);

  const getBankDetails = useCallback(async () => {
    const response: any = await profileApi.getBankDetails();
    setBankDetails(
      response && response.length > 0 ? response[0] : { ...bankDetails }
    );
  }, [bankDetails]);

  useEffect(() => {
    getUser();
    getBankDetails();
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      // Update state immediately without debouncing
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    [setFormData]
  );

  const handleSelectChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    [setFormData]
  );

  const updateProfileData = useCallback(async () => {
    setLoading(true);
    const response: any = await profileApi.updateProfile(formData);
    setLoading(false);

    toast.success("Profile updated successfully");
  }, [formData]);

  useEffect(() => {
    setFilteredCountries(
      countries.filter(
        (country) =>
          country.name.toLowerCase().includes(search.toLowerCase()) ||
          country.code.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search]);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Check if the click is outside the dropdown
      if (
        showCountryDropdown &&
        !target.closest(".country-dropdown-container")
      ) {
        setShowCountryDropdown(false);
        setIsSelecting(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCountryDropdown]);

  // useEffect(() => {
  //   console.log(bankDetails);
  // }, [bankDetails]);

  // Add this after the useState declarations
  const selectedCountry = useMemo(
    () => countries.find((c) => c.code === formData.country),
    [formData.country]
  );

  // Add this function after the useState declarations
  // Replace the debounce function and debouncedHandleInputChange with this:

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordResponse((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBankDetailsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setBankDetails((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    const file = e.target.files?.[0];
    if (file) {
      const response: any = await profileApi.uploadImage(file);
      setFormData({ ...formData, imageUrl: response.url });
    }
    setIsLoading(false);
  };

  const updatePassword = async () => {
    if (passwordResponse.newPassword !== passwordResponse.confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }
    const response: any = await profileApi.updatePassword(passwordResponse);
    toast.success("Password updated successfully");
  };

  const updateBankDetails = async () => {
    const response: any = await profileApi.updateBankDetails(bankDetails);
    toast.success("Bank details updated successfully");
  };

  const handleDeleteImage = () => {
    setFormData({ ...formData, imageUrl: "" });
  };

  const handleForgotPasswordSubmit = async () => {
    setIsLoading(true);
    setAlert({ ...alert, show: false });

    try {
      await authApi.forgotPassword(formData.email);
      setEmailSent(true);
      setAlert({
        show: true,
        type: "success",
        message1: "Reset link sent",
        message2: "Please check your email for the password reset link",
      });
      toast.success("Password reset link sent to your email");
    } catch (error: any) {
      setAlert({
        show: true,
        type: "error",
        message1: "Failed to send reset link",
        message2: error?.response?.data?.error || "Please try again later",
      });
      toast.error(error?.response?.data?.error || "Failed to send reset link");
    } finally {
      setIsLoading(false);
    }
  };

  // Replace the Country select with a memoized version
  const countryOptions = useMemo(() => {
    return [
      <option key="none" value="">
        Select Country
      </option>,
      ...Country.getAllCountries().map((country, index) => (
        <option key={index} value={country.name}>
          {country.name}
        </option>
      )),
    ];
  }, []);

  // Replace the State select with a memoized version
  const stateOptions = useMemo(() => {
    // Find the country object from the Country library based on selected country name
    const selectedCountryObj = Country.getAllCountries().find(
      (c) => c.name === formData.country
    );

    // Get the ISO code for the selected country
    const countryCode = selectedCountryObj?.isoCode;

    // If we have a valid country code, get states for that country
    const states = countryCode ? State.getStatesOfCountry(countryCode) : [];

    return [
      <option key="none" value="">
        Select State
      </option>,
      ...states.map((state, index) => (
        <option key={index} value={state.name}>
          {state.name}
        </option>
      )),
    ];
  }, [formData.country]); // Re-compute when country changes

  const renderAccountSettings = useCallback(() => {
    return (
      <div className="p-6 ">
        <div className="grid grid-cols-5 gap-8">
          {/* Profile Image Section */}
          <div className="col-span-2">
            <div className="flex flex-col items-center space-y-4 border border-[#e4e7eb] rounded-lg p-4 h-full">
              <div className="relative">
                {isLoading ? (
                  <div className="flex items-center justify-center w-96 h-96">
                    {" "}
                    <Loader2 className="w-10 h-10 animate-spin" />{" "}
                  </div>
                ) : formData.imageUrl ? (
                  <img
                    src={formData.imageUrl || "/placeholder.svg"}
                    alt="Profile"
                    className="w-96 h-96 rounded-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex items-center justify-center w-96 h-96">
                    {" "}
                    <User className="w-10 h-10 text-red-400" />{" "}
                  </div>
                )}
                <div className="mt-4 text-center text-[11px] text-gray-500">
                  Format: PNG, JPEG Size: 2MB
                </div>
                <div className="flex justify-center space-x-4 mt-4">
                  <button className="flex items-center text-red-500 hover:text-red-600">
                    <span
                      className="underline"
                      onClick={() => {
                        fileInputRef.current?.click();
                      }}
                    >
                      {formData.imageUrl ? "Change" : "Upload"}
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                    />
                  </button>
                  <button className="flex items-center text-red-500 hover:text-red-600">
                    <span className="underline" onClick={handleDeleteImage}>
                      Delete
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="col-span-3 space-y-4">
            <div className="w-full flex gap-4 items-center">
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                  <Star />
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter your First Name"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                  <Star />
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter your Last Name"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <p>
                  Business Email
                  <Star />
                </p>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Re-enter your Business Email"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Address
                <Star />
              </label>
              <input
                type="text"
                name="address"
                value={formData.address || ""}
                onChange={handleInputChange}
                placeholder="Create your Office Address"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
                <Star />
              </label>
              <div className="flex">
                <div className="relative country-dropdown-container">
                  <div
                    className="flex items-center justify-between bg-[#fcfcfc] border-l border-t border-b border-[#e5e5e5] rounded-l-[6px] px-2 py-2 w-[90px] cursor-pointer"
                    onClick={() => {
                      setShowCountryDropdown(!showCountryDropdown);
                      setIsSelecting(true);
                      setSearch("");
                    }}
                  >
                    <span className="flex items-center">
                      <ReactCountryFlag
                        countryCode={getCountryCode(
                          countries.find(
                            (c) =>
                              c.code === formData.country ||
                              c.name === formData.country
                          )?.code || "+1"
                        )}
                        svg
                        style={{
                          width: "1.5em",
                          height: "1.5em",
                          marginRight: "0.2em",
                        }}
                        title={
                          countries.find((c) => c.code === formData.country)
                            ?.code || "United States"
                        }
                      />
                      {countries.find((c) => c.name === formData.country)
                        ?.code || "+1"}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      style={{ marginLeft: "1.2em" }}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>

                  {showCountryDropdown && (
                    <div className="absolute z-10 mt-1 w-[300px] max-h-[300px] overflow-y-auto bg-white border border-gray-200 rounded-md shadow-lg">
                      <div className="p-2">
                        <input
                          autoFocus
                          type="text"
                          placeholder="Search country..."
                          className="w-full p-2 border border-gray-300 rounded-md mb-2"
                          value={search}
                          onClick={(e) => e.stopPropagation()}
                        />
                        {filteredCountries.length > 0 ? (
                          filteredCountries.map((country) => (
                            <div
                              key={country.name}
                              className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-100 cursor-pointer"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  country: country.name,
                                });
                                setShowCountryDropdown(false);
                                setIsSelecting(false);
                                setSearch("");
                              }}
                            >
                              <ReactCountryFlag
                                countryCode={getSpecialCaseCountryCode(
                                  country.code,
                                  country.name
                                )}
                                svg
                                style={{
                                  width: "1.5em",
                                  height: "1.5em",
                                }}
                                title={country.name}
                              />
                              <span>{country.name}</span>
                              <span className="text-gray-500 ml-auto">
                                {country.code}
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500 p-2">
                            No countries found
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber || ""}
                  onChange={handleInputChange}
                  placeholder="1234567890"
                  className="w-full px-3 py-2 border rounded-r-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700  mb-1">
                Country / Region
                <Star />
              </label>
              <select
                name="country"
                value={formData.country || "Select"}
                onChange={handleSelectChange}
                className="w-full px-3 py-2 border rounded-lg bg-transparent"
              >
                {countryOptions}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  States
                  <Star />
                </label>
                <select
                  name="state"
                  value={formData.state || ""}
                  onChange={handleSelectChange}
                  className="w-full px-3 py-2 border rounded-lg bg-transparent"
                >
                  {stateOptions}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Zip Code
                  <Star />
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode || ""}
                  onChange={handleInputChange}
                  placeholder="Enter Zip Code"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="pt-4 flex justify-end">
          <button
            disabled={loading}
            onClick={updateProfileData}
            className="bg-gradient-to-r from-[#9e1171] to-[#f0b168] text-white px-6 py-2 rounded-[6px]"
          >
            Save Changes
          </button>
        </div>
      </div>
    );
  }, [
    formData,
    isSelecting,
    isLoading,
    handleInputChange,
    handleSelectChange,
    search,
    filteredCountries,
    showCountryDropdown,
    updateProfileData,
  ]);

  const renderPasswordManagement = useCallback(
    () => (
      <div className="p-6">
        <div className="space-y-6">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Current Password
              <Star />
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="currentPassword"
                value={passwordResponse.currentPassword}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 border rounded-lg pr-10"
                placeholder="●●●"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-400" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
            <button
              className=" underline text-sm mt-2 ml-1"
              onClick={() => setForgotPassword(true)}
            >
              Forgot Password?
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* New Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                New Password
                <Star />
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={passwordResponse.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 border rounded-lg pr-10"
                  placeholder="●●●"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
                <Star />
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={passwordResponse.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 border rounded-lg pr-10"
                  placeholder="●●●"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-8 flex justify-end">
          <button
            onClick={updatePassword}
            className="bg-gradient-to-r from-[#9e1171] to-[#f0b168] text-white px-6 py-2 rounded-[6px] "
          >
            Save Changes
          </button>
        </div>
      </div>
    ),
    [passwordResponse, showPassword, showNewPassword, showConfirmPassword]
  );

  const renderPaymentMethod = useCallback(
    () => (
      <div className="p-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="w-full flex gap-4 items-center">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
                <Star />
              </label>
              <input
                type="text"
                name="fullName"
                value={bankDetails.firstName}
                onChange={handleBankDetailsChange}
                placeholder="Enter your Full Name"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Holder (Optional)
            </label>
            <input
              type="text"
              name="holderName"
              value={bankDetails.holderName}
              onChange={handleBankDetailsChange}
              placeholder="Text Here"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Bank
              <Star />
            </label>
            <input
              type="text"
              name="bankName"
              value={bankDetails.bankName}
              onChange={handleBankDetailsChange}
              placeholder="Enter your Bank Name"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bank Type
              <Star />
            </label>
            <select
              name="bankType"
              value={bankDetails.bankType}
              onChange={handleBankDetailsChange}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">Select Type</option>
              {[
                { name: "Savings", value: "SAVINGS" },
                { name: "Current", value: "CURRENT" },
              ].map((bankType, index) => (
                <option key={index} value={bankType.value}>
                  {bankType.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CV Code
              <Star />
            </label>
            <input
              type="text"
              name="cvCode"
              value={bankDetails.cvCode}
              onChange={handleBankDetailsChange}
              placeholder="XXX"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zip Code
              <Star />
            </label>
            <input
              type="text"
              name="zipCode"
              value={bankDetails.zipCode}
              onChange={handleBankDetailsChange}
              placeholder="XXXXX"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Number
              <Star />
            </label>
            <input
              type="text"
              name="accountNumber"
              value={bankDetails.accountNumber}
              onChange={handleBankDetailsChange}
              placeholder="Enter your Account Number"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add UPI Id
            </label>
            <input
              type="text"
              name="upinId"
              value={bankDetails.upinId}
              onChange={handleBankDetailsChange}
              placeholder="Text Here"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>
        <div className="pt-4 flex justify-end">
          <button
            onClick={updateBankDetails}
            className="bg-gradient-to-r from-[#9e1171] to-[#f0b168] text-white px-6 py-2 rounded-[6px] "
          >
            Save Changes
          </button>
        </div>
      </div>
    ),
    [bankDetails]
  );

  const renderForgotPassword = useCallback(() => {
    // Removed handleForgotPasswordSubmit from dependencies
    return (
      <div className="p-6">
        {emailSent ? (
          <div className="text-center">
            <p className="text-green-500 font-semibold">
              Password reset link sent to your email.
            </p>
            <p>
              Please check your inbox and follow the instructions to reset your
              password.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
                <Star />
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <button
                onClick={handleForgotPasswordSubmit}
                disabled={isLoading}
                className={`bg-gradient-to-r from-[#9e1171] to-[#f0b168] text-white px-6 py-2 rounded-[6px] ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2 inline-block" />
                ) : (
                  "Reset Password"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }, [emailSent, formData.email, handleInputChange, isLoading]);

  return (
    <div className="md:px-6  ">
      <div className=" bg-white rounded-xl mb-4">
        <div className="flex space-x-6 px-6 py-4">
          <button
            className={`rounded-md text-sm shadow-none py-1.5 px-2 font-medium ${
              activeTab === "account"
                ? "bg-rose-100"
                : "border-transparent text-gray-500"
            }`}
            onClick={() => setActiveTab("account")}
          >
            Account Settings
          </button>
          <button
            className={`rounded-md text-sm shadow-none py-1.5 px-2 font-medium ${
              activeTab === "password"
                ? "bg-rose-100"
                : "border-transparent text-gray-500"
            }`}
            onClick={() => setActiveTab("password")}
          >
            Password Management
          </button>
          <button
            className={`rounded-md text-sm shadow-none py-1.5 px-2 font-medium ${
              activeTab === "payment"
                ? "bg-rose-100"
                : "border-transparent text-gray-500"
            }`}
            onClick={() => setActiveTab("payment")}
          >
            Payment Method
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4">
        {activeTab === "account" && renderAccountSettings()}
        {activeTab === "password" && forgotPassoword
          ? renderForgotPassword()
          : activeTab === "password" && renderPasswordManagement()}
        {activeTab === "payment" && renderPaymentMethod()}
      </div>
    </div>
  );
};

export default Settings;
