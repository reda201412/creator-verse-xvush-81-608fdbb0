
import { cn } from "@/lib/utils";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

function Spinner({
  className,
  size = "md",
  ...props
}: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12"
  };

  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", sizeClasses[size], className)}
      {...props}
    />
  );
}

export { Spinner };
