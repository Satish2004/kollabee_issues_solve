"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Country, State, IState } from 'country-state-city';
import { profileApi } from "@/lib/api/profile";
import { User } from "@/types/api";

interface SellerProfileEditorProps {
  user: User;
}

export function SellerProfileEditor({ user }: SellerProfileEditorProps) {
  const router = useRouter();
  const [profile, setProfile] = useState({
    fullName: user.fullName || "",
    name: user.name || "",
    email: user.email || "",
    imageUrl: user.imageUrl || "",
    companyName: user.companyName || "",
    companyWebsite: user.companyWebsite || "",
    phoneNumber: user.phoneNumber || "",
    country: user.country || "",
    state: user.state || "",
  });
  const [saving, setSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Get all countries
  const countries = Country.getAllCountries();
  
  // Get states for selected country
  const [states, setStates] = useState<IState[]>([]);

  // Update states when country changes
  useEffect(() => {
    if (profile.country) {
      const countryData = countries.find(c => c.name === profile.country);
      if (countryData) {
        setStates(State.getStatesOfCountry(countryData.isoCode));
      }
    }
  }, [profile.country]);

  const handleProfileChange = (field: keyof typeof profile, value: string) => {
    setProfile((prev) => ({ 
      ...prev, 
      [field]: value,
      // Reset state if country changes
      ...(field === 'country' ? { state: '' } : {}),
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const response = await profileApi.uploadImage(file);
      setProfile(prev => ({ ...prev, imageUrl: response.data.imageUrl }));
      toast.success("Profile image updated successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to upload image");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await profileApi.updateProfile({
        name: profile.name,
        fullName: profile.fullName,
        email: profile.email,
        companyName: profile.companyName,
        companyWebsite: profile.companyWebsite,
        imageUrl: profile.imageUrl,
        phoneNumber: profile.phoneNumber,
        country: profile.country,
        state: profile.state,
      });
      
      toast.success("Profile updated successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Profile Settings</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image */}
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-32 h-32">
              <AvatarImage src={profile.imageUrl} alt={profile.name}/>
              <AvatarFallback>{profile.name?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex items-center space-x-4">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
                className="w-auto"
              />
              {isUploading && <span>Uploading...</span>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Company Information */}
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={profile.companyName}
                onChange={(e) => handleProfileChange("companyName", e.target.value)}
                placeholder="Your company name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyWebsite">Company Website</Label>
              <Input
                id="companyWebsite"
                value={profile.companyWebsite}
                onChange={(e) => handleProfileChange("companyWebsite", e.target.value)}
                placeholder="https://your-company.com"
              />
            </div>

            {/* Personal Information */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={profile.fullName}
                onChange={(e) => handleProfileChange("fullName", e.target.value)}
                placeholder="Your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => handleProfileChange("email", e.target.value)}
                placeholder="your.email@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={profile.phoneNumber}
                onChange={(e) => handleProfileChange("phoneNumber", e.target.value)}
                placeholder="+1-202-555-0118"
              />
            </div>

            {/* Location Information */}
            <div className="space-y-2">
              <Label htmlFor="country">Country/Region</Label>
              <Select
                value={profile.country}
                onValueChange={(value) => handleProfileChange("country", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.isoCode} value={country.name}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Select
                value={profile.state}
                onValueChange={(value) => handleProfileChange("state", value)}
                disabled={!profile.country}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state.isoCode} value={state.name}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={saving}>
            {saving ? "Saving changes..." : "Save changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
