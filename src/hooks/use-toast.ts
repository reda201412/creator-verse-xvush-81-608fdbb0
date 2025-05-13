
import { toast as sonnerToast } from "sonner";

// Define the types for our toast functions
export type ToastProps = {
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
};

// Create a custom toast hook that wraps the Sonner toast
export function useToast() {
  return {
    toast: (props: ToastProps | string) => {
      if (typeof props === 'string') {
        return sonnerToast(props);
      }
      
      const { title, description, variant, action } = props;
      
      if (variant === "destructive") {
        return sonnerToast.error(title, { description, action });
      }
      return sonnerToast(title, { description, action });
    }
  };
}

// Export the toast function directly for convenience
export const toast = (props: ToastProps | string) => {
  if (typeof props === 'string') {
    return sonnerToast(props);
  }
  
  const { title, description, variant, action } = props;
  
  if (variant === "destructive") {
    return sonnerToast.error(title, { description, action });
  }
  return sonnerToast(title, { description, action });
};

// Add convenience methods to the toast object
toast.success = (title: string, description?: string) => {
  return sonnerToast.success(title, { description });
};

toast.error = (title: string, description?: string) => {
  return sonnerToast.error(title, { description });
};

toast.info = (title: string, description?: string) => {
  return sonnerToast.info(title, { description });
};

toast.warning = (title: string, description?: string) => {
  return sonnerToast.warning(title, { description });
};
