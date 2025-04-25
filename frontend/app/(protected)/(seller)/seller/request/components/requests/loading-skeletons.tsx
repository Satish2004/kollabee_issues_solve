import { Skeleton } from "@/components/ui/skeleton";
import { CardContent } from "@/components/ui/card";
import { Card } from "@/components/ui/card";
export const LoadingSkeletons = () => {
  return (
    <>
      {Array(3)
        .fill(0)
        .map((_, index) => (
          <Card key={index} className="mb-4 sm:mb-6 overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 border-b">
                <Skeleton className="w-8 h-8 sm:w-10 sm:h-10 rounded-full" />
                <div className="space-y-1 sm:space-y-2">
                  <Skeleton className="h-3 sm:h-4 w-24 sm:w-32" />
                  <Skeleton className="h-2 sm:h-3 w-16 sm:w-24" />
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <Skeleton className="h-5 sm:h-6 w-12 sm:w-16" />
                </div>
              </div>
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-48 lg:w-64 p-3 sm:p-4">
                  <Skeleton className="w-full aspect-square rounded-lg" />
                </div>
                <div className="flex-1 p-3 sm:p-4 space-y-2 sm:space-y-4">
                  <Skeleton className="h-5 sm:h-6 w-3/4" />
                  <Skeleton className="h-3 sm:h-4 w-full" />
                  <div className="grid grid-cols-2 gap-2 sm:gap-4">
                    <div className="space-y-1 sm:space-y-2">
                      <Skeleton className="h-2 sm:h-3 w-12 sm:w-16" />
                      <Skeleton className="h-3 sm:h-4 w-16 sm:w-20" />
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <Skeleton className="h-2 sm:h-3 w-12 sm:w-16" />
                      <Skeleton className="h-3 sm:h-4 w-16 sm:w-20" />
                    </div>
                  </div>
                  <div className="flex gap-2 sm:gap-3 pt-2">
                    <Skeleton className="h-7 sm:h-9 w-20 sm:w-24" />
                    <Skeleton className="h-7 sm:h-9 w-20 sm:w-24" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
    </>
  );
};
