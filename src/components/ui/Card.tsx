import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
  hover?: boolean;
  onClick?: () => void;
  as?: keyof JSX.IntrinsicElements;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  glass = false,
  hover = false,
  onClick,
  as: Tag = "div",
}) => {
  const base = "rounded-2xl overflow-hidden transition-all duration-300";
  const glassStyle = glass
    ? "bg-white/[0.06] border border-white/[0.09] backdrop-blur-sm"
    : "bg-moti-navy-mid border border-white/[0.07]";
  const hoverStyle = hover
    ? "cursor-pointer hover:bg-white/[0.10] hover:border-white/[0.14] hover:shadow-card-hover hover:-translate-y-0.5 active:translate-y-0"
    : "";
  return (
    // @ts-ignore
    <Tag
      className={`${base} ${glassStyle} ${hoverStyle} ${className}`}
      onClick={onClick}
    >
      {children}
    </Tag>
  );
};
