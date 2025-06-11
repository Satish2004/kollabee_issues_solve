import React from "react"

const Skeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200 ${className || ""}`}
      {...props}
    />
  )
}

export default function ProductCardSkeleton() {
  return (
    <div className="bg-white w-full rounded-2xl border border-gray-200 overflow-hidden">
      <div className="relative">
        {/* Product Image Skeleton */}
        <Skeleton className="w-full aspect-[4/3] bg-gray-200" />
        
        {/* Heart Button Skeleton */}
        <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3">
          <Skeleton className="w-6 h-6 sm:w-8 sm:h-8 rounded-full" />
        </div>
      </div>

      <div className="p-3 sm:p-4 space-y-3">
        {/* Rating Skeleton */}
        <div className="flex items-center justify-end">
          <Skeleton className="h-3 w-16" />
        </div>

        {/* Price Section Skeleton */}
        <div>
          <Skeleton className="h-6 w-20 mb-1" />
          <Skeleton className="h-3 w-24" />
        </div>

        {/* Seller Info Skeleton */}
        <div className="space-y-1">
          <Skeleton className="h-4 w-32" />
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-3 w-12" />
              <div className="flex items-center">
                <Skeleton className="w-3 h-2 sm:w-4 sm:h-3 mr-1" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <Skeleton className="h-3 w-16" />
          </div>
        </div>

        {/* Action Buttons Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>
    </div>
  )
} 