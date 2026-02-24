import React from 'react'

const PageSkeleton = () => (
  <div className="space-y-4">
    <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
    <div className="h-64 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
  </div>
);


export default PageSkeleton