import React from "react";

interface SkeletonProps {
  className?: string;
  rounded?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = "", rounded = "rounded-xl" }) => (
  <div
    className={`${rounded} bg-gradient-to-r from-white/5 via-white/10 to-white/5 bg-[length:200%_100%] animate-shimmer ${className}`}
    aria-hidden="true"
  />
);

export const WeatherCardSkeleton: React.FC = () => (
  <div className="rounded-2xl bg-moti-navy-mid border border-white/[0.07] p-6 space-y-4 animate-fade-in">
    <Skeleton className="h-4 w-24" />
    <Skeleton className="h-16 w-16 rounded-full" />
    <Skeleton className="h-10 w-32" />
    <Skeleton className="h-4 w-40" />
    <div className="grid grid-cols-4 gap-3 pt-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-16" />
      ))}
    </div>
  </div>
);

export const HourlyCardSkeleton: React.FC = () => (
  <div className="flex gap-3 overflow-hidden">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="min-w-[72px] rounded-xl bg-moti-navy-mid border border-white/[0.07] p-3 space-y-2 flex-shrink-0">
        <Skeleton className="h-3 w-10" rounded="rounded-md" />
        <Skeleton className="h-8 w-8 rounded-full mx-auto" />
        <Skeleton className="h-4 w-8 mx-auto" rounded="rounded-md" />
      </div>
    ))}
  </div>
);
