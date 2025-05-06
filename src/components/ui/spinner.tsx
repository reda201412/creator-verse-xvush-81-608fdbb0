
import React from "react";
import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
  label?: string;
}

export const Spinner = ({ 
  size = "md", 
  className,
  color = "primary",
  label
}: SpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-8 w-8 border-3",
    xl: "h-12 w-12 border-4"
  };

  const colorClasses = {
    default: "border-muted-foreground/30 border-t-muted-foreground",
    primary: "border-primary/30 border-t-primary",
    secondary: "border-secondary/30 border-t-secondary",
    success: "border-green-300/30 border-t-green-500",
    warning: "border-amber-300/30 border-t-amber-500",
    danger: "border-red-300/30 border-t-red-500"
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={cn(
          "animate-spin rounded-full",
          sizeClasses[size],
          colorClasses[color],
          className
        )}
        aria-label={label || "Chargement en cours"}
        role="status"
      />
      {label && (
        <span className="mt-2 text-sm text-muted-foreground">{label}</span>
      )}
    </div>
  );
};

export default Spinner;
