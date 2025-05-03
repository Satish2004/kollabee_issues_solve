"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { authApi } from "@/lib/api/auth";
import { profileApi } from "@/lib/api/profile";

export const useProfileData = () => {
  const [profileData, setProfileData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [stepsToBeCompleted, setStepsToBeCompleted] = useState<number[]>([]);

  // Fetch initial profile data
  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await authApi.getCurrentUser();
        setProfileData(user);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
        toast.error("Failed to load user data");
        setIsLoading(false);
      }
    };
    getUser();
  }, []);

  const loadProfileCompletion = async () => {
    try {
      const response: any = await profileApi.getProfileCompletion();
      const allSteps = Array.from({ length: 13 }, (_, i) => i + 1);
      const nonCompletedSteps = allSteps.filter(
        (step) => !response.includes(step)
      );
      setStepsToBeCompleted(nonCompletedSteps);
    } catch (error) {
      console.error("Error loading profile completion:", error);
      toast.error("Failed to load profile completion status");
    }
  };

  // Helper function to check if data is effectively empty
  const isEmptyData = (data: any): boolean => {
    // If it's an object with a 'certificates' array, check if the array is empty
    if (data.certificates && Array.isArray(data.certificates)) {
      return data.certificates.length === 0;
    }

    // If it's an object with a 'selectedCategories' array, check if the array is empty
    if (data.selectedCategories && Array.isArray(data.selectedCategories)) {
      return data.selectedCategories.length === 0;
    }

    // For other types of data, check based on their specific structure
    switch (typeof data) {
      case "object":
        if (data === null) return true;
        if (Array.isArray(data)) return data.length === 0;

        // For objects, check if all values are empty
        return Object.values(data).every(
          (value) =>
            value === null ||
            value === "" ||
            (Array.isArray(value) && value.length === 0) ||
            (typeof value === "object" && isEmptyData(value))
        );

      case "string":
        return data.trim() === "";

      default:
        return false;
    }
  };

  return {
    profileData,
    setProfileData,
    isLoading,
    stepsToBeCompleted,
    setStepsToBeCompleted,
    loadProfileCompletion,
    isEmptyData,
  };
};
