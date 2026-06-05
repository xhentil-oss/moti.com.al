import React from "react";

interface WeatherIconProps {
  emoji: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
  animated?: boolean;
}

const sizeMap = {
  xs: "text-lg",
  sm: "text-2xl",
  md: "text-4xl",
  lg: "text-5xl",
  xl: "text-6xl",
  "2xl": "text-7xl",
};

export const WeatherIcon: React.FC<WeatherIconProps> = ({ emoji, size = "md", className = "", animated = false }) => {
  return (
    <span
      aria-hidden="true"
      className={`inline-block leading-none select-none ${sizeMap[size]} ${animated ? "animate-pulse-soft" : ""} ${className}`}
      role="img"
    >
      {emoji}
    </span>
  );
};
