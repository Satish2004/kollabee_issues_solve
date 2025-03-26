"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../lib/api/auth";
import { Router } from "next/router";
import { useRouter } from "next/navigation";

type AuthContextType = {
  user: any;
  loading: boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  // Fetch user data on initial load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true); // Start loading
        console.log("fetching user");
        const response: any = await authApi.getCurrentUser();
        console.log("response : ", response);
        if (response) {
          setUser(response);
        } else {
          setUser(null);
          router.push("/login");
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);
