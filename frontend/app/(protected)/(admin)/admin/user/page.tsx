"use client";

import { useEffect, useState } from "react";
import { userApi } from "../../../../../lib/api/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/app/(protected)/(seller)/seller/products/hooks/use-debounce";
import { EnhancedDataTable } from "../../../../../components/data-table/enhanced-data-table";
import { useRouter } from "next/navigation";

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
  } | null;
  buyer: {
    id: string;
  } | null;
}

interface ApiResponse {
  users: User[];
  page: number;
  size: number;
  total: number;
  totalPages: number;
}

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
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filters, setFilters] = useState({
    role: "all",
    country: "all",
    state: "all",
  });
  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  // Track which users are being approved/rejected
  const [processingUsers, setProcessingUsers] = useState<{
    [key: string]: { isApproving: boolean; isRejecting: boolean };
  }>({});

  const router = useRouter();

  // Debounce search and filters
  useDebounce(() => setDebouncedSearch(search), 500, [search]);
  useDebounce(() => setDebouncedFilters(filters), 500, [filters]);

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

  const formatUserData = (users: User[]) => {
    return users.map((user) => {
      const status = getUserStatus(user);
      return {
        id: user.id,
        name: user.name || "Unknown",
        email: user.email,
        role:
          user.role === "SELLER"
            ? "Supplier"
            : user.role === "BUYER"
            ? "Buyer"
            : "Admin",
        status: {
          text: status.status,
          textColor: status.textColor,
          dotColor: status.dotColor,
        },
        imageUrl: user.imageUrl || null,
        sellerId: user.seller?.id || null,
        approvalRequested: user.seller?.approvalRequested || false,
        approved: user.seller?.approved || false,
      };
    });
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = {
        pageNo: pagination.page,
        pageSize: pagination.size,
        sortBy: sortBy,
        sortOrder: sortOrder,
        search: debouncedSearch,
        ...debouncedFilters,
      };
      const response = await userApi.getUsers(params);
      const responseData = response as ApiResponse;

      setData(formatUserData(responseData.users));
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
  }, [
    pagination.page,
    pagination.size,
    sortBy,
    sortOrder,
    debouncedSearch,
    debouncedFilters,
  ]);

  const handleSearch = (query: string) => {
    setSearch(query);
    setPagination({ ...pagination, page: 1 }); // Reset to first page on search
  };

  const handleFilterChange = (newFilters: { [key: string]: string }) => {
    setFilters({ ...filters, ...newFilters });
    setPagination({ ...pagination, page: 1 }); // Reset to first page on filter change
  };

  const handlePageChange = async (page: number) => {
    setPagination({ ...pagination, page: page });
  };

  const columns = [
    {
      header: "User Name",
      cell: (user: any) => (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={user.imageUrl || null} alt={user.name} />
            <AvatarFallback>
              {user.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{user.name}</span>
        </div>
      ),
      accessorKey: "name",
      filterable: true,
    },
    {
      header: "Email",
      accessorKey: "email",
      filtarable: true,
      searchable: true,
    },
    {
      header: "Role",
      accessorKey: "role",
      filterable: true,
    },
    {
      header: "Status",
      cell: (user: any) => (
        <StatusIndicator
          status={user.status.text}
          textColor={user.status.textColor}
          dotColor={user.status.dotColor}
        />
      ),
    },
    {
      header: "Action",
      cell: (user: any) => {
        const isProcessing = processingUsers[user.id];
        const isApproving = isProcessing?.isApproving;
        const isRejecting = isProcessing?.isRejecting;

        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              title="View Details"
              onClick={() => router.push(`/admin/user/${user.id}`)}
            >
              <Eye className="h-4 w-4" />
            </Button>

            {user.role === "Supplier" &&
              user.approvalRequested &&
              !user.approved && (
                <>
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-red-500 text-white hover:bg-red-600 min-w-[90px]"
                    onClick={() =>
                      handleApproveOrReject(user.id, user.sellerId, true)
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
                      handleApproveOrReject(user.id, user.sellerId, false)
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

  return (
    <div className="container  min-w-[99%] mx-3 bg-white p-6 rounded-md shadow-lg  ">
      <EnhancedDataTable
        data={data}
        columns={columns}
        title="Users List"
        isLoading={loading}
        pageSize={pagination.size}
        currentPage={pagination.page}
        totalItems={pagination.total}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        searchValue={search}
        onRefresh={fetchData}
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
  );
};

export default UserDashboardPage;
