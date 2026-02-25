import { Skeleton } from "@heroui/react";

const CartSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <Skeleton className="rounded-lg w-48 mb-4 sm:mb-6"><div className="h-7" /></Skeleton>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 sm:p-4 flex gap-3 sm:gap-4 items-start">
              <Skeleton className="rounded-xl w-16 h-16 sm:w-20 sm:h-20 shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="rounded-lg w-40"><div className="h-5" /></Skeleton>
                <Skeleton className="rounded-lg w-28"><div className="h-3" /></Skeleton>
                <div className="flex items-center justify-between mt-3">
                  <Skeleton className="rounded-lg w-28"><div className="h-8" /></Skeleton>
                  <Skeleton className="rounded-lg w-16"><div className="h-6" /></Skeleton>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <Skeleton className="rounded-lg w-32"><div className="h-5" /></Skeleton>
            <div className="space-y-3">
              <Skeleton className="rounded-lg w-full"><div className="h-4" /></Skeleton>
              <Skeleton className="rounded-lg w-full"><div className="h-4" /></Skeleton>
              <Skeleton className="rounded-lg w-full"><div className="h-4" /></Skeleton>
            </div>
            <Skeleton className="rounded-xl w-full"><div className="h-12" /></Skeleton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSkeleton;
