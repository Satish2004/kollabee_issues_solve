"use client"
import React, { useState, useEffect ,useRef} from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { profileApi } from '@/lib/api/profile';
import { BankDetail } from '@/types/api';
import { Country, State, City } from "country-state-city"
import { toast } from 'sonner';
import { User } from 'lucide-react';
import { Loader2 } from 'lucide-react';

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

type TabType = 'account' | 'password' | 'payment';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('account');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordResponse, setPasswordResponse] = useState<any>({newPassword:'',currentPassword:'',confirmPassword:''});
  const [isLoading, setIsLoading] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
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
    console.log("User",response);
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
    phoneCountry: '',
    phoneNumber: '',
    country: '',
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
    setIsLoading(true);
    const file = e.target.files?.[0];
    if (file) {
      const response:any = await profileApi.uploadImage(file);
      setFormData({ ...formData, imageUrl: response.url });
    }
    setIsLoading(false);
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

  const handleDeleteImage = () => {
    setFormData({...formData, imageUrl: ''});
  }
  const renderAccountSettings = () => (
    <div className="p-6">
      <div className="grid grid-cols-5 gap-8">
        {/* Profile Image Section */}
        <div className="col-span-2">
          <div className="flex flex-col items-center space-y-4 border border-[#e4e7eb] rounded-lg p-4 h-full">
            <div className="relative">
           {  isLoading ?   <div className='flex items-center justify-center w-96 h-96'> <Loader2 className="w-10 h-10 animate-spin" /> </div> : formData.imageUrl ?  <img
                src={formData.imageUrl}
                alt="Profile"
                className="w-96 h-96 rounded-full object-cover"
                /> : <div className='flex items-center justify-center w-96 h-96'> <User className="w-10 h-10 text-red-400" /> </div>}
              <div className="mt-4 text-center text-[11px] text-gray-500">
                Format: PNG, JPEG    Size: 2MB
              </div>
              <div className="flex justify-center space-x-4 mt-4">
                <button className="flex items-center text-red-500 hover:text-red-600">
                  <span className="underline" onClick={() => {
                    fileInputRef.current?.click();
                  }}>{formData.imageUrl ? "Change" : "Upload"}</span>
                  <input type="file" className="hidden" ref={fileInputRef} onChange={handleImageChange} />
                </button>
                <button className="flex items-center text-red-500 hover:text-red-600">
                  <span className="underline" onClick={handleDeleteImage} >Delete</span>
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
            <div className="relative">
                  <button
                    type="button"
                    className="flex items-center justify-between bg-[#fcfcfc] border border-[#e5e5e5] rounded-l-[6px] px-2 py-2 w-[90px] h-9"
                    onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                  >
                    <span className="flex items-center">
                      {countries.find((c) => c.code === formData.country)
                        ?.flag || "🌍"}
                      {formData.country || "+1"}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>

                  {showCountryDropdown && (
                    <div className="absolute z-10 mt-1 w-[250px] max-h-[250px] overflow-y-auto bg-white border border-gray-200 rounded-md shadow-lg">
                      <div className="p-2">
                        {countries.map((country) => (
                          <div
                            key={country.name}
                            className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                country: country.code,
                              });
                              setShowCountryDropdown(false);
                            }}
                          >
                            <span>{country.flag}</span>
                            <span>{country.name}</span>
                            <span className="text-gray-500 ml-auto">
                              {country.code}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
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
              value={formData.country || "Select"}
              onChange={handleSelectChange}
              className="w-full px-3 py-2 border rounded-lg"
            >
         {Country.getAllCountries().map((country,index) => (
          <>
          <option key={"none"} value="">Select Country</option>
            <option key={index} value={country.name}>{country.name}</option>
          </>
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
                  <>
                  <option key={"none"} value="">Select State</option>
                  <option key={index} value={state.name}>{state.name}</option>
                  </>
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
        className="bg-gradient-to-r from-[#9e1171] to-[#f0b168] text-white px-6 py-2 rounded-[6px] "
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