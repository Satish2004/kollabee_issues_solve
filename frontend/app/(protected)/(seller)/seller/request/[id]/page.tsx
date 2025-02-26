"use client"
import React, { useState } from 'react';
import { ChevronLeft,X } from 'lucide-react';
import {useRouter} from "next/navigation"

const KollaBeeRequestDetails = () => {
  const router = useRouter();
  const [requestData] = useState({
    id: '1',
    companyName: 'Guangzhou Daxin Trading Firm (Sole Proprietorship)',
    country: 'CN',
    categoryPath: ['Beauty & Personal Care', 'Skin Care & Body Care', 'Facial Care', 'Face Mask Sheet'],
    productName: 'Antibacterial Sheet Masks',
    tags: ['Product', 'Packaging', 'Request for proposal'],
    leadSize: '+$5,000',
    quantity: '100-1000 Units',
    orderFrequency: 'Monthly',
    targetPrice: 'On demand',
    imageUrl: '/api/placeholder/140/140',
    requirements: {
      industryAttributes: [
        { name: 'Material', value: 'Polyester / Cotton' },
        { name: 'Technics', value: 'embroidered, Printed, 3D embroidery, Affixed cloth embroidery, towel embroidery' }
      ],
      otherAttributes: [
        { name: 'Collar', value: 'Hooded' }
      ]
    }
  });

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className=" mx-auto bg-white shadow-sm">
        {/* Header with KollaBee logo */}
     

        {/* Requests title */}
       

        {/* Main Content */}
        <div className="p-4">
          {/* Back button and action buttons */}
          <div className="flex justify-between mb-6">
            <button className="flex items-center text-gray-600 text-sm" onClick={() => router.back()}>
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </button>
            <div className="flex space-x-2">
              <button className="rounded-[6px] border border-[#9e1171] bg-clip-text text-transparent bg-gradient-to-r from-[#9e1171] to-[#f0b168] text-sm flex items-center px-4 py-2">
          <X className="w-4 h-4 mr-1 text-red-500" />
                Decline Request
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-[#9e1171] to-[#f0b168] text-white rounded-lg text-sm flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Accept Request
              </button>
            </div>
          </div>

          {/* Company and product info */}
          <div className="border rounded-md mb-6">
            {/* Company info */}
            <div className="p-4">
              <div className="flex items-center mb-2">
                <ChevronLeft className="w-4 h-4 mr-2" />
                <span className="font-medium">{requestData.companyName}</span>
                {requestData.country === 'CN' && (
                  <div className="flex items-center ml-2">
                    <div className="w-5 h-3 bg-red-600 flex items-center justify-center text-[8px] text-white font-bold">CN</div>
                  </div>
                )}
              </div>
                
              <div className="flex items-center text-xs text-gray-500 mb-2">
                {requestData.categoryPath.map((category, index) => (
                  <React.Fragment key={index}>
                    <span>{category}</span>
                    {index < requestData.categoryPath.length - 1 && (
                      <svg className="w-1 h-1 mx-2 text-gray-500" fill="currentColor" viewBox="0 0 8 8">
                        <circle cx="4" cy="4" r="3" />
                      </svg>
                    )}
                  </React.Fragment>
                ))}
              </div>
                
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{requestData.productName}</h2>
                <button
                  className="px-4 py-2 rounded text-sm bg-rose-600 text-white"
                  onClick={() => router.push(`/seller/chat`)}
                >
                  Start Chat
                </button>
              </div>
                
              <div className="flex space-x-2 my-2">
                {requestData.tags.map((tag, index) => (
                  <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
                
              <div className="grid grid-cols-5 gap-4 mt-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Lead size <span className="text-xs text-gray-400">i</span></p>
                  <p className="font-medium text-sm">{requestData.leadSize}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Country</p>
                  <p className="font-medium text-sm">India</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Quantity <span className="text-xs text-gray-400">i</span></p>
                  <p className="font-medium text-sm">{requestData.quantity}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Order frequency <span className="text-xs text-gray-400">i</span></p>
                  <div className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                    <p className="font-medium text-sm">{requestData.orderFrequency}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Target Price</p>
                  <p className="font-medium text-sm">On demand</p>
                </div>
              </div>
            </div>
            <div className="flex border-t">
              <div className="w-1/3">
                <img src={requestData.imageUrl} alt={requestData.productName} className="w-full h-36 object-cover" />
              </div>
              <div className="w-2/3"></div>
            </div>
          </div>

          {/* Requirements section */}
          <div className="border rounded-md p-4">
            <h3 className="font-semibold text-lg mb-4">Requirements</h3>
            
            {/* Industry-specific attributes */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Industry-specific attributes</h4>
              <div className="border rounded-md overflow-hidden">
                {requestData.requirements.industryAttributes.map((attr, index) => (
                  <div key={index} className={`grid grid-cols-3 ${index !== 0 ? 'border-t' : ''}`}>
                    <div className="p-3 bg-gray-50 border-r">
                      <span className="text-sm">{attr.name}</span>
                    </div>
                    <div className="col-span-2 p-3">
                      <span className="text-sm">{attr.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Other attributes */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Other attributes</h4>
              <div className="border rounded-md overflow-hidden">
                {requestData.requirements.otherAttributes.map((attr, index) => (
                  <div key={index} className={`grid grid-cols-3 ${index !== 0 ? 'border-t' : ''}`}>
                    <div className="p-3 bg-gray-50 border-r">
                      <span className="text-sm">{attr.name}</span>
                    </div>
                    <div className="col-span-2 p-3">
                      <span className="text-sm">{attr.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KollaBeeRequestDetails;