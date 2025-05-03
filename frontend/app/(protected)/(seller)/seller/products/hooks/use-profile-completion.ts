"use client";

import { useState, useEffect, useMemo } from "react";
import { profileApi } from "@/lib/api/profile";

export function useProfileCompletion() {
  const [profileCompletion, setProfileCompletion] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadProfileCompletion() {
      try {
        setIsLoading(true);
        setError(null);
        const response: any = await profileApi.getProfileCompletion();

        if (Array.isArray(response)) {
          setProfileCompletion(response);
        } else {
          console.error(
            "Invalid profile completion response format:",
            response
          );
          setProfileCompletion([]);
        }
      } catch (err) {
        console.error("Failed to load profile completion:", err);
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to load profile completion")
        );
        setProfileCompletion([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadProfileCompletion();
  }, []);

  const remainingSteps = useMemo(() => {
    const completedSet = new Set(profileCompletion);
    return Array.from({ length: 11 }, (_, i) => i + 1).filter(
      (step) => !completedSet.has(step)
    );
  }, [profileCompletion]);

  const isProfileComplete = useMemo(() => {
    return profileCompletion.length === 13;
  }, [profileCompletion]);

  return {
    profileCompletion,
    remainingSteps,
    isProfileComplete,
    isLoading,
    error,
  };
}
