import { Skeleton } from "@heroui/react";
import ProductCardSkeleton from "./ProductCardSkeleton";

const HomePageSkeleton = () => {
  return (
    <div>
      {/* Hero Skeleton */}
      <section className="bg-linear-to-br from-green-50 via-emerald-50 to-lime-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 items-center">
            <div className="space-y-4">
              <Skeleton className="rounded-full w-40">
                <div className="h-7" />
              </Skeleton>
              <Skeleton className="rounded-lg w-full">
                <div className="h-14" />
              </Skeleton>
              <Skeleton className="rounded-lg w-3/4">
                <div className="h-6" />
              </Skeleton>
              <div className="flex gap-3 mt-4">
                <Skeleton className="rounded-xl w-32">
                  <div className="h-12" />
                </Skeleton>
                <Skeleton className="rounded-xl w-32">
                  <div className="h-12" />
                </Skeleton>
              </div>
            </div>
            <div className="hidden md:grid grid-cols-2 gap-3">
              <div className="space-y-3">
                <Skeleton className="rounded-2xl"><div className="h-44" /></Skeleton>
                <Skeleton className="rounded-2xl"><div className="h-36" /></Skeleton>
              </div>
              <div className="space-y-3 pt-6">
                <Skeleton className="rounded-2xl"><div className="h-36" /></Skeleton>
                <Skeleton className="rounded-2xl"><div className="h-44" /></Skeleton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar Skeleton */}
      <section className="bg-themeColor">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2 sm:gap-3 py-2">
                <Skeleton className="rounded-full w-8 h-8 sm:w-9 sm:h-9 bg-white/20" />
                <div className="space-y-1">
                  <Skeleton className="rounded-lg w-20 bg-white/20"><div className="h-3" /></Skeleton>
                  <Skeleton className="rounded-lg w-28 bg-white/20"><div className="h-2" /></Skeleton>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid Skeleton */}
      <section className="bg-gray-50 py-8 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 sm:mb-8">
            <Skeleton className="rounded-lg w-48"><div className="h-8" /></Skeleton>
            <Skeleton className="rounded-lg w-64 mt-2"><div className="h-4" /></Skeleton>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} compact />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePageSkeleton;
