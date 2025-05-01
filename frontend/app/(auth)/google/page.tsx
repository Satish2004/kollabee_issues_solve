"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { setToken } from "@/lib/utils/token";
import Cookies from "js-cookie";
import { error } from "console";
import { Button } from "@/components/ui/button";

export default function GoogleRedirectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    const role = searchParams.get("role");
    const errorMessage = searchParams.get("error");

    setErrorMessage(errorMessage || "");

    // console.log("Google redirect params:", {
    //   token,
    //   role,
    //   allParams: Object.fromEntries(searchParams.entries()),
    // });

    if (token && token !== "undefined") {
      // Store the token
      setToken(token);
      localStorage.setItem("token", token);
      Cookies.set("token", token, { expires: 7 }); // Token expires in 7 days

      toast.success("Signed in successfully with Google");

      // Redirect based on role
      if (role === "ADMIN") {
        router.push("/admin");
      } else if (role === "BUYER") {
        router.push("/buyer");
      } else if (role === "SELLER") {
        router.push("/seller");
      } else {
        // Default redirect if role is not specified
        router.push("/");
      }
    }

    setIsLoading(false);
  }, [router, searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center">
        {isLoading && (
          <div className="mt-4">
            <p className="text-gray-500">Loading...</p>
          </div>
        )}
        {errorMessage && (
          <div className="mt-4">
            <p className="text-red-500">{errorMessage}</p>

            <Button onClick={() => router.push("/login")}>Go to Login</Button>
          </div>
        )}
      </div>
    </div>
  );
}
