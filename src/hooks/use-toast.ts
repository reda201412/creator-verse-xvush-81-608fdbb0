
import { toast as sonnerToast } from "sonner";

export type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
  duration?: number;
};

// Create a wrapper around sonner toast that accepts both string and object formats
export function toast(props: string | ToastProps) {
  if (typeof props === 'string') {
    return sonnerToast(props);
  }
  
  const { title, description, variant, duration } = props;
  
  if (variant === 'destructive') {
    return sonnerToast.error(title, {
      description,
      duration
    });
  } else if (variant === 'success') {
    return sonnerToast.success(title, {
      description,
      duration
    });
  } else {
    return sonnerToast(title, {
      description,
      duration
    });
  }
}

// Add convenience methods to match shadcn usage pattern
toast.error = (message: string) => sonnerToast.error(message);
toast.success = (message: string) => sonnerToast.success(message);
toast.info = (message: string) => sonnerToast.info(message);
toast.warning = (message: string) => sonnerToast.warning(message);

// Re-export the hook for backward compatibility
export const useToast = () => {
  return { toast };
};

// Re-export toast for component usage
export type { ToastProps };
