import { Skeleton } from "@heroui/react";

const ProductCardSkeleton = ({ compact = false }: { compact?: boolean }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <Skeleton className="rounded-none">
        <div className={`w-full ${compact ? "h-32 sm:h-40" : "h-40 sm:h-52"}`} />
      </Skeleton>
      <div className="p-3 space-y-2">
        <Skeleton className="rounded-lg w-3/4">
          <div className="h-4" />
        </Skeleton>
        <Skeleton className="rounded-lg w-1/2">
          <div className="h-3" />
        </Skeleton>
        <div className="flex items-center justify-between mt-2">
          <Skeleton className="rounded-lg w-16">
            <div className="h-5" />
          </Skeleton>
          <Skeleton className="rounded-full w-8 h-8" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
