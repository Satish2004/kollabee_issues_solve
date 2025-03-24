// hooks/useRole.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../contexts/auth-context";

export const useRole = (allowedRole) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false); // Track if the component is mounted

  useEffect(() => {
    setIsMounted(true); // Set isMounted to true after the component mounts
  }, []);

  useEffect(() => {
    if (isMounted && !loading && !user) {
      // Redirect to login if user is not authenticated
      router.push("/login");
    } else if (isMounted && !loading && user?.role !== allowedRole) {
      // Redirect to unauthorized page if user role doesn't match
      router.push("/unauthorized");
    }
  }, [user, loading, allowedRole, router, isMounted]);

  // Return whether the user has the allowed role
  return user?.role === allowedRole;
};