import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import {toast} from "sonner"

const dummyProductName = {
    productName: 'Aloe Vera Gel',
    additionalIngredients: 'Aloe Vera, Water, Sugar, Citric Acid',
    formulaDetails: null,
    totalQuantity: '1000 units',
    packagingType: 'Bottle',
    volumeSize: '250 ml per bottle',
    specialInstructions: 'None',
    deliveryDeadline: '2025-03-03',
    deliveryLocation: '123 Main St, Anytown, USA',
    additionalNotes: 'None',
    isAccepted: false,
    isManufactured: false,
    isShipped: false,
    isDelivered: false,
    isCancelled: false,
    isCompleted: false,
    isFailed: false,
}


const BuyerForm = ({setActiveTab}:{setActiveTab:any}) => {
  // Form state
  const [formData, setFormData] = useState<any>({
    productName: '',
    additionalIngredients: '',
    formulaDetails: null,
    totalQuantity: '',
    packagingType: '',
    volumeSize: '',
    specialInstructions: '',
    deliveryDeadline: '',
    deliveryLocation: '',
    additionalNotes: ''
  });

  useEffect(() => {
    setFormData(dummyProductName);
  }, []);

  // Validation state
  const [errors, setErrors] = useState<any>({});
  const [touched, setTouched] = useState<any>({});
  
  // Dropdown options state
  const [packagingOptions] = useState(['Bottle', 'Tube', 'Sachet']);
  const [showPackagingDropdown, setShowPackagingDropdown] = useState(false);

  // Handle input change
  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setFormData((prev:any) => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev:any) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle blur event for validation
  const handleBlur = (e:any) => {
    const { name } = e.target;
    setTouched((prev:any) => ({
      ...prev,
      [name]: true
    }));
    validateField(name, formData[name]);
  };

  // Validate a specific field
  const validateField = (name:any, value:any) => {
    let error = '';
    
    // Required fields
    if (name === 'productName' && !value) {
      error = 'Product Name is required';
    }
    else if (name === 'totalQuantity' && !value) {
      error = 'Total Quantity is required';
    }
    else if (name === 'packagingType' && !value) {
      error = 'Packaging Type is required';
    }
    else if (name === 'volumeSize' && !value) {
      error = 'Volume or size is required';
    }
    else if (name === 'deliveryDeadline' && !value) {
      error = 'Delivery Deadline is required';
    }
    else if (name === 'deliveryLocation' && !value) {
      error = 'Delivery Location is required';
    }
    
    // Update errors state
    setErrors((prev:any) => ({
      ...prev,
      [name]: error
    }));
    
    return !error;
  };

  // Handle packaging type selection
  const handleSelectPackaging = (option:any) => {
    setFormData((prev:any) => ({
      ...prev,
      packagingType: option
    }));
    setShowPackagingDropdown(false);
    setErrors((prev:any) => ({
      ...prev,
      packagingType: ''
    }));
  };

  // Handle form submission
  const handleSubmit = (e:any) => {
    e.preventDefault();
    
    // Validate all fields
    let formIsValid = true;
    const fields = ['productName', 'totalQuantity', 'packagingType', 'volumeSize', 'deliveryDeadline', 'deliveryLocation'];
    
    fields.forEach(field => {
        const isValid = validateField(field, formData[field]);
      if (!isValid) formIsValid = false;
      
      // Mark all fields as touched
      setTouched((prev:any) => ({
        ...prev,
        [field]: true
      }));
    });
    
    if (formIsValid) {
      console.log('Form submitted:', formData);
      toast.success('Form submitted successfully');
      setFormData({
        productName: '',
        additionalIngredients: '',
        formulaDetails: null,
        totalQuantity: '',
        packagingType: '',
        volumeSize: '',
        specialInstructions: '',
        deliveryDeadline: '',
        deliveryLocation: '',
        additionalNotes: ''
      });
      setActiveTab('all');
      // Here you would typically send the data to your backend
    }
  };

  return (
    <div className="bg-white text-gray-800   p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Create Form for the Buyer</h2>
        <button 
          className="flex items-center border border-gray-300 rounded px-4 py-2 text-sm text-orange-500"
        >
          <span className="mr-2">+</span>
          Add Section
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Product Details Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold"><span className="mr-2">2</span>Product Details</h3>
            <button type="button" className="text-red-500 font-medium text-sm">+ Add Fields</button>
          </div>
          
          <div className="mb-4 relative">
            <label className="block mb-1 text-sm font-medium">
              Product Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="productName"
              placeholder="Name of the product (e.g., Aloe Vera Gel)"
              className={`w-full p-2 border ${errors.productName && touched.productName ? 'border-red-500' : 'border-gray-300'} rounded`}
              value={formData.productName}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.productName && touched.productName && (
              <span className="absolute right-3 top-9 text-red-500">×</span>
            )}
          </div>
          
          <div className="mb-4 relative">
            <label className="block mb-1 text-sm font-medium">
              Additional Ingredients (Optional)<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="additionalIngredients"
              placeholder="Wants customization, you can add extra ingredients or specify preferences"
              className="w-full p-2 border border-gray-300 rounded"
              value={formData.additionalIngredients}
              onChange={handleChange}
            />
            {errors.additionalIngredients && touched.additionalIngredients && (
              <span className="absolute right-3 top-9 text-red-500">×</span>
            )}
          </div>
          
          <div className="mb-4 relative">
            <label className="block mb-1 text-sm font-medium">
              Formula Details<span className="text-red-500">*</span>
            </label>
            <div className="border border-gray-300 rounded p-8 flex items-center justify-center">
              <div className="bg-gray-200 p-8 rounded flex items-center justify-center">
                <div className="text-gray-400">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <path d="M8 12H16M12 8V16" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
              </div>
            </div>
            {errors.formulaDetails && touched.formulaDetails && (
              <span className="absolute right-3 top-9 text-red-500">×</span>
            )}
          </div>
        </div>

        {/* Quantity Requirements Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold"><span className="mr-2">3</span>Quantity Requirements</h3>
            <button type="button" className="text-red-500 font-medium text-sm">+ Add Fields</button>
          </div>
          
          <div className="mb-4 relative">
            <label className="block mb-1 text-sm font-medium">
              Total Quantity Needed<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="totalQuantity"
              placeholder="e.g., 1000 units"
              className={`w-full p-2 border ${errors.totalQuantity && touched.totalQuantity ? 'border-red-500' : 'border-gray-300'} rounded`}
              value={formData.totalQuantity}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.totalQuantity && touched.totalQuantity && (
              <span className="absolute right-3 top-9 text-red-500">×</span>
            )}
          </div>
        </div>

        {/* Packaging Details Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold"><span className="mr-2">4</span>Packaging Details</h3>
            <button type="button" className="text-red-500 font-medium text-sm">+ Add Fields</button>
          </div>
          
          <div className="mb-4 relative">
            <label className="block mb-1 text-sm font-medium">
              Type of packaging<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div 
                className={`w-full p-2 border ${errors.packagingType && touched.packagingType ? 'border-red-500' : 'border-gray-300'} rounded flex justify-between items-center cursor-pointer`}
                onClick={() => setShowPackagingDropdown(!showPackagingDropdown)}
              >
                <span className={formData.packagingType ? 'text-black' : 'text-gray-400'}>
                  {formData.packagingType || 'Choose'}
                </span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              
              {showPackagingDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg">
                  <div className="p-2 border-b border-gray-200">
                    <input
                      type="text"
                      placeholder="Type your Dropdown Options"
                      className="w-full p-1 border border-gray-300 rounded"
                    />
                  </div>
                  <ul>
                    {packagingOptions.map((option, index) => (
                      <li 
                        key={index} 
                        className="p-2 hover:bg-gray-100 flex justify-between items-center cursor-pointer"
                        onClick={() => handleSelectPackaging(option)}
                      >
                        {option}
                        <span className="text-gray-500">×</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            {errors.packagingType && touched.packagingType && (
              <span className="absolute right-3 top-9 text-red-500">×</span>
            )}
          </div>
          
          <div className="mb-4 relative">
            <label className="block mb-1 text-sm font-medium">
              Volume or size per unit<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="volumeSize"
              placeholder="e.g., 250 ml per bottle"
              className={`w-full p-2 border ${errors.volumeSize && touched.volumeSize ? 'border-red-500' : 'border-gray-300'} rounded`}
              value={formData.volumeSize}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.volumeSize && touched.volumeSize && (
              <span className="absolute right-3 top-9 text-red-500">×</span>
            )}
          </div>
          
          <div className="mb-4 relative">
            <label className="block mb-1 text-sm font-medium">
              Special packaging instructions (if any)<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="specialInstructions"
              placeholder="Text Here.."
              className="w-full p-2 border border-gray-300 rounded"
              value={formData.specialInstructions}
              onChange={handleChange}
            />
            {errors.specialInstructions && touched.specialInstructions && (
              <span className="absolute right-3 top-9 text-red-500">×</span>
            )}
          </div>
        </div>

        {/* Delivery Preferences Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold"><span className="mr-2">5</span>Delivery Preferences</h3>
            <button type="button" className="text-red-500 font-medium text-sm">+ Add Fields</button>
          </div>
          
          <div className="mb-4 relative">
            <label className="block mb-1 text-sm font-medium">
              Delivery Deadline<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="deliveryDeadline"
                placeholder="DD/MM/YYYY"
                className={`w-full p-2 border ${errors.deliveryDeadline && touched.deliveryDeadline ? 'border-red-500' : 'border-gray-300'} rounded pr-10`}
                value={formData.deliveryDeadline}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Calendar className="absolute right-3 top-2.5 text-gray-400" size={18} />
            </div>
            {errors.deliveryDeadline && touched.deliveryDeadline && (
              <span className="absolute right-3 top-9 text-red-500">×</span>
            )}
          </div>
          
          <div className="mb-4 relative">
            <label className="block mb-1 text-sm font-medium">
              Delivery Location<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="deliveryLocation"
              placeholder="Input for specifying delivery address or uploading detailed shipping instructions."
              className={`w-full p-2 border ${errors.deliveryLocation && touched.deliveryLocation ? 'border-red-500' : 'border-gray-300'} rounded`}
              value={formData.deliveryLocation}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.deliveryLocation && touched.deliveryLocation && (
              <span className="absolute right-3 top-9 text-red-500">×</span>
            )}
          </div>
        </div>

        {/* Additional Notes Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold"><span className="mr-2">6</span>Additional Notes (Optional)</h3>
            <button type="button" className="text-red-500 font-medium text-sm">+ Add Fields</button>
          </div>
          
          <div className="mb-4 relative">
            <input
              type="text"
              name="additionalNotes"
              placeholder="Text Here.."
              className="w-full p-2 border border-gray-300 rounded"
              value={formData.additionalNotes}
              onChange={handleChange}
            />
            {errors.additionalNotes && touched.additionalNotes && (
              <span className="absolute right-3 top-2.5 text-red-500">×</span>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="flex items-center space-x-2 px-4 py-2 rounded-[6px] text-white bg-gradient-to-r from-[#9e1171] to-[#f0b168]"
          >
            Submit Form
          </button>
        </div>
      </form>
    </div>
  );
};

export default BuyerForm;