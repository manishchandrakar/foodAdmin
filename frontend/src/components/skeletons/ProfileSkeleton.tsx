import { Skeleton } from "@heroui/react";

const ProfileSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <Skeleton className="rounded-lg w-36 mb-4 sm:mb-6"><div className="h-7" /></Skeleton>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
            <Skeleton className="rounded-full w-20 h-20 mx-auto mb-4" />
            <Skeleton className="rounded-lg w-32 mx-auto"><div className="h-6" /></Skeleton>
            <Skeleton className="rounded-lg w-40 mx-auto mt-2"><div className="h-4" /></Skeleton>
            <Skeleton className="rounded-full w-20 mx-auto mt-2"><div className="h-6" /></Skeleton>
            <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-gray-100">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="text-center">
                  <Skeleton className="rounded-lg w-10 mx-auto"><div className="h-5" /></Skeleton>
                  <Skeleton className="rounded-lg w-12 mx-auto mt-1"><div className="h-3" /></Skeleton>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <Skeleton className="rounded-lg w-44 mb-5"><div className="h-5" /></Skeleton>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="rounded-full w-9 h-9" />
                  <div className="space-y-1">
                    <Skeleton className="rounded-lg w-20"><div className="h-3" /></Skeleton>
                    <Skeleton className="rounded-lg w-36"><div className="h-4" /></Skeleton>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <Skeleton className="rounded-lg w-32 mb-4"><div className="h-5" /></Skeleton>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="rounded-xl"><div className="h-16" /></Skeleton>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
