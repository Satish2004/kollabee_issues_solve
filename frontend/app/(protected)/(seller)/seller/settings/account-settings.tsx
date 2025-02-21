"use client"
import React, { useState } from 'react';
import { Camera, Trash2 } from 'lucide-react';

interface AccountFormData {
  fullName: string;
  companyEmail: string;
  officeAddress: string;
  phoneCountry: string;
  phoneNumber: string;
  country: string;
  state: string;
  zipCode: string;
  profileImage?: File;
}

interface AccountSettingsProps {
  onSave: (data: AccountFormData) => void;
  initialData?: Partial<AccountFormData>;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ onSave, initialData }) => {
  const [formData, setFormData] = useState<AccountFormData>({
    fullName: initialData?.fullName || '',
    companyEmail: initialData?.companyEmail || '',
    officeAddress: initialData?.officeAddress || '',
    phoneCountry: initialData?.phoneCountry || 'US',
    phoneNumber: initialData?.phoneNumber || '',
    country: initialData?.country || '',
    state: initialData?.state || '',
    zipCode: initialData?.zipCode || '',
  });

  const [profileImageUrl, setProfileImageUrl] = useState<string>('/api/placeholder/200/200');
  const [errors, setErrors] = useState<Partial<Record<keyof AccountFormData, string>>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof AccountFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (2MB)
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          profileImage: 'Image size should be less than 2MB'
        }));
        return;
      }

      // Validate file type
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          profileImage: 'Only JPEG and PNG files are allowed'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        profileImage: file
      }));
      setProfileImageUrl(URL.createObjectURL(file));
    }
  };

  const handleDeleteImage = () => {
    setProfileImageUrl('/api/placeholder/200/200');
    setFormData(prev => {
      const newData = { ...prev };
      delete newData.profileImage;
      return newData;
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof AccountFormData, string>> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.companyEmail.trim()) {
      newErrors.companyEmail = 'Company email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.companyEmail)) {
      newErrors.companyEmail = 'Invalid email format';
    }

    if (!formData.officeAddress.trim()) {
      newErrors.officeAddress = 'Office address is required';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone number format';
    }

    if (!formData.country) {
      newErrors.country = 'Country is required';
    }

    if (!formData.state) {
      newErrors.state = 'State is required';
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'Zip code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="grid grid-cols-3 gap-8">
        {/* Profile Image Section */}
        <div className="col-span-1">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <img
                src={profileImageUrl}
                alt="Profile"
                className="w-48 h-48 rounded-full object-cover"
              />
              <label 
                htmlFor="profile-upload"
                className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50"
              >
                <Camera className="w-5 h-5 text-gray-600" />
              </label>
              <input
                type="file"
                id="profile-upload"
                className="hidden"
                accept="image/jpeg,image/png"
                onChange={handleImageChange}
              />
            </div>
            <div className="text-center text-sm text-gray-500">
              Format: PNG, JPEG    Size: 2MB
            </div>
            {errors.profileImage && (
              <div className="text-red-500 text-sm">{errors.profileImage}</div>
            )}
            <div className="flex space-x-4">
              <label
                htmlFor="profile-upload"
                className="text-red-500 hover:text-red-600 cursor-pointer underline"
              >
                Change
              </label>
              <button
                type="button"
                onClick={handleDeleteImage}
                className="text-red-500 hover:text-red-600 underline"
              >
                Delete
              </button>
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
              className={`w-full px-3 py-2 border rounded-lg ${
                errors.fullName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.fullName && (
              <div className="text-red-500 text-sm mt-1">{errors.fullName}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Email Address*
            </label>
            <input
              type="email"
              name="companyEmail"
              value={formData.companyEmail}
              onChange={handleInputChange}
              placeholder="Enter your Company Email Address"
              className={`w-full px-3 py-2 border rounded-lg ${
                errors.companyEmail ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.companyEmail && (
              <div className="text-red-500 text-sm mt-1">{errors.companyEmail}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Office Address*
            </label>
            <input
              type="text"
              name="officeAddress"
              value={formData.officeAddress}
              onChange={handleInputChange}
              placeholder="Create your Office Address"
              className={`w-full px-3 py-2 border rounded-lg ${
                errors.officeAddress ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.officeAddress && (
              <div className="text-red-500 text-sm mt-1">{errors.officeAddress}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number*
            </label>
            <div className="flex">
              <select
                name="phoneCountry"
                className="px-3 py-2 border rounded-l-lg border-r-0 bg-gray-50"
                value={formData.phoneCountry}
                onChange={handleSelectChange}
              >
                <option value="US">🇺🇸 +1</option>
                <option value="IN">🇮🇳 +91</option>
                <option value="UK">🇬🇧 +44</option>
                <option value="CA">🇨🇦 +1</option>
                <option value="AU">🇦🇺 +61</option>
              </select>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="1234567890"
                className={`w-full px-3 py-2 border rounded-r-lg ${
                  errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.phoneNumber && (
              <div className="text-red-500 text-sm mt-1">{errors.phoneNumber}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country / Region*
            </label>
            <select
              name="country"
              value={formData.country}
              onChange={handleSelectChange}
              className={`w-full px-3 py-2 border rounded-lg ${
                errors.country ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select Country</option>
              <option value="IN">India</option>
              <option value="US">United States</option>
              <option value="UK">United Kingdom</option>
              <option value="CA">Canada</option>
              <option value="AU">Australia</option>
            </select>
            {errors.country && (
              <div className="text-red-500 text-sm mt-1">{errors.country}</div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                States*
              </label>
              <select
                name="state"
                value={formData.state}
                onChange={handleSelectChange}
                className={`w-full px-3 py-2 border rounded-lg ${
                  errors.state ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select State</option>
                {formData.country === 'IN' && (
                  <>
                    <option value="DL">Delhi</option>
                    <option value="MH">Maharashtra</option>
                    <option value="KA">Karnataka</option>
                    <option value="TN">Tamil Nadu</option>
                  </>
                )}
                {formData.country === 'US' && (
                  <>
                    <option value="CA">California</option>
                    <option value="NY">New York</option>
                    <option value="TX">Texas</option>
                    <option value="FL">Florida</option>
                  </>
                )}
              </select>
              {errors.state && (
                <div className="text-red-500 text-sm mt-1">{errors.state}</div>
              )}
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
                className={`w-full px-3 py-2 border rounded-lg ${
                  errors.zipCode ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.zipCode && (
                <div className="text-red-500 text-sm mt-1">{errors.zipCode}</div>
              )}
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2 rounded-lg hover:from-red-600 hover:to-pink-600 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AccountSettings;