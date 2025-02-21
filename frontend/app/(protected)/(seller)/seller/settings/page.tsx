"use client"
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import AccountSettings from './account-settings';
interface SettingsProps {
  onSave: () => void;
}

type TabType = 'account' | 'password' | 'payment';

const Settings: React.FC<SettingsProps> = ({ onSave }) => {
  const [activeTab, setActiveTab] = useState<TabType>('password');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    email: 'amanverma500@gmail.com',
    fullName: '',
    companyEmail: '',
    officeAddress: '',
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
    upinId: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const renderAccountSettings = () => (
    <div className="p-6">
      <div className="grid grid-cols-3 gap-8">
        {/* Profile Image Section */}
        <div className="col-span-1">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <img
                src="/api/placeholder/200/200"
                alt="Profile"
                className="w-48 h-48 rounded-full object-cover"
              />
              <div className="mt-4 text-center text-sm text-gray-500">
                Format: PNG, JPEG    Size: 2MB
              </div>
              <div className="flex justify-center space-x-4 mt-4">
                <button className="flex items-center text-red-500 hover:text-red-600">
                  <span className="underline">Change</span>
                </button>
                <button className="flex items-center text-red-500 hover:text-red-600">
                  <span className="underline">Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="col-span-2 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name*
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter your Full Name"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Email Address*
            </label>
            <input
              type="email"
              name="companyEmail"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Re-enter your Company Email Address"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Office Address*
            </label>
            <input
              type="text"
              name="officeAddress"
              value={formData.officeAddress || ''}
              onChange={handleInputChange}
              placeholder="Create your Office Address"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country / Region*
            </label>
            <select
              name="country"
              value={formData.country || ''}
              onChange={handleSelectChange}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">Select Country</option>
              <option value="IN">India</option>
              <option value="US">United States</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                States*
              </label>
              <select
                name="state"
                value={formData.state || ''}
                onChange={handleSelectChange}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Select State</option>
                <option value="DL">Delhi</option>
                <option value="MH">Maharashtra</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zip Code*
              </label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                placeholder="Enter Zip Code"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={onSave}
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2 rounded-lg"
            >
              Save Changes
            </button>
          </div>
        </div>
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
              value={formData.currentPassword}
              onChange={handleInputChange}
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
          <button className="text-red-500 text-sm mt-1">
            Forgot Password?
          </button>
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
              value={formData.newPassword}
              onChange={handleInputChange}
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
              value={formData.confirmPassword}
              onChange={handleInputChange}
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

      <button
        onClick={onSave}
        className="mt-6 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg"
      >
        Save Changes
      </button>
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
            value={formData.fullName}
            onChange={handleInputChange}
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
            name="accountHolder"
            value={formData.accountHolder}
            onChange={handleInputChange}
            placeholder="Text Here"
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Bank*
          </label>
          <select
            name="bank"
            value={formData.bank}
            onChange={handleSelectChange}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="">Select Bank</option>
            {/* Add bank options */}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bank Type*
          </label>
          <select
            name="bankType"
            value={formData.bankType}
            onChange={handleSelectChange}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="">Select Type</option>
            {/* Add bank type options */}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CV Code*
          </label>
          <input
            type="text"
            name="cvCode"
            value={formData.cvCode}
            onChange={handleInputChange}
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
            value={formData.zipCode}
            onChange={handleInputChange}
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
            value={formData.accountNumber}
            onChange={handleInputChange}
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
            value={formData.upinId}
            onChange={handleInputChange}
            placeholder="Text Here"
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
      </div>

      <button
        onClick={onSave}
        className="mt-6 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg"
      >
        Save Changes
      </button>
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