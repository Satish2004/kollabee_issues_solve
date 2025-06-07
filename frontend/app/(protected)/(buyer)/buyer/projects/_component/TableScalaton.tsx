import { Skeleton } from "@/components/ui/skeleton";

export default function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <tr key={`skeleton-${index}`} className="border-b">
          <td className="py-3 px-4">
            <Skeleton className="h-6 w-40" />
          </td>
          <td className="py-3 px-4">
            <Skeleton className="h-6 w-16 rounded-md" />
          </td>
          <td className="py-3 px-4">
            <Skeleton className="h-6 w-24 rounded-md" />
          </td>
          <td className="py-3 px-4">
            <Skeleton className="h-6 w-32 rounded-md" />
          </td>
          <td className="py-3 px-4">
            <Skeleton className="h-6 w-4" />
          </td>
          <td className="py-3 px-4">
            <Skeleton className="h-6 w-16 rounded-md" />
          </td>
          <td className="py-3 px-4">
            <Skeleton className="h-6 w-24 rounded-md" />
          </td>
          <td className="py-3 px-4">
            <Skeleton className="h-6 w-20" />
          </td>
          <td className="py-3 px-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-6 w-16" />
            </div>
          </td>
          <td className="py-3 px-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}
