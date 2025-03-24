"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { authApi } from "@/lib/api/auth";
import { getToken } from "@/lib/utils/token";
import { User } from "@/types/api";

const UserContext = createContext<User | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = getToken();
    if (token) {
      authApi.getCurrentUser()
        .then((response) => {
          setUser(response);
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


  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}