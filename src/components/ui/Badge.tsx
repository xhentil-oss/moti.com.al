import React from "react";

type BadgeVariant = "default" | "warning" | "danger" | "success" | "info" | "ghost";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: "sm" | "md";
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-white/10 text-white/80 border border-white/10",
  warning: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
  danger: "bg-red-500/20 text-red-300 border border-red-500/30",
  success: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
  info: "bg-sky-500/20 text-sky-300 border border-sky-500/30",
  ghost: "bg-transparent text-white/50 border border-white/10",
};

export const Badge: React.FC<BadgeProps> = ({ children, variant = "default", size = "sm", className = "" }) => {
  const sizeStyles = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${sizeStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};
