// components/profile/skeletons/form-skeletons.tsx
"use client";

const SkeletonInput = ({
  className = "h-11",
  hasDescription = true,
}: {
  className?: string;
  hasDescription?: boolean;
}) => (
  <div className="space-y-2">
    <div className="h-4 bg-gray-300 rounded w-1/3"></div> {/* Label */}
    {hasDescription && (
      <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
    )}{" "}
    {/* Description line 1 */}
    {hasDescription && (
      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
    )}{" "}
    {/* Description line 2 */}
    <div className={`w-full bg-gray-200 rounded ${className}`}></div>
  </div>
);

const SkeletonTextarea = ({
  hasDescription = true,
}: {
  hasDescription?: boolean;
}) => (
  <div className="space-y-2">
    <div className="h-4 bg-gray-300 rounded w-1/3"></div> {/* Label */}
    {hasDescription && (
      <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
    )}
    {hasDescription && <div className="h-3 bg-gray-200 rounded w-2/3"></div>}
    <div className="w-full h-24 bg-gray-200 rounded"></div>
  </div>
);

const SkeletonMultiSelect = ({
  hasDescription = true,
}: {
  hasDescription?: boolean;
}) => (
  <div className="space-y-2">
    <div className="h-4 bg-gray-300 rounded w-1/3"></div> {/* Label */}
    {hasDescription && (
      <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
    )}
    {hasDescription && <div className="h-3 bg-gray-200 rounded w-2/3"></div>}
    <div className="w-full h-11 bg-gray-200 rounded"></div>
  </div>
);

const SkeletonSelect = ({
  hasDescription = true,
}: {
  hasDescription?: boolean;
}) => (
  <div className="space-y-2">
    <div className="h-4 bg-gray-300 rounded w-1/3"></div> {/* Label */}
    {hasDescription && (
      <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
    )}
    {hasDescription && <div className="h-3 bg-gray-200 rounded w-2/3"></div>}
    <div className="w-full h-11 bg-gray-200 rounded"></div>
  </div>
);

const SkeletonFileUpload = ({
  count = 1,
  grid = false,
  hasDescription = true,
}: {
  count?: number;
  grid?: boolean;
  hasDescription?: boolean;
}) => (
  <div className="space-y-2">
    <div className="h-4 bg-gray-300 rounded w-1/3"></div> {/* Label */}
    {hasDescription && (
      <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
    )}
    {hasDescription && <div className="h-3 bg-gray-200 rounded w-2/3"></div>}
    <div className={grid ? "grid grid-cols-3 gap-3" : "flex"}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-24 w-full bg-gray-200 rounded"></div>
      ))}
      {grid &&
        count < 3 && ( // Placeholder for upload button if grid and space allows
          <div className="h-24 w-full bg-gray-100 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
            <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
          </div>
        )}
      {!grid && ( // Placeholder for upload button if not grid
        <div className="h-24 w-24 bg-gray-100 border-2 border-dashed border-gray-300 rounded flex items-center justify-center ml-2">
          <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
        </div>
      )}
    </div>
    {hasDescription && (
      <div className="h-3 bg-gray-200 rounded w-full mt-1"></div>
    )}
    {hasDescription && <div className="h-3 bg-gray-200 rounded w-3/4"></div>}
  </div>
);

const SkeletonCheckboxGroup = ({
  itemCount = 3,
  hasDescription = true,
}: {
  itemCount?: number;
  hasDescription?: boolean;
}) => (
  <div className="space-y-2">
    <div className="h-5 bg-gray-300 rounded w-1/2 mb-1"></div> {/* Title */}
    {hasDescription && (
      <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
    )}{" "}
    {/* Description */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {Array.from({ length: itemCount }).map((_, i) => (
        <div key={i} className="flex items-center space-x-3">
          <div className="h-5 w-5 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      ))}
    </div>
  </div>
);

const SkeletonSwitch = ({
  hasDescription = true,
}: {
  hasDescription?: boolean;
}) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <div>
        <div className="h-4 bg-gray-300 rounded w-2/5 mb-1"></div> {/* Label */}
        {hasDescription && (
          <div className="h-3 bg-gray-200 rounded w-full"></div>
        )}{" "}
        {/* Description */}
      </div>
      <div className="h-6 w-11 bg-gray-200 rounded-full"></div> {/* Switch */}
    </div>
    {hasDescription && (
      <div className="h-3 bg-gray-200 rounded w-1/2 mt-1"></div>
    )}{" "}
    {/* Helper text */}
  </div>
);

export const BusinessInfoFormSkeleton = () => (
  <div className="space-y-8 animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
      <div className="space-y-6">
        <SkeletonInput />
        <SkeletonTextarea />
        <SkeletonInput />
        <SkeletonMultiSelect />
      </div>
      <div className="space-y-6">
        <SkeletonInput />
        <SkeletonMultiSelect />
        <SkeletonSelect />
      </div>
    </div>
  </div>
);

export const GoalsMetricsFormSkeleton = () => (
  <div className="space-y-8 animate-pulse">
    <SkeletonCheckboxGroup itemCount={6} />
    <SkeletonCheckboxGroup itemCount={6} />
    <SkeletonCheckboxGroup itemCount={6} />
    <div className="space-y-3">
      <div className="h-5 bg-gray-300 rounded w-1/3 mb-1"></div>{" "}
      {/* Agreement Title */}
      <div className="flex items-start space-x-3">
        <div className="h-5 w-5 bg-gray-200 rounded"></div>
        <div className="space-y-1 w-full">
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
      <div className="flex items-start space-x-3">
        <div className="h-5 w-5 bg-gray-200 rounded"></div>
        <div className="space-y-1 w-full">
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    </div>
  </div>
);

export const BusinessOverviewFormSkeleton = () => (
  <div className="space-y-8 animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
      <div className="space-y-6">
        <SkeletonFileUpload count={1} grid={false} /> {/* Logo */}
        <SkeletonInput hasDescription={false} /> {/* Name */}
        <SkeletonTextarea hasDescription={false} /> {/* Description */}
        <SkeletonInput hasDescription={false} /> {/* Website */}
        <SkeletonInput hasDescription={false} /> {/* Address */}
        <SkeletonMultiSelect hasDescription={false} /> {/* Type */}
        <SkeletonMultiSelect hasDescription={false} /> {/* Category */}
      </div>
      <div className="space-y-6">
        <SkeletonInput hasDescription={false} /> {/* Year Founded */}
        <SkeletonSelect hasDescription={false} /> {/* Team Size */}
        <SkeletonSelect hasDescription={false} /> {/* Revenue */}
        <SkeletonMultiSelect hasDescription={false} /> {/* Languages */}
        <SkeletonMultiSelect hasDescription={false} /> {/* Attributes */}
      </div>
    </div>
  </div>
);

export const CapabilitiesOperationsFormSkeleton = () => (
  <div className="space-y-8 animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
      <div className="space-y-6">
        <SkeletonMultiSelect /> {/* Services */}
        <SkeletonInput /> {/* MOQ */}
        <SkeletonSwitch /> {/* MOQ Flexibility */}
        <SkeletonMultiSelect /> {/* Production Model */}
      </div>
      <div className="space-y-6">
        <SkeletonMultiSelect /> {/* Production Countries */}
        <SkeletonSwitch /> {/* Provides Samples */}
        <SkeletonInput />{" "}
        {/* Sample Dispatch (conditionally shown, but good to have a placeholder) */}
        <SkeletonInput /> {/* Production Timeline */}
        <SkeletonFileUpload count={3} grid={true} /> {/* Factory Images */}
      </div>
    </div>
  </div>
);

export const ComplianceCredentialsFormSkeleton = () => (
  <div className="space-y-8 animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
      <div className="space-y-6">
        <SkeletonFileUpload count={1} grid={false} /> {/* Business Reg */}
        <SkeletonMultiSelect /> {/* Cert Types */}
        <SkeletonFileUpload count={3} grid={true} /> {/* Cert Docs */}
      </div>
      <div className="space-y-6">
        <SkeletonTextarea /> {/* Notable Clients */}
        <SkeletonFileUpload count={3} grid={true} /> {/* Client Logos */}
      </div>
    </div>
  </div>
);

export const BrandPresenceFormSkeleton = () => (
  <div className="space-y-8 animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
      <div className="space-y-6">
        <SkeletonFileUpload count={3} grid={true} /> {/* Project Images */}
        <SkeletonFileUpload count={1} grid={false} className="h-48" />{" "}
        {/* Video */}
      </div>
      <div className="space-y-6">
        <div className="space-y-3">
          {" "}
          {/* Social Media Links container */}
          <div className="h-4 bg-gray-300 rounded w-1/3 mb-1"></div>{" "}
          {/* Label */}
          <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>{" "}
          {/* Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
              <div className="h-11 w-full bg-gray-200 rounded"></div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
              <div className="h-11 w-full bg-gray-200 rounded"></div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
              <div className="h-11 w-full bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
        <SkeletonTextarea /> {/* Additional Notes */}
      </div>
    </div>
  </div>
);

export const FinalReviewFormSkeleton = () => (
  <div className="space-y-8 animate-pulse">
    {/* Alert Box Skeleton */}
    <div className="border rounded-md p-4 bg-gray-100">
      <div className="flex items-start gap-3">
        <div className="h-5 w-5 bg-gray-300 rounded-full mt-0.5 flex-shrink-0"></div>
        <div>
          <div className="h-5 bg-gray-300 rounded w-1/2 mb-1.5"></div>{" "}
          {/* Title */}
          <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>{" "}
          {/* Line 1 */}
          <div className="h-3 bg-gray-200 rounded w-5/6"></div> {/* Line 2 */}
        </div>
      </div>
    </div>

    {/* Accordion Skeletons */}
    <div className="space-y-4">
      {Array.from({ length: 3 }).map(
        (
          _,
          i // Simulate 3 accordion items
        ) => (
          <div key={i} className="border rounded-md">
            <div className="h-12 bg-gray-200 rounded-t-md flex items-center justify-between px-4">
              <div className="h-5 bg-gray-300 rounded w-1/3"></div>{" "}
              {/* Trigger title */}
              <div className="h-5 w-5 bg-gray-300 rounded-full"></div>{" "}
              {/* Icon */}
            </div>
            {/* Optionally, a light placeholder for content if it's typically visible or large */}
            {/* <div className="h-20 bg-gray-50 p-4 rounded-b-md"></div> */}
          </div>
        )
      )}
    </div>

    {/* Confirmation Checkbox Skeleton */}
    <div className="border-t pt-6">
      <div className="flex items-start space-x-3 mb-4">
        <div className="h-5 w-5 bg-gray-200 rounded"></div>
        <div className="space-y-1.5 w-full">
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
      {/* Submit Button Skeleton */}
      <div className="flex justify-end">
        <div className="h-10 w-40 bg-gray-300 rounded-md"></div>
      </div>
    </div>
  </div>
);
