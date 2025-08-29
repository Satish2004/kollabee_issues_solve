'use client';
import React from "react";

type RequestTableProps = {
  requests: {
    id: string;
    companyName: string;
    country: string;
    productName: string;
    category: string;
    quantity: string;
    targetPrice: string;
    orderFrequency: string;
    status: string;
  }[];
  onView: (id: string) => void;
};

export const RequestTable = ({ requests, onView }: RequestTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Company</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Product</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Category</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Quantity</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Target Price</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Order Frequency</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {requests.map((request) => (
            <tr key={request.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span>{request.companyName}</span>
                  <img 
                    src={`/flags/${request.country.toLowerCase()}.svg`}
                    alt={request.country}
                    className="w-4 h-4"
                  />
                </div>
              </td>
              <td className="px-4 py-3">{request.productName}</td>
              <td className="px-4 py-3">{request.category}</td>
              <td className="px-4 py-3">{request.quantity}</td>
              <td className="px-4 py-3">{request.targetPrice}</td>
              <td className="px-4 py-3">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"/>
                  {request.orderFrequency}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded-full text-xs
                  ${request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                  ${request.status === 'Approved' ? 'bg-green-100 text-green-800' : ''}
                  ${request.status === 'Rejected' ? 'bg-red-100 text-red-800' : ''}
                `}>
                  {request.status}
                </span>
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => onView(request.id)}
                  className="px-3 py-1 text-sm bg-gray-800 text-white rounded hover:bg-gray-700"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
