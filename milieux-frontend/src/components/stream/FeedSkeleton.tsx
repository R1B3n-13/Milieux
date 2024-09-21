import React from 'react'
import { Skeleton } from '../ui/Skeleton';

const FeedSkeleton = () => {
  return (
    <div className="flex flex-col">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4 mt-5">
          <Skeleton className="h-12 w-16" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default FeedSkeleton