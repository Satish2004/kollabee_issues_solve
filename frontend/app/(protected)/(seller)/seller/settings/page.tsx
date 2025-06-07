"use client";

import AccountSettings from "./components/account-settings";
import ForgotPassword from "./components/forgot-password";
import PasswordManagement from "./components/password-management";
import PaymentMethod from "./components/payment-method";
import { authApi } from "@/lib/api/auth";
import { profileApi } from "@/lib/api/profile";
import { countries } from "@/lib/country";
import type {
  TabType,
  FormData,
  BankDetails,
  PasswordResponse,
  Alert,
} from "@/types/settings";
import type React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("account");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordResponse, setPasswordResponse] = useState<PasswordResponse>({
    newPassword: "",
    currentPassword: "",
    confirmPassword: "",
  });
  const [originalPasswordResponse, setOriginalPasswordResponse] =
    useState<PasswordResponse>({
      newPassword: "",
      currentPassword: "",
      confirmPassword: "",
    });
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPassoword, setForgotPassword] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    fullName: "",
    holderName: "",
    bankName: "",
    bankType: "",
    cvCode: "",
    zipCode: "",
    accountNumber: "",
    upinId: "",
  });
  const [originalBankDetails, setOriginalBankDetails] = useState<BankDetails>({
    fullName: "",
    holderName: "",
    bankName: "",
    bankType: "",
    cvCode: "",
    zipCode: "",
    accountNumber: "",
    upinId: "",
  });
  const [alert, setAlert] = useState<Alert>({
    show: false,
    type: "error",
    message1: "",
    message2: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormData>({
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
  const [originalFormData, setOriginalFormData] = useState<FormData>({
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
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [bankLoading, setBankLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [filteredCountries, setFilteredCountries] = useState(countries);
  const [isSelecting, setIsSelecting] = useState(false);

  const getUser = useCallback(async () => {
    const response: any = await profileApi.getCurrentUser();
    console.log("User", response);
    setFormData(response);
    setOriginalFormData(response);
  }, []);

  const getBankDetails = useCallback(async () => {
    const response: any = await profileApi.getBankDetails();
    const details = response && response.length > 0 ? response[0] : bankDetails;
    setBankDetails(details);
    setOriginalBankDetails(details);
  }, [bankDetails]);

  useEffect(() => {
    getUser();
    getBankDetails();
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );

  const handleSelectChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );

  const updateProfileData = useCallback(async () => {
    setLoading(true);
    try {
      const response: any = await profileApi.updateProfile(formData);
      setOriginalFormData(formData);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
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
      try {
        const response: any = await profileApi.uploadImage(file);
        setFormData({ ...formData, imageUrl: response.url });
      } catch (error) {
        toast.error("Failed to upload image");
      }
    }
    setIsLoading(false);
  };

  const updatePassword = async () => {
    if (passwordResponse.newPassword !== passwordResponse.confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }
    setPasswordLoading(true);
    try {
      const response: any = await profileApi.updatePassword(passwordResponse);
      setOriginalPasswordResponse(passwordResponse);
      toast.success("Password updated successfully");
    } catch (error) {
      toast.error("Failed to update password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const updateBankDetails = async () => {
    setBankLoading(true);
    try {
      const response: any = await profileApi.updateBankDetails(bankDetails);
      setOriginalBankDetails(bankDetails);
      toast.success("Bank details updated successfully");
    } catch (error) {
      toast.error("Failed to update bank details");
    } finally {
      setBankLoading(false);
    }
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

  return (
    <div className="">
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
        {activeTab === "account" && (
          <AccountSettings
            formData={formData}
            setFormData={setFormData}
            originalFormData={originalFormData}
            isLoading={isLoading}
            fileInputRef={fileInputRef}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            handleImageChange={handleImageChange}
            handleDeleteImage={handleDeleteImage}
            loading={loading}
            updateProfileData={updateProfileData}
            showCountryDropdown={showCountryDropdown}
            setShowCountryDropdown={setShowCountryDropdown}
            search={search}
            setSearch={setSearch}
            filteredCountries={filteredCountries}
            setIsSelecting={setIsSelecting}
            isSelecting={isSelecting}
          />
        )}
        {activeTab === "password" &&
          (forgotPassoword ? (
            <ForgotPassword
              emailSent={emailSent}
              formData={formData}
              handleInputChange={handleInputChange}
              handleForgotPasswordSubmit={handleForgotPasswordSubmit}
              isLoading={isLoading}
            />
          ) : (
            <PasswordManagement
              passwordResponse={passwordResponse}
              originalPasswordResponse={originalPasswordResponse}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              showNewPassword={showNewPassword}
              setShowNewPassword={setShowNewPassword}
              showConfirmPassword={showConfirmPassword}
              setShowConfirmPassword={setShowConfirmPassword}
              handlePasswordChange={handlePasswordChange}
              setForgotPassword={setForgotPassword}
              updatePassword={updatePassword}
              loading={passwordLoading}
            />
          ))}
        {activeTab === "payment" && (
          <PaymentMethod
            bankDetails={bankDetails}
            originalBankDetails={originalBankDetails}
            handleBankDetailsChange={handleBankDetailsChange}
            updateBankDetails={updateBankDetails}
            loading={bankLoading}
          />
        )}
      </div>
    </div>
  );
};

export default Settings;
