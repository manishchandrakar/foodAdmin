import { Skeleton } from "@heroui/react";

const ProductDetailSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <Skeleton className="rounded-lg w-16 mb-4 sm:mb-6"><div className="h-9" /></Skeleton>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 mb-8 sm:mb-12">
        {/* Image */}
        <Skeleton className="rounded-3xl">
          <div className="aspect-square" />
        </Skeleton>

        {/* Info */}
        <div className="space-y-4">
          <Skeleton className="rounded-lg w-3/4"><div className="h-9" /></Skeleton>
          <Skeleton className="rounded-lg w-1/2"><div className="h-10" /></Skeleton>
          <Skeleton className="rounded-lg w-1/3"><div className="h-5" /></Skeleton>
          <div className="flex items-center gap-4 mt-4">
            <Skeleton className="rounded-lg w-8 h-8" />
            <Skeleton className="rounded-lg w-10"><div className="h-6" /></Skeleton>
            <Skeleton className="rounded-lg w-8 h-8" />
            <Skeleton className="rounded-lg w-24"><div className="h-5" /></Skeleton>
          </div>
          <div className="flex gap-3 mt-6">
            <Skeleton className="rounded-xl flex-1"><div className="h-11" /></Skeleton>
            <Skeleton className="rounded-xl flex-1"><div className="h-11" /></Skeleton>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-12">
        <div className="flex gap-6 border-b mb-6">
          <Skeleton className="rounded-lg w-24"><div className="h-6" /></Skeleton>
          <Skeleton className="rounded-lg w-20"><div className="h-6" /></Skeleton>
        </div>
        <div className="space-y-2">
          <Skeleton className="rounded-lg w-full"><div className="h-4" /></Skeleton>
          <Skeleton className="rounded-lg w-5/6"><div className="h-4" /></Skeleton>
          <Skeleton className="rounded-lg w-2/3"><div className="h-4" /></Skeleton>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSkeleton;
