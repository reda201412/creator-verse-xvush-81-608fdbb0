
import { toast as sonnerToast } from "sonner";

// Define the types for our toast functions
export type ToastProps = {
  title?: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
};

// Create a custom toast hook that wraps the Sonner toast
export function useToast() {
  const toast = (title: string, props?: Omit<ToastProps, "title">) => {
    if (props?.variant === "destructive") {
      return sonnerToast.error(title, { description: props.description });
    }
    return sonnerToast(title, { description: props.description, action: props.action });
  };

  return { toast };
}

// Export the toast function directly for convenience
export const toast = (title: string, props?: Omit<ToastProps, "title">) => {
  if (props?.variant === "destructive") {
    return sonnerToast.error(title, { description: props.description });
  }
  return sonnerToast(title, { description: props.description, action: props.action });
};
