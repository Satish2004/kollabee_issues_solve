"use client"
import React, { useState, useEffect ,useRef} from 'react';
import { Eye, EyeOff } from 'lucide-react';
import AccountSettings from './account-settings';
import { profileApi } from '@/lib/api/profile';
import { BankDetail } from '@/types/api';
import { Country, State, City } from "country-state-city"
import { toast } from 'sonner';
import { User } from '@/types/api';
interface SettingsProps {
}

type TabType = 'account' | 'password' | 'payment';

const Settings: React.FC<SettingsProps> = () => {
  const [activeTab, setActiveTab] = useState<TabType>('account');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordResponse, setPasswordResponse] = useState<any>({newPassword:'',currentPassword:'',confirmPassword:''});
  const [bankDetails, setBankDetails] = useState<any>({
    fullName: '',
    holderName: '',
    bankName: '',
    bankType: '',
    cvCode: '',
    zipCode: '',
    accountNumber: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getUser = async () => {
    const response:any = await profileApi.getCurrentUser();
   setFormData(response);
  }

  const getBankDetails = async () => {
    const response:any = await profileApi.getBankDetails();
    setBankDetails(response  && response.length > 0 ? response[0] : {...bankDetails});
  }

  useEffect(() => {
    getUser();
    getBankDetails(); 
  }, []);

  useEffect(() => {
    console.log(bankDetails);
  }, [bankDetails]);

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    email: '',
    fullName: '',
    address: '',
    name: '',

    phoneCountry: 'US',
    phoneNumber: '',
    country: 'IN',
    state: '',
    accountHolder: '',
    bank: '',
    bankType: '',
    cvCode: '',
    zipCode: '',
    accountNumber: '',
    upinId: '',
    imageUrl: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordResponse((prev:any) => ({
      ...prev,
      [name]: value
    }));
  }

  const handleBankDetailsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setBankDetails((prev: any) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const response:any = await profileApi.uploadImage(file);
      setFormData({ ...formData, imageUrl: response.url });
    }
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const updateProfile = async () => {
    const response:any = await profileApi.updateProfile(formData);
    toast.success("Profile updated successfully");
  }

  const updatePassword = async () => {  

    if(passwordResponse.newPassword !== passwordResponse.confirmPassword){
      toast.error("New password and confirm password do not match");
      return;
    }
    const response:any = await profileApi.updatePassword(passwordResponse);
    toast.success("Password updated successfully");
  }

  const updateBankDetails = async () => {
    const response:any = await profileApi.updateBankDetails(bankDetails);
    toast.success("Bank details updated successfully");
  }
  const renderAccountSettings = () => (
    <div className="p-6">
      <div className="grid grid-cols-5 gap-8">
        {/* Profile Image Section */}
        <div className="col-span-2">
          <div className="flex flex-col items-center space-y-4 border border-[#e4e7eb] rounded-lg p-4 h-full">
            <div className="relative">
              <img
                src={formData.imageUrl}
                alt="Profile"
                className="w-96 h-96 rounded-full object-cover"
              />
              <div className="mt-4 text-center text-[11px] text-gray-500">
                Format: PNG, JPEG    Size: 2MB
              </div>
              <div className="flex justify-center space-x-4 mt-4">
                <button className="flex items-center text-red-500 hover:text-red-600">
                  <span className="underline" onClick={() => {
                    fileInputRef.current?.click();
                  }}>Change</span>
                  <input type="file" className="hidden" ref={fileInputRef} onChange={handleImageChange} />
                </button>
                <button className="flex items-center text-red-500 hover:text-red-600">
                  <span className="underline">Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="col-span-3 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name*
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
                onChange={handleInputChange}
              placeholder="Enter your Full Name"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Email Address*
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              readOnly
                onChange={handleInputChange}
              placeholder="Re-enter your Company Email Address"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Office Address*
            </label>
            <input
              type="text"
              name="address"
              value={formData.address || ''}
              onChange={handleInputChange}
              placeholder="Create your Office Address"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number*
            </label>
            <div className="flex">
              <select
                name="phoneCountry"
                className="px-3 py-2 border rounded-l-lg border-r-0 bg-gray-50"
                value={formData.phoneCountry || 'US'}
                onChange={handleSelectChange}
              >
                <option value="US">🇺🇸 +1</option>
                <option value="IN">🇮🇳 +91</option>
              </select>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber || ''}
                onChange={handleInputChange}
                placeholder="1234567890"
                className="w-full px-3 py-2 border rounded-r-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country / Region*
            </label>
            <select
              name="country"
              value={formData.country || ''}
              onChange={handleSelectChange}
              className="w-full px-3 py-2 border rounded-lg"
            >
         {Country.getAllCountries().map((country,index) => (
            <option key={index} value={country.name}>{country.name}</option>
         ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                States*
              </label>
              <select
                name="state"
                value={formData.state || ''}
                onChange={handleSelectChange}
                className="w-full px-3 py-2 border rounded-lg"
              >
                {State.getAllStates().map((state,index) => (
                  <option key={index} value={state.name}>{state.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Zip Code*
              </label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode || ''}
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
              onClick={updateProfile}
              className="bg-gradient-to-r from-[#9e1171] to-[#f0b168] text-white px-6 py-2 rounded-[6px]"
            >
              Save Changes
            </button>
          </div>
    </div>
  );

  const renderPasswordManagement = () => (
    <div className="p-6">
      <div className="space-y-6">
        {/* Current Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Password*
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
          {/* <button className="text-red-500 text-sm mt-1">
            Forgot Password?
          </button> */}
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password*
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password*
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={passwordResponse.confirmPassword}
              onChange  ={handlePasswordChange}
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
      <div className="pt-4 flex justify-end">
      <button
        onClick={updatePassword}
        className="bg-gradient-to-r from-[#9e1171] to-[#f0b168] text-white px-6 py-2 rounded-[6px]"
      >
        Save Changes
      </button>
      </div>
    </div>
  );

  const renderForgotPassword = () => (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Forgot Password</h2>
      <p className="text-gray-600 mb-6">
        Enter the email address you used when you joined and we'll send you instructions to reset your password.
      </p>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address*
          </label>
          <input
            type="email"
            value={formData.email}
            readOnly
            className="w-full px-3 py-2 border rounded-lg bg-gray-50"
          />
        </div>
        <button className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-2 rounded-lg">
          Reset Password
        </button>
        <div className="text-center">
          <p className="text-gray-500 text-sm mb-2">Or try to log in with Email</p>
          <button className="flex items-center justify-center space-x-2 w-full border border-gray-300 py-2 rounded-lg">
            <img src="/api/placeholder/20/20" alt="Google" className="w-5 h-5" />
            <span>Sign up with Google</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderPaymentMethod = () => (
    <div className="p-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name*
          </label>
          <input
            type="text"
            name="fullName"
            value={bankDetails.fullName}
            onChange={handleBankDetailsChange}
            placeholder="Enter your Full Name"
            className="w-full px-3 py-2 border rounded-lg"
          />
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
            Select Bank*
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
            Bank Type*
          </label>
          <select
            name="bankType"
            value={bankDetails.bankType}
            onChange={handleBankDetailsChange}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="">Select Type</option>
        {[{name:'Savings',value:'SAVINGS'},{name:'Current',value:'CURRENT'}].map((bankType,index) => (
          <option key={index} value={bankType.value}>{bankType.name}</option>
        ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CV Code*
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
            Zip Code*
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
            Account Number*
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
  );

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="border-b">
        <div className="flex space-x-6 px-6">
          <button
            className={`py-4 px-2 border-b-2 font-medium ${
              activeTab === 'account'
                ? 'border-red-500 text-red-500'
                : 'border-transparent text-gray-500'
            }`}
            onClick={() => setActiveTab('account')}
          >
            Account Settings
          </button>
          <button
            className={`py-4 px-2 border-b-2 font-medium ${
              activeTab === 'password'
                ? 'border-red-500 text-red-500'
                : 'border-transparent text-gray-500'
            }`}
            onClick={() => setActiveTab('password')}
          >
            Password Management
          </button>
          <button
            className={`py-4 px-2 border-b-2 font-medium ${
              activeTab === 'payment'
                ? 'border-red-500 text-red-500'
                : 'border-transparent text-gray-500'
            }`}
            onClick={() => setActiveTab('payment')}
          >
            Payment Method
          </button>
        </div>
      </div>

      {activeTab === 'account' && renderAccountSettings()}
      {activeTab === 'password' && renderPasswordManagement()}
      {activeTab === 'payment' && renderPaymentMethod()}
    </div>
  );
};

export default Settings;