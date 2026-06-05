import React from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type ButtonSize = "xs" | "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-moti-sky hover:bg-moti-sky-light text-white shadow-glow-sky border border-moti-sky/30",
  secondary: "bg-moti-amber hover:bg-amber-400 text-moti-navy-dark font-semibold shadow-glow-amber",
  ghost: "bg-white/8 hover:bg-white/14 text-white border border-white/10",
  danger: "bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30",
  outline: "bg-transparent hover:bg-white/8 text-white border border-white/20",
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: "text-xs px-2.5 py-1 rounded-lg",
  sm: "text-sm px-3.5 py-1.5 rounded-xl",
  md: "text-sm px-4 py-2 rounded-xl",
  lg: "text-base px-6 py-3 rounded-2xl",
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  iconRight,
  children,
  className = "",
  disabled,
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 cursor-pointer select-none
        disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97]
        ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon}
      {children}
      {iconRight}
    </button>
  );
};
