
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
  const toast = {
    // Basic toast function
    (props: ToastProps | string): string | number {
      if (typeof props === 'string') {
        return sonnerToast(props);
      }
      
      const { title, description, variant, action } = props;
      
      if (variant === "destructive") {
        return sonnerToast.error(title, { description, action });
      }
      return sonnerToast(title, { description, action });
    },
    
    // Success variant
    success(title: string, description?: string): string | number {
      return sonnerToast.success(title, { description });
    },
    
    // Error variant
    error(title: string, description?: string): string | number {
      return sonnerToast.error(title, { description });
    },
    
    // Info variant
    info(title: string, description?: string): string | number {
      return sonnerToast.info(title, { description });
    },
    
    // Warning variant
    warning(title: string, description?: string): string | number {
      return sonnerToast.warning(title, { description });
    }
  };

  return { toast };
}

// Export the toast function directly for convenience
export const toast = {
  (props: ToastProps | string): string | number {
    if (typeof props === 'string') {
      return sonnerToast(props);
    }
    
    const { title, description, variant, action } = props;
    
    if (variant === "destructive") {
      return sonnerToast.error(title, { description, action });
    }
    return sonnerToast(title, { description, action });
  },
  
  // Success variant
  success(title: string, description?: string): string | number {
    return sonnerToast.success(title, { description });
  },
  
  // Error variant
  error(title: string, description?: string): string | number {
    return sonnerToast.error(title, { description });
  },
  
  // Info variant
  info(title: string, description?: string): string | number {
    return sonnerToast.info(title, { description });
  },
  
  // Warning variant
  warning(title: string, description?: string): string | number {
    return sonnerToast.warning(title, { description });
  }
};
