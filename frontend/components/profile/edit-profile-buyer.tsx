// "use client";

// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useRouter } from "next/navigation";
// import { 
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Address, User } from "@prisma/client";
// import { updateUserProfile, upsertAddressAction, uploadUserImage } from "@/actions/profile";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { toast } from "sonner";
// import { Country, State, IState } from 'country-state-city';
// import { useQueryClient } from "@tanstack/react-query";

// interface BuyerProfileEditorProps {
//   user: User;
//   billingAddress?: Address | null;
//   shippingAddress?: Address | null;
// }

// export default function BuyerProfileEditor({
//   user,
//   billingAddress,
//   shippingAddress
// }: BuyerProfileEditorProps) {
//   const [profile, setProfile] = useState(user);
//   const [billing, setBilling] = useState(billingAddress || {
//     type: 'BILLING',
//     firstName: '',
//     lastName: '',
//     companyName: '',
//     address: '',
//     country: '',
//     state: '',
//     city: '',
//     postalCode: '',
//     email: '',
//     phoneNumber: '',
//   } as Address);
//   const [shipping, setShipping] = useState(shippingAddress || {
//     type: 'SHIPPING',
//     firstName: '',
//     lastName: '',
//     companyName: '',
//     address: '',
//     country: '',
//     state: '',
//     city: '',
//     postalCode: '',
//     email: '',
//     phoneNumber: '',
//   } as Address);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const router = useRouter();
//   const queryClient = useQueryClient();

//   // Get all countries
//   const countries = Country.getAllCountries();
  
//   // Get states for selected country
//   const [profileStates, setProfileStates] = useState<IState[]>([]);
//   const [billingStates, setBillingStates] = useState<IState[]>([]);
//   const [shippingStates, setShippingStates] = useState<IState[]>([]);

//   // Update states when country changes
//   useEffect(() => {
//     if (profile.country) {
//       const countryData = countries.find(c => c.name === profile.country);
//       if (countryData) {
//         setProfileStates(State.getStatesOfCountry(countryData.isoCode));
//       }
//     }
//   }, [profile.country]);

//   useEffect(() => {
//     if (billing.country) {
//       const countryData = countries.find(c => c.name === billing.country);
//       if (countryData) {
//         setBillingStates(State.getStatesOfCountry(countryData.isoCode));
//       }
//     }
//   }, [billing.country]);

//   useEffect(() => {
//     if (shipping.country) {
//       const countryData = countries.find(c => c.name === shipping.country);
//       if (countryData) {
//         setShippingStates(State.getStatesOfCountry(countryData.isoCode));
//       }
//     }
//   }, [shipping.country]);

//   const handleProfileChange = (field: keyof User, value: string) => {
//     setError(null);
//     setProfile((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleBillingChange = (field: keyof Address, value: string) => {
//     setError(null);
//     setBilling((prev) => ({
//       ...prev,
//       [field]: value,
//       // Reset state if country changes
//       ...(field === 'country' ? { state: '' } : {}),
//     }));
//   };

//   const handleShippingChange = (field: keyof Address, value: string) => {
//     setError(null);
//     setShipping((prev) => ({
//       ...prev,
//       [field]: value,
//       // Reset state if country changes
//       ...(field === 'country' ? { state: '' } : {}),
//     }));
//   };

//   const handleSaveProfile = async () => {
//     setSaving(true);
//     setError(null);
//     try {
//       await updateUserProfile(profile);
//       toast.success('Profile updated successfully')
//       router.refresh();
//     } catch (error) {
//       console.error("Error updating profile:", error);
//       setError("Failed to save changes. Please try again.");
//       toast.error('Failed to update profile')
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleSaveBilling = async () => {
//     setSaving(true);
//     setError(null);
//     try {
//       await upsertAddressAction(billing);
//       toast.success('Billing address updated successfully')
//       router.refresh();
//     } catch (error) {
//       console.error("Error updating billing address:", error);
//       setError("Failed to save changes. Please try again.");
//       toast.error('Failed to update billing address')
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleSaveShipping = async () => {
//     setSaving(true);
//     setError(null);
//     try {
//       await upsertAddressAction(shipping);
//       toast.success('Shipping address updated successfully')
//       router.refresh();
//     } catch (error) {
//       console.error("Error updating shipping address:", error);
//       setError("Failed to save changes. Please try again.");
//       toast.error('Failed to update shipping address')
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     try {
//       setIsUploading(true);
//       const updatedUser = await uploadUserImage(file);
//       if (updatedUser) {
//         toast.success("Profile picture updated successfully");
//         queryClient.invalidateQueries({ queryKey: ['user'] });
//         router.refresh();
//       }
//     } catch (error) {
//       console.error("Error uploading image:", error);
//       toast.error("Failed to upload image");
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button variant="outline">Edit Profile</Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[90vw] h-[90vh]">
//         <DialogHeader>
//           <DialogTitle>Account Settings</DialogTitle>
//         </DialogHeader>
//         <ScrollArea className="h-full w-full pr-4">
//           <div className="grid gap-6">
//             {/* Account Settings */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Account Setting</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex items-center space-x-8">
//                   <div className="flex flex-col items-center gap-4">
//                     <Avatar className="h-24 w-24">
//                       <AvatarImage src={user?.imageUrl || ''} alt={user?.name || 'User'} />
//                       <AvatarFallback>{profile?.name?.charAt(0)}</AvatarFallback>
//                     </Avatar>
//                     <div className="flex items-center gap-2">
//                       <Input
//                         type="file"
//                         accept="image/*"
//                         className="w-[200px]"
//                         onChange={handleImageUpload}
//                         disabled={isUploading}
//                       />
//                       {isUploading && <span className="text-sm text-muted-foreground">Uploading...</span>}
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-2 gap-4 flex-1">
//                     <div className="space-y-2">
//                       <Label htmlFor="displayName">Display name</Label>
//                       <Input
//                         id="displayName"
//                         value={profile.displayName || ''}
//                         onChange={(e) => handleProfileChange("displayName", e.target.value)}
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="username">Username</Label>
//                       <Input
//                         id="username"
//                         value={profile.name}
//                         onChange={(e) => handleProfileChange("name", e.target.value)}
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="fullName">Full Name</Label>
//                       <Input
//                         id="fullName"
//                         value={profile.fullName || ''}
//                         onChange={(e) => handleProfileChange("fullName", e.target.value)}
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="email">Email</Label>
//                       <Input
//                         id="email"
//                         type="email"
//                         value={profile.email}
//                         onChange={(e) => handleProfileChange("email", e.target.value)}
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="secondaryEmail">Secondary Email</Label>
//                       <Input
//                         id="secondaryEmail"
//                         type="email"
//                         value={profile.secondaryEmail || ''}
//                         onChange={(e) => handleProfileChange("secondaryEmail", e.target.value)}
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="phone">Phone Number</Label>
//                       <Input
//                         id="phone"
//                         type="tel"
//                         value={profile.phoneNumber || ''}
//                         onChange={(e) => handleProfileChange("phoneNumber", e.target.value)}
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="country">Country</Label>
//                       <Select
//                         value={profile.country || ''}
//                         onValueChange={(value) => handleProfileChange("country", value)}
//                       >
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select country" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {countries.map((country) => (
//                             <SelectItem key={country.isoCode} value={country.name}>
//                               {country.name}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="state">State</Label>
//                       <Select
//                         value={profile.state || ''}
//                         onValueChange={(value) => handleProfileChange("state", value)}
//                         disabled={!profile.country}
//                       >
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select state" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {profileStates.map((state) => (
//                             <SelectItem key={state.isoCode} value={state.name}>
//                               {state.name}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>
//                   </div>
//                 </div>
//                 <Button 
//                   className="mt-6" 
//                   onClick={handleSaveProfile} 
//                   disabled={saving}
//                 >
//                   Save changes
//                 </Button>
//               </CardContent>
//             </Card>

//             {/* Billing Address */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Billing Address</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="billingFirstName">First Name</Label>
//                     <Input
//                       id="billingFirstName"
//                       value={billing.firstName}
//                       onChange={(e) => handleBillingChange("firstName", e.target.value)}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="billingLastName">Last Name</Label>
//                     <Input
//                       id="billingLastName"
//                       value={billing.lastName}
//                       onChange={(e) => handleBillingChange("lastName", e.target.value)}
//                     />
//                   </div>
//                   <div className="space-y-2 col-span-2">
//                     <Label htmlFor="billingCompany">Company Name (Optional)</Label>
//                     <Input
//                       id="billingCompany"
//                       value={billing.companyName || ''}
//                       onChange={(e) => handleBillingChange("companyName", e.target.value)}
//                     />
//                   </div>
//                   <div className="space-y-2 col-span-2">
//                     <Label htmlFor="billingAddress">Address</Label>
//                     <Input
//                       id="billingAddress"
//                       value={billing.address}
//                       onChange={(e) => handleBillingChange("address", e.target.value)}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="billing-country">Country</Label>
//                     <Select
//                       value={billing.country || ''}
//                       onValueChange={(value) => handleBillingChange("country", value)}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select country" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {countries.map((country) => (
//                           <SelectItem key={country.isoCode} value={country.name}>
//                             {country.name}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="billing-state">State</Label>
//                     <Select
//                       value={billing.state || ''}
//                       onValueChange={(value) => handleBillingChange("state", value)}
//                       disabled={!billing.country}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select state" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {billingStates.map((state) => (
//                           <SelectItem key={state.isoCode} value={state.name}>
//                             {state.name}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="billingCity">City</Label>
//                     <Input
//                       id="billingCity"
//                       value={billing.city}
//                       onChange={(e) => handleBillingChange("city", e.target.value)}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="billingZip">Zip Code</Label>
//                     <Input
//                       id="billingZip"
//                       value={billing.postalCode}
//                       onChange={(e) => handleBillingChange("postalCode", e.target.value)}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="billingEmail">Email</Label>
//                     <Input
//                       id="billingEmail"
//                       type="email"
//                       value={billing.email}
//                       onChange={(e) => handleBillingChange("email", e.target.value)}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="billingPhone">Phone Number</Label>
//                     <Input
//                       id="billingPhone"
//                       type="tel"
//                       value={billing.phoneNumber}
//                       onChange={(e) => handleBillingChange("phoneNumber", e.target.value)}
//                     />
//                   </div>
//                 </div>
//                 <Button 
//                   className="mt-6" 
//                   onClick={handleSaveBilling} 
//                   disabled={saving}
//                 >
//                   Save changes
//                 </Button>
//               </CardContent>
//             </Card>

//             {/* Shipping Address */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Shipping Address</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="shippingFirstName">First Name</Label>
//                     <Input
//                       id="shippingFirstName"
//                       value={shipping.firstName}
//                       onChange={(e) => handleShippingChange("firstName", e.target.value)}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="shippingLastName">Last Name</Label>
//                     <Input
//                       id="shippingLastName"
//                       value={shipping.lastName}
//                       onChange={(e) => handleShippingChange("lastName", e.target.value)}
//                     />
//                   </div>
//                   <div className="space-y-2 col-span-2">
//                     <Label htmlFor="shippingCompany">Company Name (Optional)</Label>
//                     <Input
//                       id="shippingCompany"
//                       value={shipping.companyName || ''}
//                       onChange={(e) => handleShippingChange("companyName", e.target.value)}
//                     />
//                   </div>
//                   <div className="space-y-2 col-span-2">
//                     <Label htmlFor="shippingAddress">Address</Label>
//                     <Input
//                       id="shippingAddress"
//                       value={shipping.address}
//                       onChange={(e) => handleShippingChange("address", e.target.value)}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="shipping-country">Country</Label>
//                     <Select
//                       value={shipping.country || ''}
//                       onValueChange={(value) => handleShippingChange("country", value)}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select country" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {countries.map((country) => (
//                           <SelectItem key={country.isoCode} value={country.name}>
//                             {country.name}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="shipping-state">State</Label>
//                     <Select
//                       value={shipping.state || ''}
//                       onValueChange={(value) => handleShippingChange("state", value)}
//                       disabled={!shipping.country}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select state" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {shippingStates.map((state) => (
//                           <SelectItem key={state.isoCode} value={state.name}>
//                             {state.name}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="shippingCity">City</Label>
//                     <Input
//                       id="shippingCity"
//                       value={shipping.city}
//                       onChange={(e) => handleShippingChange("city", e.target.value)}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="shippingZip">Zip Code</Label>
//                     <Input
//                       id="shippingZip"
//                       value={shipping.postalCode}
//                       onChange={(e) => handleShippingChange("postalCode", e.target.value)}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="shippingEmail">Email</Label>
//                     <Input
//                       id="shippingEmail"
//                       type="email"
//                       value={shipping.email}
//                       onChange={(e) => handleShippingChange("email", e.target.value)}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="shippingPhone">Phone Number</Label>
//                     <Input
//                       id="shippingPhone"
//                       type="tel"
//                       value={shipping.phoneNumber}
//                       onChange={(e) => handleShippingChange("phoneNumber", e.target.value)}
//                     />
//                   </div>
//                 </div>
//                 <Button 
//                   className="mt-6" 
//                   onClick={handleSaveShipping} 
//                   disabled={saving}
//                 >
//                   Save changes
//                 </Button>
//               </CardContent>
//             </Card>
//             {error && (
//               <div className="text-red-500 text-center mt-4">
//                 {error}
//               </div>
//             )}
//           </div>
//         </ScrollArea>
//       </DialogContent>
//     </Dialog>
//   );
// }


export function EditProfileBuyer() {
  return <div>EditProfileBuyer</div>;
}
