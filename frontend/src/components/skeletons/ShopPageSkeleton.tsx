import { Skeleton } from "@heroui/react";
import ProductCardSkeleton from "./ProductCardSkeleton";

const ShopPageSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6">
        <div>
          <Skeleton className="rounded-lg w-36"><div className="h-7" /></Skeleton>
          <Skeleton className="rounded-lg w-28 mt-1"><div className="h-4" /></Skeleton>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Skeleton className="rounded-lg flex-1 sm:flex-initial sm:w-56"><div className="h-10" /></Skeleton>
          <Skeleton className="rounded-lg w-44 hidden sm:block"><div className="h-10" /></Skeleton>
        </div>
      </div>

      <div className="flex gap-4 sm:gap-6">
        {/* Sidebar */}
        <aside className="shrink-0 w-60 hidden lg:block">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-5">
            <Skeleton className="rounded-lg w-20"><div className="h-5" /></Skeleton>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="rounded-lg w-full"><div className="h-4" /></Skeleton>
            ))}
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPageSkeleton;
