'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
// import { createRequest } from './actions';

type RequestFormData = {
  productName: string;
  additionalIngredients?: string;
  formulaDetails?: string;
  formulaImage?: string;
  quantity: number;
  packagingType?: string;
  volumePerUnit?: string;
  packagingInstructions?: string;
  deliveryDeadline?: string;
  deliveryLocation?: string;
  additionalNotes?: string;
  requestType: 'PRODUCT' | 'PACKAGING' | 'PROPOSAL';
};

const RequestForm = ({ sellerId }: { sellerId: string }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RequestFormData>();

  const onSubmit = async (formData: RequestFormData) => {
    setError(null);
    
    startTransition(async () => {
      const data = {
        ...formData,
        sellerId,
        quantity: parseInt(formData.quantity.toString()),
      };

      // const result = await createRequest(data);

      // if (!result.success) {
      //   setError(result.error || "An error occurred");
      //   return;
      // }

      router.push('/requests');
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto p-6 space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded">
          {error}
        </div>
      )}
      
      <div className="space-y-6">
        {/* Product Details Section */}
        <div className="border rounded-lg p-4 space-y-4">
          <h2 className="text-xl font-semibold">1. Product Details</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Product Name *</label>
              <input
                type="text"
                placeholder="Name of the product (e.g., Aloe Vera Gel)"
                {...register('productName', { required: 'Product name is required' })}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Additional Ingredients (Optional)</label>
              <input
                type="text"
                placeholder="Wants customization, you can add extra ingredients or specify preferences"
                {...register('additionalIngredients')}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Formula Details *</label>
              <textarea
                {...register('formulaDetails', { required: 'Formula details are required' })}
                className="w-full p-2 border rounded h-32"
              />
              <input
                type="file"
                {...register('formulaImage')}
                className="mt-2"
              />
            </div>
          </div>
        </div>

        {/* Quantity Requirements */}
        <div className="border rounded-lg p-4 space-y-4">
          <h2 className="text-xl font-semibold">2. Quantity Requirements</h2>
          
          <div>
            <label className="block text-sm font-medium mb-1">Total Quantity Needed *</label>
            <input
              type="number"
              placeholder="e.g., 1000 units"
              {...register('quantity', { required: 'Quantity is required' })}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        {/* Packaging Details */}
        <div className="border rounded-lg p-4 space-y-4">
          <h2 className="text-xl font-semibold">3. Packaging Details</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Type of packaging *</label>
              <select {...register('packagingType')} className="w-full p-2 border rounded">
                <option value="">Choose</option>
                <option value="Bottle">Bottle</option>
                <option value="Tube">Tube</option>
                <option value="Sachet">Sachet</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Volume or size per unit *</label>
              <input
                type="text"
                placeholder="e.g., 250 ml per bottle"
                {...register('volumePerUnit')}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Special packaging instructions (if any)</label>
              <textarea
                {...register('packagingInstructions')}
                placeholder="Text Here..."
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>

        {/* Delivery Preferences */}
        <div className="border rounded-lg p-4 space-y-4">
          <h2 className="text-xl font-semibold">4. Delivery Preferences</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Delivery Deadline *</label>
              <input
                type="date"
                {...register('deliveryDeadline')}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Delivery Location *</label>
              <input
                type="text"
                placeholder="Input for specifying delivery address or uploading detailed shipping instructions."
                {...register('deliveryLocation')}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>

        {/* Additional Notes */}
        <div className="border rounded-lg p-4 space-y-4">
          <h2 className="text-xl font-semibold">Additional Notes (Optional)</h2>
          
          <textarea
            {...register('additionalNotes')}
            placeholder="Text Here..."
            className="w-full p-2 border rounded h-32"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? 'Submitting...' : 'Submit Request'}
        </button>
      </div>
    </form>
  );
};

export default RequestForm;
