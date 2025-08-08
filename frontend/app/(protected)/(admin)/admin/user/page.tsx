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
    status: "all",
    country: "",
    state: "",
  });
  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  const [processingUsers, setProcessingUsers] = useState<{
    [key: string]: { isApproving: boolean; isRejecting: boolean };
  }>({});
  const [availableCountries, setAvailableCountries] = useState<string[]>([]);
  const [availableStates, setAvailableStates] = useState<string[]>([]);

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
          value: "active",
        };
      } else if (user.seller?.approvalRequested && user.seller?.approved !== true) {
        return {
          status: "Pending Approval",
          textColor: "text-yellow-500",
          dotColor: "bg-yellow-500",
          value: "pending",
        };
      } else if (user.seller?.approved === false) {
        return {
          status: "Rejected",
          textColor: "text-red-500",
          dotColor: "bg-red-500",
          value: "rejected",
        };
      } else {
        return {
          status: "Inactive",
          textColor: "text-gray-500",
          dotColor: "bg-gray-500",
          value: "inactive",
        };
      }
    } else {
      return {
        status: "Active",
        textColor: "text-green-500",
        dotColor: "bg-green-500",
        value: "active",
      };
    }
  };

  const formatUserData = (users: User[]) => {
    return users.map((user) => {
      const status = getUserStatus(user);
      return {
        ...user,
        formattedRole:
          user.role === "SELLER"
            ? "Supplier"
            : user.role === "BUYER"
              ? "Buyer"
              : "Admin",
        status: {
          text: status.status,
          textColor: status.textColor,
          dotColor: status.dotColor,
          value: status.value,
        },
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
        ...(debouncedFilters.role !== "all" && { role: debouncedFilters.role }),
        ...(debouncedFilters.status !== "all" && { status: debouncedFilters.status }),
        ...(debouncedFilters.country && debouncedFilters.country !== "" && { country: debouncedFilters.country }),
        ...(debouncedFilters.state && debouncedFilters.state !== "" && { state: debouncedFilters.state }),
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

  // Fetch available countries and states for filter dropdowns
  const fetchFilterOptions = async () => {
    try {
      const countries = await userApi.getCountries();
      setAvailableCountries(countries || []);

      const states = await userApi.getStates();
      setAvailableStates(states || []);
    } catch (error) {
      console.error("Error fetching filter options:", error);
      // Set empty arrays as fallback
      setAvailableCountries([]);
      setAvailableStates([]);
    }
  };

  const handleApproveOrReject = async (
    userId: string,
    sellerId: string,
    approve: boolean
  ) => {
    try {
      setProcessingUsers(prev => ({
        ...prev,
        [userId]: {
          isApproving: approve,
          isRejecting: !approve,
        },
      }));

      // Replace with your actual API call
      // await userApi.approveOrRejectSeller(sellerId, approve);

      toast({
        title: "Success",
        description: `Seller ${approve ? 'approved' : 'rejected'} successfully.`,
        variant: "default",
      });

      // Refresh the data
      await fetchData();
    } catch (error) {
      console.error("Error processing seller:", error);
      toast({
        title: "Error",
        description: `Failed to ${approve ? 'approve' : 'reject'} seller. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setProcessingUsers(prev => {
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

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const handleSearch = (query: string) => {
    setSearch(query);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleFilterChange = (newFilters: { [key: string]: string }) => {
    console.log("Filter change received:", newFilters); // Debug log

    // Map the filter keys to match our state structure
    const mappedFilters = {
      role: newFilters.formattedRole || newFilters.role || filters.role,
      status: newFilters["status.value"] || newFilters.status || filters.status,
      country: newFilters.country !== undefined ? newFilters.country : filters.country,
      state: newFilters.state !== undefined ? newFilters.state : filters.state,
    };

    console.log("Mapped filters:", mappedFilters); // Debug log
    setFilters(mappedFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSortChange = (newSortBy: string, newSortOrder: string) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handlePageSizeChange = (size: number) => {
    setPagination(prev => ({ ...prev, size, page: 1 }));
  };

  const columns = [
    {
      header: "User Name",
      cell: (user: any) => (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={user.imageUrl || undefined} alt={user.name} />
            <AvatarFallback>
              {user.name?.substring(0, 2).toUpperCase() || "??"}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{user.name}</span>
        </div>
      ),
      accessorKey: "name",
      sortable: true,
    },
    {
      header: "Email",
      accessorKey: "email",
      sortable: true,
    },
    {
      header: "Role",
      accessorKey: "formattedRole",
      filterable: true,
      filterOptions: [
        { value: "all", label: "All Roles" },
        { value: "BUYER", label: "Buyer" },
        { value: "SELLER", label: "Supplier" },
        { value: "ADMIN", label: "Admin" },
      ],
      sortable: true,
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
      accessorKey: "status.value",
      filterable: true,
      filterOptions: [
        { value: "all", label: "All Statuses" },
        { value: "active", label: "Active" },
        { value: "pending", label: "Pending Approval" },
        { value: "rejected", label: "Rejected" },
        { value: "inactive", label: "Inactive" },
      ],
      sortable: true,
    },
    {
      header: "Country",
      accessorKey: "country",
      cell: (user: any) => user.country || "N/A",
      filterable: true,
      filterOptions: [
        { value: "", label: "All Countries" },
        ...availableCountries.map(country => ({
          value: country,
          label: country || "Unknown"
        }))
      ],
      sortable: true,
    },
    {
      header: "State",
      accessorKey: "state",
      cell: (user: any) => user.state || "N/A",
      filterable: true,
      filterOptions: [
        { value: "", label: "All States" },
        ...availableStates.map(state => ({
          value: state,
          label: state || "Unknown"
        }))
      ],
      sortable: true,
    },
    {
      header: "Created At",
      accessorKey: "createdAt",
      cell: (user: any) => new Date(user.createdAt).toLocaleDateString(),
      sortable: true,
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

            {user.role === "SELLER" &&
              user.approvalRequested &&
              user.seller?.approved !== true && (
                <>
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-green-600 text-white hover:bg-green-700 min-w-[90px]"
                    onClick={() =>
                      handleApproveOrReject(user.id, user.sellerId, true)
                    }
                    disabled={!!isProcessing}
                  >
                    {isApproving ? "Approving..." : "Approve"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-500 text-red-500 hover:bg-red-50 min-w-[90px]"
                    onClick={() =>
                      handleApproveOrReject(user.id, user.sellerId, false)
                    }
                    disabled={!!isProcessing}
                  >
                    {isRejecting ? "Rejecting..." : "Reject"}
                  </Button>
                </>
              )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="container min-w-[99%] mx-3 bg-white p-6 rounded-md shadow-lg">
      <EnhancedDataTable
        data={data}
        columns={columns}
        title="Users List"
        isLoading={loading}
        pageSize={pagination.size}
        currentPage={pagination.page}
        totalItems={pagination.total}
        totalPages={pagination.pages}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        searchValue={search}
        filters={filters}
        onRefresh={fetchData}
        searchPlaceholder="Search users by name, email, or company..."
        enableExport={false}
        enablePagination={true}
        enableSearch={true}
        enableFiltering={true}
        enableRefresh={true}
        initialSort={{ id: "createdAt", desc: true }}
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