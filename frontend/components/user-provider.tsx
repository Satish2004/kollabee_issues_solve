"use client";

import { useEffect, useState } from "react";
import { authApi } from "@/lib/api/auth";
import { getToken } from "@/lib/utils/token";
import { User } from "@/types/api";

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = getToken();
    if (token) {
      authApi.getCurrentUser()
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          console.error('Failed to fetch user:', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}