"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { userApi } from "@/lib/api/user";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { countries } from "@/app/(auth)/signup/seller/onboarding/signup-form";
import { formatDate } from "@/lib/utils";

// Define types based on the provided schema
interface User {
  id: string;
  email: string;
  name: string;
  role: "BUYER" | "SELLER" | "ADMIN";
  companyName: string | null;
  displayName: string | null;
  country: string | null;
  state: string | null;
  address: string | null;
  imageUrl: string | null;
  companyWebsite: string | null;
  zipCode: string | null;
  phoneNumber: string | null;
  secondaryEmail: string | null;
  createdAt: string;
  updatedAt: string;
  lastLogin: string | null;
  seller?: {
    id: string;
    businessName: string | null;
    businessAddress: string | null;
    websiteLink: string | null;
    businessCategories: string[];
    productionServices: string[];
    manufacturingLocations: string[];
    teamSize: string | null;
    annualRevenue: string | null;
    minimumOrderQuantity: string | null;
    approved: boolean | null;
    approvalRequested: boolean;
    approvalReqestAt: string | null;
    certifications: Certification[];
    profileCompletion: number[];
  };
  buyer?: {
    id: string;
  };
  notifications: Notification[];
  addresses: Address[];
}

interface Certification {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  issueDate: string | null;
  issuerName: string | null;
  approved: boolean;
  createdAt: string;
}

interface Notification {
  id: string;
  userId: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

interface Address {
  id: string;
  firstName: string;
  lastName: string;
  companyName: string | null;
  address: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  email: string;
  phoneNumber: string;
  type: string;
}

const UserDetailsPage = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [processingApproval, setProcessingApproval] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const userId = pathname.split("/").slice(-1)[0];
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await userApi.getUserDetailsForAdmin(userId);

      
        setUser(response);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch user details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, toast]);

  const handleApproveOrReject = async (approve: boolean) => {
    if (!user?.seller?.id) return;

    try {
      setProcessingApproval(true);
      await userApi.approveOrReject(approve, user.seller.id);

      toast({
        title: approve ? "Seller Approved" : "Seller Rejected",
        description: `The seller has been ${
          approve ? "approved" : "rejected"
        } successfully.`,
        variant: approve ? "default" : "destructive",
      });

      // Refresh data
      const response = await userApi.getUserDetailsForAdmin(userId);
      setUser(response.user);
    } catch (error) {
      console.error("Error approving/rejecting seller:", error);
      toast({
        title: "Error",
        description: `Failed to ${
          approve ? "approve" : "reject"
        } seller. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setProcessingApproval(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center bg-white mb-6 h-16 rounded-md shadow-sm border px-4">
          <Button variant="ghost" className="flex items-center text-rose-600">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="animate-pulse h-10 w-40 bg-gray-200 rounded"></div>
        </div>
        <div className="animate-pulse bg-white rounded-md p-8">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-10 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center bg-white mb-6 h-16 rounded-md shadow-sm border px-4">
          <Button
            variant="ghost"
            className="flex items-center text-rose-600"
            onClick={() => router.push("/admin/user")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
        <div className="bg-white rounded-md p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">User Not Found</h2>
          <p className="text-gray-500 mb-6">
            The requested user could not be found or you don't have permission
            to view it.
          </p>
          <Button onClick={() => router.push("/admin/user")}>
            Return to Users List
          </Button>
        </div>
      </div>
    );
  }

  // Get first and last name
  const nameParts = user.name ? user.name.split(" ") : ["", ""];
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  return (
    <>
      <div className="container mx-auto py-6 px-4 w-full font-futura font-normal ">
        <div className="flex justify-between items-center bg-white mb-10 h-16 rounded-md shadow-sm border px-4">
          <Button
            variant="ghost"
            className="flex items-center text-rose-600"
            onClick={() => router.push("/admin/user")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {user.role === "SELLER" &&
            user.seller?.approvalRequested &&
            user.seller?.approved === false && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="border-rose-500 text-rose-500 hover:bg-rose-50"
                  onClick={() => handleApproveOrReject(false)}
                  disabled={processingApproval}
                >
                  {processingApproval ? "Processing..." : "Disapprove"}
                </Button>
                <Button
                  variant="default"
                  className="bg-rose-600 hover:bg-rose-700"
                  onClick={() => handleApproveOrReject(true)}
                  disabled={processingApproval}
                >
                  {processingApproval ? "Processing..." : "Approve"}
                </Button>
              </div>
            )}
        </div>

        <div className="container mx-auto py-6 px-4">
          <div className="bg-white rounded-md shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3">
              {/* Left sidebar */}
              <div className="p-8 border-r border-gray-100">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-xl font-bold">
                    {user.name || "Unnamed User"}
                  </h1>
                  <p className="text-gray-500 mb-6">
                    {user.role === "SELLER"
                      ? "Seller"
                      : user.role === "BUYER"
                      ? "Buyer"
                      : "Admin"}
                  </p>

                  <Avatar className="h-64 w-64 mb-6">
                    <AvatarImage src={user.image} alt={user.name || "User"} />
                    <AvatarFallback className="text-3xl bg-blue-500 text-white">
                      {user.name
                        ? user.name.substring(0, 2).toUpperCase()
                        : "UN"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="w-full">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Account Created</p>
                      <p className="font-medium">
                        {formatDate(user.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main content */}
              <div className="md:col-span-2 p-8">
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <div className="     p-2  ">
                        {firstName || "Add your First Name"}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <div className="     p-2  ">
                        {lastName || "Add your Last Name"}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="     p-2  ">
                      {user.email || "Add your Email"}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <div className="     p-2   flex items-center">
                      <span className="mr-2">
                        {countries.filter(
                          (country) => country.code === user.country
                        )[0]?.code ?? "+91"}
                      </span>
                      {user.phoneNumber || " "}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country / Region
                    </label>
                    <div className="     p-2  ">{user.country || "India"}</div>
                  </div>

                  <div className="grid grid-col grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        States
                      </label>
                      <div className="     p-2  ">{user.state || "xyz"}</div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Zip Code
                      </label>
                      <div className="     p-2  ">{user.zipCode || "9878"}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 p-6  ">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Last Login</p>
                  <p className="font-medium">{formatDate(user.lastLogin)}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Account Status</p>
                  <p className="font-medium">
                    {(user.role === "SELLER" && user.accountStatus) ?? "Active"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDetailsPage;
