"use client";

import { Card, CardContent } from "@/components/ui/card";
import React from "react";

const SkeletonBlock = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
);

const RequestCardSkeleton = () => (
  <div className="w-full mx-auto rounded-lg overflow-hidden mb-4 sm:mb-6">
    {/* Header */}
    <div className="flex items-center gap-2 sm:gap-3 p-1 border-2 rounded-[10px] border-gray-200">
      <SkeletonBlock className="w-8 h-8 sm:w-10 sm:h-10 rounded" />{" "}
      {/* Avatar */}
      <SkeletonBlock className="h-5 w-24 sm:w-32" /> {/* Buyer Name */}
      <div className="flex items-center gap-1 ml-auto">
        <SkeletonBlock className="w-6 h-6 sm:w-7 sm:h-7 rounded-full" />{" "}
        {/* Flag */}
        <SkeletonBlock className="h-4 w-5 sm:w-6" /> {/* Country Code */}
      </div>
    </div>

    <div className="flex flex-col md:flex-row mt-2">
      {/* Product Image */}
      <div className="w-full md:w-60 lg:w-72 h-40 sm:h-48 md:h-auto flex-shrink-0">
        <SkeletonBlock className="w-full h-full rounded-xl" />
      </div>

      {/* Product Details */}
      <div className="flex-1 p-3 sm:p-4">
        {/* Breadcrumb */}
        <div className="flex items-center text-gray-500 text-xs sm:text-sm font-medium mb-2 sm:mb-4 flex-wrap gap-x-1">
          <SkeletonBlock className="h-3 w-24" />
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-200 rounded-full"></div>
          <SkeletonBlock className="h-3 w-28 hidden xs:inline-block" />
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-200 rounded-full hidden xs:inline-block"></div>
          <SkeletonBlock className="h-3 w-20 hidden sm:inline-block" />
        </div>

        {/* Product Title */}
        <SkeletonBlock className="h-7 sm:h-8 md:h-9 w-3/4 sm:w-2/3 mb-2 sm:mb-4" />

        {/* Product Tags */}
        <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-6">
          <SkeletonBlock className="h-6 w-20 sm:w-24 rounded-[5px] px-2 sm:px-4 py-1" />
          <SkeletonBlock className="h-6 w-20 sm:w-24 rounded-[5px] px-2 sm:px-4 py-1" />
          <SkeletonBlock className="h-6 w-32 sm:w-40 rounded-[5px] px-2 sm:px-4 py-1" />
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3 mb-4">
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-gray-100 p-2 rounded space-y-1">
                <SkeletonBlock className="h-3 w-1/2" />
                <SkeletonBlock className="h-4 w-3/4" />
              </div>
            ))}
          </div>
          <SkeletonBlock className="w-full h-10 rounded-xl py-2" />{" "}
          {/* View Details Button */}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <div className="w-full border-collapse">
            {/* Table Header */}
            <div className="bg-gray-100 flex rounded-t-xl">
              <SkeletonBlock className="flex-1 p-2 sm:p-3 h-10" />
              <SkeletonBlock className="flex-1 p-2 sm:p-3 h-10" />
              <SkeletonBlock className="flex-1 p-2 sm:p-3 h-10" />
              <SkeletonBlock className="flex-1 p-2 sm:p-3 h-10" />
              <SkeletonBlock className="flex-1 p-2 sm:p-3 h-10" />
            </div>
            {/* Table Body Row */}
            <div className="border-t border-gray-200 flex">
              <SkeletonBlock className="flex-1 p-2 sm:p-3 h-12" />
              <SkeletonBlock className="flex-1 p-2 sm:p-3 h-12" />
              <SkeletonBlock className="flex-1 p-2 sm:p-3 h-12" />
              <SkeletonBlock className="flex-1 p-2 sm:p-3 h-12" />
              <div className="flex-1 p-2 sm:p-3 flex items-center">
                <SkeletonBlock className="h-7 w-16 sm:w-20 rounded-xl" />{" "}
                {/* View Button */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ManufacturingCardSkeleton = () => (
  <Card className="mb-4 sm:mb-6 overflow-hidden max-w-full animate-pulse">
    <CardContent className="p-0">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 border-b">
        <SkeletonBlock className="w-8 h-8 sm:w-10 sm:h-10 rounded-full" />{" "}
        {/* Avatar */}
        <div className="overflow-hidden flex-grow space-y-1">
          <SkeletonBlock className="h-4 w-3/5 sm:w-1/2" /> {/* Name */}
          <SkeletonBlock className="h-3 w-2/5 sm:w-1/3" /> {/* Date */}
        </div>
        <div className="flex items-center gap-1 ml-auto">
          <SkeletonBlock className="w-6 h-6 sm:w-7 sm:h-7 rounded-full" />{" "}
          {/* Flag */}
          <SkeletonBlock className="h-4 w-5 sm:w-6" /> {/* Country Code */}
        </div>
        <SkeletonBlock className="h-5 w-16 sm:w-20 rounded-md px-1.5 sm:px-2.5 py-0.5" />{" "}
        {/* Badge */}
      </div>

      <div className="flex flex-col">
        {/* Project Details Skeleton */}
        <div className="p-3 sm:p-4 border-b">
          <SkeletonBlock className="h-5 w-40 mb-3 sm:mb-4" />{" "}
          {/* Section Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 w-full">
            {[...Array(3)].map((_, i) => (
              <div key={`detail-${i}`} className="space-y-1">
                <SkeletonBlock className="h-3 w-1/3" /> {/* Label */}
                <SkeletonBlock className="h-4 w-2/3" /> {/* Value */}
              </div>
            ))}
            <div className="space-y-1">
              {" "}
              {/* MOQ */}
              <SkeletonBlock className="h-3 w-1/2" />
              <SkeletonBlock className="h-4 w-1/3" />
            </div>
            <div className="md:col-span-2 space-y-1">
              <SkeletonBlock className="h-3 w-1/4" /> {/* Services Label */}
              <div className="flex flex-wrap gap-1 sm:gap-2 mt-1">
                <SkeletonBlock className="h-5 w-20 rounded-md" />
                <SkeletonBlock className="h-5 w-24 rounded-md" />
              </div>
            </div>
          </div>
        </div>

        {/* Product Specifications Skeleton */}
        <div className="p-3 sm:p-4 border-b">
          <SkeletonBlock className="h-5 w-48 mb-2 sm:mb-3" />{" "}
          {/* Section Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={`spec-${i}`} className="space-y-1">
                <SkeletonBlock className="h-3 w-2/5" /> {/* Label */}
                <SkeletonBlock className="h-4 w-3/5" /> {/* Value */}
              </div>
            ))}
          </div>
        </div>

        {/* Project Timeline Skeleton */}
        <div className="p-3 sm:p-4 border-b">
          <SkeletonBlock className="h-5 w-36 mb-2 sm:mb-3" />{" "}
          {/* Section Title */}
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <SkeletonBlock className="h-7 w-32 rounded-md px-2 sm:px-3 py-1" />
            <SkeletonBlock className="h-7 w-32 rounded-md px-2 sm:px-3 py-1" />
          </div>
        </div>

        {/* Project Milestones Skeleton */}
        <div className="p-3 sm:p-4 border-b">
          <SkeletonBlock className="h-5 w-40 mb-2 sm:mb-3" />{" "}
          {/* Section Title */}
          <div className="space-y-3 sm:space-y-4">
            {[...Array(1)].map(
              (
                _,
                i // Assuming 1-2 milestones for skeleton
              ) => (
                <div
                  key={`milestone-${i}`}
                  className="border rounded-lg p-2 sm:p-3"
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="overflow-hidden flex-grow space-y-1 mr-2">
                      <SkeletonBlock className="h-4 w-3/4" /> {/* Name */}
                      <SkeletonBlock className="h-3 w-full" />{" "}
                      {/* Desc line 1 */}
                      <SkeletonBlock className="h-3 w-5/6" />{" "}
                      {/* Desc line 2 */}
                    </div>
                    <SkeletonBlock className="h-5 w-12 rounded-md shrink-0" />{" "}
                    {/* Badge */}
                  </div>
                  <SkeletonBlock className="h-3 w-1/3" /> {/* Due Date */}
                </div>
              )
            )}
          </div>
        </div>

        {/* Buyer Contact Info Skeleton */}
        <div className="p-3 sm:p-4 border-b">
          <SkeletonBlock className="h-5 w-52 mb-2 sm:mb-3" />{" "}
          {/* Section Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
            <div className="space-y-1">
              <SkeletonBlock className="h-3 w-1/4" /> {/* Label */}
              <SkeletonBlock className="h-4 w-1/2" /> {/* Value */}
            </div>
            <div className="space-y-1">
              <SkeletonBlock className="h-3 w-1/4" /> {/* Label */}
              <SkeletonBlock className="h-4 w-1/2" /> {/* Value */}
            </div>
          </div>
        </div>

        {/* Action buttons Skeleton */}
        <div className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <SkeletonBlock className="h-8 sm:h-10 w-full sm:w-40 rounded-md" />
            <SkeletonBlock className="h-8 sm:h-10 w-full sm:w-40 rounded-md" />
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

interface LoadingSkeletonsProps {
  type?: "product" | "manufacturing";
  count?: number;
}

export const LoadingSkeletonsTest = ({
  type = "product",
  count = 3,
}: LoadingSkeletonsProps) => {
  console.log("ut uis rebnder ");
  const SkeletonComponent =
    type === "manufacturing" ? ManufacturingCardSkeleton : RequestCardSkeleton;
  return (
    <div className="space-y-4 sm:space-y-8">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonComponent key={index} />
      ))}
    </div>
  );
};

export const LoadingSkeletons = React.memo(
  LoadingSkeletonsTest,
  (prevProps, nextProps) => {
    return (
      prevProps.type === nextProps.type && prevProps.count === nextProps.count
    );
  }
);
