// import React, { useState, useEffect } from "react";
// import { Country, State } from "country-state-city";
// import { submitShippingAddressAction } from "@/actions/cart";
// import { toast } from "sonner";

// interface CheckoutFormProps {
//   cartItemsCount: number;
//   formData: any;
//   setFormData: React.Dispatch<React.SetStateAction<any>>;
// }

// const CheckoutForm = ({ cartItemsCount, formData, setFormData }: CheckoutFormProps) => {
//   const [countries, setCountries] = useState<any[]>([]);
//   const [states, setStates] = useState<any[]>([]);

//   const [errors, setErrors] = useState({
//     firstName: "",
//     lastName: "",
//     address: "",
//     email: "",
//     phoneNumber: "",
//     country: "",
//     state: "",
//     zipCode: "",
//   });

//   useEffect(() => {
//     // Get all countries
//     const allCountries = Country.getAllCountries();
//     setCountries(allCountries);

//     // Get states for default country (India)
//     const countryStates = State.getStatesOfCountry(formData.country);
//     setStates(countryStates);
//   }, []);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });

//     if (name === "country") {
//       const countryStates = State.getStatesOfCountry(value);
//       setStates(countryStates);
//       setFormData((prev: any) => ({ ...prev, state: "" })); // Reset state when country changes
//     }

//     if (value.trim() !== "") {
//       setErrors({ ...errors, [name]: "" });
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const newErrors: typeof errors = { ...errors };

//       // Validate required fields
//       Object.keys(errors).forEach((key) => {
//         if (!formData[key as keyof typeof formData] || formData[key as keyof typeof formData].trim() === "") {
//           newErrors[key as keyof typeof errors] = "This field is required.";
//         }
//       });
  
//       setErrors(newErrors);
  
//       // Submit the form if no errors
//       const hasErrors = Object.values(newErrors).some((error) => error !== "");
//       if (!hasErrors) {
//         try {
//           const result = await submitShippingAddressAction(formData);
//           if (result.success) {
//             toast.success("Shipping address saved successfully");
//           }
//         } catch (error) {
//           toast.error("Failed to save shipping address. Please try again.");
//           console.error("Form submission error:", error);
//         }
//       }
//     } catch (error) {
//       console.log("Error: ", error);
//       toast.error("Failed to save shipping address. Please try again.");
//     }
//   };

//   // Get current country data
//   const currentCountry = countries.find(country => country.isoCode === formData.country);

//   return (
//     <div className="max-w-4xl mx-auto">
//       <h1 className="text-2xl font-medium mb-6">Shipping Address</h1>

//       <form className="space-y-4">
//         {/* First Name and Last Name */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label htmlFor="firstName" className="block mb-1">
//               First Name<span className="text-red-500">*</span>
//             </label>
//             <input
//               id="firstName"
//               type="text"
//               name="firstName"
//               value={formData.firstName}
//               onChange={handleChange}
//               placeholder="First Name"
//               className="w-full border border-gray-300 rounded-md p-2"
//             />
//             {errors.firstName && (
//               <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>
//             )}
//           </div>
//           <div>
//             <label htmlFor="lastName" className="block mb-1">
//               Last Name<span className="text-red-500">*</span>
//             </label>
//             <input
//               id="lastName"
//               type="text"
//               name="lastName"
//               value={formData.lastName}
//               onChange={handleChange}
//               placeholder="Last Name"
//               className="w-full border border-gray-300 rounded-md p-2"
//             />
//             {errors.lastName && (
//               <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>
//             )}
//           </div>
//         </div>

//         {/* Address */}
//         <div>
//           <label htmlFor="address" className="block mb-1">
//             Address<span className="text-red-500">*</span>
//           </label>
//           <input
//             id="address"
//             type="text"
//             name="address"
//             value={formData.address}
//             onChange={handleChange}
//             placeholder="Address"
//             className="w-full border border-gray-300 rounded-md p-2"
//           />
//           {errors.address && (
//             <p className="text-sm text-red-500 mt-1">{errors.address}</p>
//           )}
//         </div>

//         {/* Email and Phone */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label htmlFor="email" className="block mb-1">
//               Email<span className="text-red-500">*</span>
//             </label>
//             <input
//               id="email"
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="Add your Email"
//               className="w-full border border-gray-300 rounded-md p-2"
//             />
//             {errors.email && (
//               <p className="text-sm text-red-500 mt-1">{errors.email}</p>
//             )}
//           </div>
//           <div>
//             <label htmlFor="phoneNumber" className="block mb-1">
//               Phone Number<span className="text-red-500">*</span>
//             </label>
//             <div className="flex">
//               <div className="flex items-center border border-gray-300 rounded-l-md px-2 bg-white">
//                 <img
//                   src={`https://flagcdn.com/${formData.country.toLowerCase()}.svg`}
//                   alt={currentCountry?.name || "Country flag"}
//                   className="w-6 h-4 mr-1"
//                 />
//                 <span>▼</span>
//               </div>
//               <input
//                 id="phoneNumber"
//                 type="tel"
//                 name="phoneNumber"
//                 value={formData.phoneNumber}
//                 onChange={handleChange}
//                 // placeholder={`+${currentCountry?.phonecode || "91"}`}
//                 className="w-full border border-gray-300 rounded-r-md p-2 border-l-0"
//               />
//             </div>
//             {errors.phoneNumber && (
//               <p className="text-sm text-red-500 mt-1">{errors.phoneNumber}</p>
//             )}
//           </div>
//         </div>

//         {/* Company Name */}
//         <div>
//           <label htmlFor="companyName" className="block mb-1">
//             Company Name (Optional)
//           </label>
//           <input
//             id="companyName"
//             type="text"
//             name="companyName"
//             value={formData.companyName}
//             onChange={handleChange}
//             placeholder="Add your company name"
//             className="w-full border border-gray-300 rounded-md p-2"
//           />
//         </div>

//         {/* Country/Region */}
//         <div>
//           <label htmlFor="country" className="block mb-1">
//             Country / Region<span className="text-red-500">*</span>
//           </label>
//           <div className="relative">
//             <select
//               id="country"
//               name="country"
//               value={formData.country}
//               onChange={handleChange}
//               className="w-full border border-gray-300 rounded-md p-2 appearance-none"
//             >
//               {countries.map((country) => (
//                 <option key={country.isoCode} value={country.isoCode}>
//                   {country.name}
//                 </option>
//               ))}
//             </select>
//             <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
//               <svg
//                 className="w-4 h-4 text-gray-400"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M19 9l-7 7-7-7"
//                 />
//               </svg>
//             </div>
//           </div>
//           {errors.country && (
//             <p className="text-sm text-red-500 mt-1">{errors.country}</p>
//           )}
//         </div>

//         {/* State and ZIP code */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label htmlFor="state" className="block mb-1">
//               States<span className="text-red-500">*</span>
//             </label>
//             <div className="relative">
//               <select
//                 id="state"
//                 name="state"
//                 value={formData.state}
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 rounded-md p-2 appearance-none"
//               >
//                 <option value="">Select State</option>
//                 {states.map((state) => (
//                   <option key={state.isoCode} value={state.isoCode}>
//                     {state.name}
//                   </option>
//                 ))}
//               </select>
//               <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
//                 <svg
//                   className="w-4 h-4 text-gray-400"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M19 9l-7 7-7-7"
//                   />
//                 </svg>
//               </div>
//             </div>
//             {errors.state && (
//               <p className="text-sm text-red-500 mt-1">{errors.state}</p>
//             )}
//           </div>
//           <div>
//             <label htmlFor="zipCode" className="block mb-1">
//               Zip Code<span className="text-red-500">*</span>
//             </label>
//             <input
//               id="zipCode"
//               type="text"
//               name="zipCode"
//               value={formData.zipCode}
//               onChange={handleChange}
//               placeholder="9878"
//               className="w-full border border-gray-300 rounded-md p-2"
//             />
//             {errors.zipCode && (
//               <p className="text-sm text-red-500 mt-1">{errors.zipCode}</p>
//             )}
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CheckoutForm;

export default function CheckoutForm() {
  return <div>CheckoutForm</div>;
}
