"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Country, State, IState } from "country-state-city";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CloudUpload, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { profileApi } from "@/lib/api/profile";
import { User } from "@/types/api";

interface AccountFormProps {
  userDetails: User;
}

export function AccountForm({ userDetails }: AccountFormProps) {
  const [imagePreview, setImagePreview] = useState(userDetails.imageUrl);
  const [saving, setSaving] = useState(false);
  const countries = Country.getAllCountries();
  const [states, setStates] = useState<IState[]>([]);

  const form = useForm<User>({
    defaultValues: {
      ...userDetails,
      imageUrl: userDetails.imageUrl || "",
    },
  });

  // Watch for country changes to update states
  const selectedCountry = form.watch("country");
  if (selectedCountry) {
    const countryData = countries.find((c) => c.name === selectedCountry);
    if (countryData) {
      const countryStates = State.getStatesOfCountry(countryData.isoCode);
      if (JSON.stringify(countryStates) !== JSON.stringify(states)) {
        setStates(countryStates);
      }
    }
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const response = await profileApi.uploadImage(file);
      setImagePreview(response.data.imageUrl);
      form.setValue("imageUrl", response.data.imageUrl);
      toast.success("Profile picture updated successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    }
  };

  const handleImageDelete = () => {
    setImagePreview("");
    form.setValue("imageUrl", "");
  };

  const onSubmit = async (data: User) => {
    setSaving(true);
    try {
      const updateData: any = {
        name: data.name || undefined,
        fullName: data.fullName || undefined,
        email: data.email || undefined,
        companyName: data.companyName || undefined,
        companyWebsite: data.companyWebsite || undefined,
        imageUrl: data.imageUrl || undefined,
        phoneNumber: data.phoneNumber || undefined,
        country: data.country || undefined,
        state: data.state || undefined,
      };
      await profileApi.updateProfile(updateData);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
      <div className="flex w-full gap-4 items-center">
        <div className="flex flex-col items-center space-y-4 max-w-[500px] min-w-[400px]">
          <div className="relative h-48 w-48">
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="Profile"
                className="rounded-full object-cover"
                fill
                priority
              />
            ) : (
              <div className="size-full rounded-full bg-slate-200 flex items-center justify-center text-2xl">
                {userDetails?.name?.[0]?.toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex items-center gap-2 text-[#e00261]"
              onClick={() => document.getElementById("imageInput")?.click()}
            >
              <CloudUpload className="h-4 w-4" />
              Change
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex items-center gap-2 text-[#ffbe2d]"
              onClick={handleImageDelete}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
            <input
              id="imageInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        </div>

        {/* Form fields */}
        <div className="space-y-2 flex-1 max-w-[600px]">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input {...form.register("name")} className="bg-[#fcfcfc]" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input {...form.register("email")} type="email" className="bg-[#fcfcfc]" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <PhoneInput
                international
                defaultCountry="US"
                value={form.watch("phoneNumber")}
                onChange={(value) => form.setValue("phoneNumber", value || "")}
                className="flex h-10 w-full rounded-md border border-input bg-[#fcfcfc] px-3 py-2"
              />
            </div>
          </div>

          {/* Company Info */}
          <div className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input {...form.register("companyName")} className="bg-[#fcfcfc]" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyWebsite">Company Website</Label>
              <Input {...form.register("companyWebsite")} className="bg-[#fcfcfc]" />
            </div>
          </div>

          {/* Location Info */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select
                value={form.watch("country")}
                onValueChange={(value) => form.setValue("country", value)}
              >
                <SelectTrigger className="bg-[#fcfcfc]">
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
                value={form.watch("state")}
                onValueChange={(value) => form.setValue("state", value)}
                disabled={!selectedCountry}
              >
                <SelectTrigger className="bg-[#fcfcfc]">
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

          <div className="flex justify-end mt-6">
            <Button
              type="submit"
              className="bg-gradient-to-r from-[#e00261] to-[#ffbe2d] text-white hover:opacity-90"
              disabled={saving}
            >
              {saving ? "Saving Changes..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
