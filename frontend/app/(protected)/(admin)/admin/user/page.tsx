"use client";

import { useEffect, useState } from "react";
import { userApi } from "../../../../../lib/api/user";
import { DataTable } from "@/components/data-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

// Define the user type based on the API response
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
  createdAt: string;
  updatedAt: string;
  lastLogin: string | null;
  seller: {
    id: string;
    approved: boolean | null;
    approvalRequested: boolean;
    approvalReqestAt: string | null;
    // Other seller fields
  } | null;
  buyer: {
    id: string;
    // Buyer fields
  } | null;
}

interface ApiResponse {
  users: User[];
  page: number;
  size: number;
  total: number;
  totalPages: number;
}

// Status indicator component
const StatusIndicator = ({
  status,
  textColor,
  dotColor,
}: {
  status: string;
  textColor: string;
  dotColor: string;
}) => {
  return (
    <div className="flex items-center gap-2">
      <div className={cn("h-2 w-2 rounded-full", dotColor)} />
      <span className={cn("font-medium", textColor)}>{status}</span>
    </div>
  );
};

const UserDashboardPage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<User[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    page: 1,
    size: 10,
  });
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filters, setFilters] = useState({
    role: "all",
    country: "all",
    state: "all",
  });
  // Track which users are being approved/rejected
  const [processingUsers, setProcessingUsers] = useState<{
    [key: string]: { isApproving: boolean; isRejecting: boolean };
  }>({});

  // Function to determine user status
  const getUserStatus = (user: User) => {
    if (user.role === "SELLER") {
      if (user.seller?.approved === true) {
        return {
          status: "Active",
          textColor: "text-green-500",
          dotColor: "bg-green-500",
        };
      } else if (user.seller?.approvalRequested && !user.seller?.approved) {
        return {
          status: "Pending Approval",
          textColor: "text-pink-500",
          dotColor: "bg-pink-500",
        };
      } else if (user.seller?.approved === false) {
        return {
          status: "Rejected",
          textColor: "text-red-500",
          dotColor: "bg-red-500",
        };
      } else {
        return {
          status: "Inactive",
          textColor: "text-pink-500",
          dotColor: "bg-pink-500",
        };
      }
    } else if (user.role === "BUYER") {
      // For buyers, we'll just show active for now
      return {
        status: "Active",
        textColor: "text-green-500",
        dotColor: "bg-green-500",
      };
    } else {
      return {
        status: "Active",
        textColor: "text-green-500",
        dotColor: "bg-green-500",
      }; // Default for admins
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = {
        pageNo: pagination.page,
        pageSize: pagination.size,
        sortBy: sortBy,
        sortOrder: sortOrder,
        search: search,
        ...filters,
      };
      const response = await userApi.getUsers(params);
      const responseData = response as ApiResponse;

      setData(responseData.users);
      setPagination({
        ...pagination,
        total: responseData.total,
        pages: responseData.totalPages,
        page: responseData.page,
        size: responseData.size,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to fetch users. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveOrReject = async (
    userId: string,
    sellerId: string,
    approve: boolean
  ) => {
    try {
      // Set the processing state for this user
      setProcessingUsers((prev) => ({
        ...prev,
        [userId]: {
          isApproving: approve,
          isRejecting: !approve,
        },
      }));

      await userApi.approveOrReject(approve, sellerId);

      toast({
        title: approve ? "Seller Approved" : "Seller Rejected",
        description: `The seller has been ${
          approve ? "approved" : "rejected"
        } successfully.`,
        variant: approve ? "default" : "destructive",
      });

      // Refresh data after approval/rejection
      fetchData();
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
      // Clear the processing state for this user
      setProcessingUsers((prev) => {
        const newState = { ...prev };
        delete newState[userId];
        return newState;
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination.page, pagination.size, sortBy, sortOrder, search, filters]);

  const handleSearch = (query: string) => {
    setSearch(query);
    setPagination({ ...pagination, page: 1 }); // Reset to first page on search
  };

  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, page });
  };

  const handleFilterChange = (newFilters: { [key: string]: string }) => {
    setFilters({ ...filters, ...newFilters });
    setPagination({ ...pagination, page: 1 }); // Reset to first page on filter change
  };

  const columns = [
    {
      header: "User Name",
      cell: (user: User) => (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={user.imageUrl || ""} alt={user.name} />
            <AvatarFallback>
              {user.name?.substring(0, 2).toUpperCase() || "UN"}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{user.name || "Unknown"}</span>
        </div>
      ),
      filterable: true,
    },
    {
      header: "Email",
      accessorKey: "email",
      searchable: true,
    },
    {
      header: "Role",
      cell: (user: User) => (
        <span>
          {user.role === "SELLER"
            ? "Supplier"
            : user.role === "BUYER"
            ? "Buyer"
            : "Admin"}
        </span>
      ),
      filterable: true,
    },
    {
      header: "Status",
      cell: (user: User) => {
        const status = getUserStatus(user);
        return (
          <StatusIndicator
            status={status.status}
            textColor={status.textColor}
            dotColor={status.dotColor}
          />
        );
      },
      filterable: true,
    },
    {
      header: "Action",
      cell: (user: User) => {
        const isProcessing = processingUsers[user.id];
        const isApproving = isProcessing?.isApproving;
        const isRejecting = isProcessing?.isRejecting;

        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" title="View Details">
              <Eye className="h-4 w-4" />
            </Button>

            {user.role === "SELLER" &&
              user.seller?.approvalRequested &&
              !user.seller?.approved && (
                <>
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-red-500 text-white hover:bg-red-600 min-w-[90px]"
                    onClick={() =>
                      handleApproveOrReject(
                        user.id,
                        user.seller?.id || "",
                        true
                      )
                    }
                    disabled={isProcessing}
                  >
                    {isApproving ? "Approving..." : "Approve"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-500 text-red-500 hover:bg-red-100 min-w-[90px]"
                    onClick={() =>
                      handleApproveOrReject(
                        user.id,
                        user.seller?.id || "",
                        false
                      )
                    }
                    disabled={isProcessing}
                  >
                    {isRejecting ? "Rejecting..." : "Disapprove"}
                  </Button>
                </>
              )}
          </div>
        );
      },
    },
  ];

  const filterOptions = {
    role: {
      label: "Role",
      options: [
        { label: "All", value: "all" },
        { label: "Supplier", value: "SELLER" },
        { label: "Buyer", value: "BUYER" },
        { label: "Admin", value: "ADMIN" },
      ],
    },
    country: {
      label: "Country",
      options: [
        { label: "All", value: "all" },
        { label: "United States", value: "US" },
        { label: "India", value: "IN" },
        { label: "United Kingdom", value: "UK" },
        // Add more countries as needed
      ],
    },
  };

  return (
    <main className="p-6 bg-gray-200 h-screen flex justify-center items-center">
      <div className="container mx-auto bg-white p-6 rounded-md shadow-lg ">
        <DataTable
          data={data}
          columns={columns}
          isLoading={loading}
          pageSize={pagination.size}
          currentPage={pagination.page}
          totalItems={pagination.total}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          searchValue={search}
          onRefresh={fetchData}
          filterOptions={filterOptions}
          activeFilters={filters}
          onFilterChange={handleFilterChange}
          searchPlaceholder="Search users by name or email..."
          enableExport={false}
          enablePagination={true}
          enableSearch={true}
          enableFiltering={true}
          enableRefresh={true}
          renderEmptyState={() => (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-10">
                <p className="text-muted-foreground">
                  No users found. Try adjusting your filters.
                </p>
              </TableCell>
            </TableRow>
          )}
        />
      </div>
    </main>
  );
};

export default UserDashboardPage;
