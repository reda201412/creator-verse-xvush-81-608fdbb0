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
  const toast = (props: ToastProps | string) => {
    // If it's just a string, use it as the title
    if (typeof props === 'string') {
      return sonnerToast(props);
    }
    
    // Otherwise handle the object format
    const { title, description, variant, action } = props;
    
    if (variant === "destructive") {
      return sonnerToast.error(title, { description, action });
    }
    return sonnerToast(title, { description, action });
  };

  return { toast };
}

// Export the toast function directly for convenience
export const toast = (props: ToastProps | string) => {
  // If it's just a string, use it as the title
  if (typeof props === 'string') {
    return sonnerToast(props);
  }
  
  // Otherwise handle the object format
  const { title, description, variant, action } = props;
  
  if (variant === "destructive") {
    return sonnerToast.error(title, { description, action });
  }
  return sonnerToast(title, { description, action });
};
