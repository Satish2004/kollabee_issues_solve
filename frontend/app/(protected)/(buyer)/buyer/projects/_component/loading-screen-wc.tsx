import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";

export default function LoadingSkeleton() {
  return (
    <div className="p-6 space-y-6">
      {/* Header section */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Projects Overview</h1>
        <button className="px-4 py-2 rounded-md border border-pink-500 text-pink-500 flex items-center gap-2">
          <span>+</span>
          <span>Create Project</span>
        </button>
      </div>

      {/* Table controls */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button className="p-2 rounded border">
            <span className="sr-only">Filter</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" y1="21" x2="4" y2="14" />
              <line x1="4" y1="10" x2="4" y2="3" />
              <line x1="12" y1="21" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12" y2="3" />
              <line x1="20" y1="21" x2="20" y2="16" />
              <line x1="20" y1="12" x2="20" y2="3" />
              <line x1="1" y1="14" x2="7" y2="14" />
              <line x1="9" y1="8" x2="15" y2="8" />
              <line x1="17" y1="16" x2="23" y2="16" />
            </svg>
          </button>
          <button className="p-2 rounded border">
            <span className="sr-only">Refresh</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 2v6h-6" />
              <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
              <path d="M3 22v-6h6" />
              <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
            </svg>
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="pl-10 pr-4 py-2 border rounded-md w-64"
            disabled
          />
        </div>
      </div>

      {/* Table header */}
      <div className="border rounded-lg overflow-hidden">
        <div className="grid grid-cols-11 gap-4 p-4 border-b bg-gray-50 text-sm font-medium text-gray-500">
          <div className="col-span-1">Project Type</div>
          <div className="col-span-1">Supplier</div>
          <div className="col-span-1">Business Name</div>
          <div className="col-span-1">Timeline</div>
          <div className="col-span-1">Health</div>
          <div className="col-span-1">Payment Milestones</div>
          <div className="col-span-1">Shipping</div>
          <div className="col-span-1">Budget</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-2">Action</div>
        </div>

        {/* Loading rows */}
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-11 gap-4 p-4 border-b items-center text-sm"
          >
            <div className="col-span-1">
              <Skeleton className="h-4 w-full" />
            </div>
            <div className="col-span-1">
              <Skeleton className="h-6 w-16 rounded-md" />
            </div>
            <div className="col-span-1">
              <Skeleton className="h-6 w-20 rounded-md" />
            </div>
            <div className="col-span-1">
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-6 rounded-md" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
            <div className="col-span-1">
              <Skeleton className="h-4 w-4" />
            </div>
            <div className="col-span-1">
              <Skeleton className="h-6 w-16 rounded-md" />
            </div>
            <div className="col-span-1">
              <Skeleton className="h-6 w-24 rounded-md" />
            </div>
            <div className="col-span-1">
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="col-span-1">
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
            <div className="col-span-2 flex gap-2 justify-end">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
