import { Skeleton } from "@heroui/react";

const OrdersSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <Skeleton className="rounded-lg w-36 mb-4 sm:mb-6"><div className="h-7" /></Skeleton>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="rounded-full w-16 sm:w-20"><div className="h-7 sm:h-8" /></Skeleton>
        ))}
      </div>

      {/* Order cards */}
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 sm:p-5">
            <div className="flex items-center gap-2 sm:gap-4">
              <Skeleton className="rounded-full w-10 h-10" />
              <div className="flex-1 space-y-2">
                <Skeleton className="rounded-lg w-40"><div className="h-5" /></Skeleton>
                <Skeleton className="rounded-lg w-64"><div className="h-4" /></Skeleton>
              </div>
              <Skeleton className="rounded-lg w-5 h-5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersSkeleton;
