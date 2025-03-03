"use client"
import React, { useState, useEffect } from 'react';
import {format} from "date-fns";
import { authApi } from '@/lib/api/auth';
import { profileApi } from '@/lib/api/profile';
import { toast } from 'sonner';

const KollaBeeProfile = () => {
  const [activeTab, setActiveTab] = useState<any>('categories');
  const [activeSection, setActiveSection] = useState(null);
  const [profileData, setProfileData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
 
  const tabs = [
    { id: 'categories', label: 'Categories' },
    { id: 'production-services', label: 'Production Services' },
    { id: 'production-managed', label: 'Production Managed' },
    { id: 'production-manufactured', label: 'Production Manufactured' },
    { id: 'business-capabilities', label: 'Business Capabilities' },
    { id: 'target-audience', label: 'Target Audience' },
    { id: 'team-size', label: 'Team Size' },
    { id: 'annual-revenue', label: 'Annual Revenue' },
    { id: 'minimum-order', label: 'Minimum Order Quantity' },
    { id: 'comments-notes', label: 'Comments & Notes' },
    { id: 'certificates', label: 'Certificates' }
  ];
  
  const sections:any = {
    'categories': {
      title: 'Define Your Categories',
      description: 'Provide details about your business\'s unique attributes, subcategories, and target audience.'
    },
    'production-services': {
      title: 'What Production Services Does Your Business Offer?',
      description: 'Provide details about your business\'s unique attributes, subcategories, and target audience.'
    },
    'production-managed': {
      title: 'How Is Your Production Managed?',
      description: 'Provide insights into your production management to help buyers understand your capabilities.'
    },
    'production-manufactured': {
      title: 'Where Are Your Products Manufactured?',
      description: 'Specify your primary manufacturing locations to help buyers understand your production footprint'
    },
    'business-capabilities': {
      title: 'Business Capabilities',
      description: 'Match with the right buyers by selecting the category that best describes your business.'
    }
  };
  
  const toggleSection = (sectionId:any) => {
    if (activeSection === sectionId) {
      setActiveSection(null);
    } else {
      setActiveSection(sectionId);
    }
  };
  
  // Fetch initial profile data
  useEffect(() => {
 
    const getUser = async () => {
      const user = await authApi.getCurrentUser();
      setProfileData(user);
    }
    getUser();
  }, []);

  // Handle section updates
  const handleSectionUpdate = async (section: string, data: any) => {
    setIsSaving(true);
    try {
      let response:any;
      switch (section) {
        case 'categories':
          response = await profileApi.updateCategories(data);
          break;
        case 'production-services':
          response = await profileApi.updateProductionServices(data);
          break;
        case 'production-managed':
          response = await profileApi.updateProductionManagement(data);
          break;
        case 'production-manufactured':
          response = await profileApi.updateManufacturingLocations(data);
          break;
        case 'business-capabilities':
          response = await profileApi.updateBusinessCapabilities(data);
          break;
        // Add other cases for remaining sections
      }
      
      setProfileData((prev:any) => ({
        ...prev,
        [section]: response.data
      }));
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  // Content for each section
  const renderSectionContent = () => {
    // if (isLoading) {
    //   return <div>Loading...</div>;
    // }

    switch (activeTab) {
      case 'categories':
        return (
          <div className="mt-4">
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Business Type</h4>
              <p className="text-xs text-gray-500">Subcategories by category</p>
            </div>
            
            {profileData.categories?.map((category: any) => (
              <div key={category.id} className="mb-4">
                <h4 className="text-sm font-medium mb-2">{category.name}</h4>
                <div className="ml-2">
                  {category.subcategories?.map((subcat: any) => (
                    <div key={subcat.id}>
                      <p className="text-sm mb-2">{subcat.name}</p>
                      <div className="flex flex-wrap gap-2 ml-4 mb-2">
                        {subcat.items?.map((item: any) => (
                          <span key={item.id} className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {item.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      case 'production-services':
        return (
          <div className="mt-4">
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start">
                  <input type="checkbox" className="mt-1 mr-2" />
                  <div>
                    <p className="text-sm font-medium">Bulk Manufacturing</p>
                    <p className="text-xs text-gray-500">High-volume production designed to meet wholesale and distribution needs.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'production-managed':
        return (
          <div className="mt-4 space-y-3">
            <div className="flex items-center">
              <input type="radio" name="production" className="mr-2" />
              <label className="text-sm">In-House Production</label>
            </div>
            <div className="flex items-center">
              <input type="radio" name="production" className="mr-2" />
              <label className="text-sm">Outsourced Production</label>
            </div>
            <div className="flex items-center">
              <input type="radio" name="production" className="mr-2" />
              <label className="text-sm">Hybrid Model (Both In-House and Outsourced)</label>
            </div>
          </div>
        );
      case 'production-manufactured':
        return (
          <div className="mt-4">
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Location</p>
              <input type="text" placeholder="Text here..." className="border p-2 w-full rounded text-sm" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <label className="text-sm">India (City/State Optional)</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <label className="text-sm">USA (City/State Optional)</label>
              </div>
            </div>
          </div>
        );
      case 'business-capabilities':
        return (
          <div className="mt-4 space-y-2">
            <div className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <label className="text-sm">Eco-Friendly Practices</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <label className="text-sm">Vegan Products</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <label className="text-sm">Organic Ingredients</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <label className="text-sm">Small Batch Production</label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
    
      
      {/* Main content */}
      <div className="flex-1 flex">
        {/* Sidebar */}
       
        
        {/* Main content area */}
        <div className="flex-1 overflow-visible">
          <div className="p-6">
         
            
            {/* Profile completion and updates */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="border rounded-md p-6 relative tour-profile-strength">
                <div className="mb-4">
                  <h3 className="text-base font-medium mb-5">List to updates</h3>
                  
                  <svg viewBox="0 0 100 100" className="w-32 h-32 mx-auto">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#f0f0f0" strokeWidth="15" />
                    <circle cx="50" cy="50" r="40" fill="none" strokeWidth="15"
                      stroke="#4338ca" strokeDasharray="251.2" strokeDashoffset="67.8" 
                      transform="rotate(-90 50 50)" />
                    <circle cx="50" cy="50" r="40" fill="none" strokeWidth="15"
                      stroke="#e11d48" strokeDasharray="251.2" strokeDashoffset="67.8" 
                      transform="rotate(30 50 50)" />
                    <circle cx="50" cy="50" r="40" fill="none" strokeWidth="15"
                      stroke="#fbbf24" strokeDasharray="251.2" strokeDashoffset="188.4"
                      transform="rotate(190 50 50)" />
                    <text x="50" y="55" textAnchor="middle" className="text-xl font-semibold">73%</text>
                  </svg>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-purple-900 mr-2"></div>
                    <div className="text-sm">Company Details</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-purple-700 mr-2"></div>
                    <div className="text-sm">Personal Information</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-purple-600 mr-2"></div>
                    <div className="text-sm">Describe your brand</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-pink-600 mr-2"></div>
                    <div className="text-sm">Certifications</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-gray-200 mr-2"></div>
                    <div className="text-sm">Add details</div>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-md p-6 col-span-2 tour-customer-reach">
                <h3 className="text-base font-medium mb-1">Helps your reach broader customers base</h3>
                
                <div className="flex">
                  <div className="pr-8 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center mt-2 justify-between">
                        <img src={profileData?.imageUrl} alt="company logo" className="rounded-full mr-2 h-20 w-20" />
                        <div>
                          <div className="text-sm font-medium">{profileData?.name}</div>
                          <div className="text-xs text-gray-500">Supplier</div>
                        </div>
                      </div>
                      
                      <div className="mt-4 text-xs">
                        <div>{profileData?.updatedAt ? format(new Date(profileData?.updatedAt), 'MMMM, yyyy') : ''}</div>
                        <div className="text-gray-600">More reach to customers</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-grow flex flex-col justify-between">
                   
                    
                    <div className="flex flex-col items-end">
                      <div className="flex h-16">
                        {Array(10).fill(0).map((_, i) => (
                          <div 
                            key={i} 
                            className="w-3 mx-1 rounded-t-sm" 
                            style={{ 
                              height: `${30 + Math.random() * 60}%`,
                              backgroundColor: `hsl(${260 + i * 8}, 70%, ${50 + Math.random() * 20}%)`
                            }}
                          ></div>
                        ))}
                      </div>
                      <div>
                      <div className="text-4xl font-bold text-right">0</div>
                      <div className="text-xs text-right text-gray-600">More sales compares to the other supplier on KollaBee</div>
                    </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="flex flex-wrap border-b mb-6">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`px-4 py-2 text-sm ${activeTab === tab.id ? 'bg-[#fdeced] border-gray-800 font-medium rounded-[8px]' : 'text-gray-500'}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            
            {/* Section content */}
            {sections[activeTab] && (
              <div className="border rounded-md mb-6">
                <div 
                  className="p-4 flex justify-between items-center cursor-pointer"
                  onClick={() => toggleSection(activeTab)}
                >
                  <div>
                    <h3 className="font-medium">{sections[activeTab].title}</h3>
                    <p className="text-sm text-gray-500">{sections[activeTab].description}</p>
                  </div>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-5 w-5 transform ${activeSection === activeTab ? 'rotate-180' : ''} transition-transform`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                
                {activeSection === activeTab && (
                  <div className="px-4 pb-4">
                    {renderSectionContent()}
                  </div>
                )}
              </div>
            )}
            
            {/* Footer actions */}
          
          </div>
        </div>
        
        {/* Right sidebar */}
       
      </div>
      
      {/* Add loading and saving indicators */}
    
    </div>
  );
};

export default KollaBeeProfile;