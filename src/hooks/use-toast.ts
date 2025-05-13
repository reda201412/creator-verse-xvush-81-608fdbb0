
// Import the toast notification types and functions from sonner
import { toast as sonnerToast, ToastT } from "sonner";

export interface ToastProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  cancel?: React.ReactNode;
  variant?: "default" | "destructive";
}

// Custom hook that provides toast functionality
export function useToast() {
  // Return the sonnerToast function directly
  return {
    toast: sonnerToast
  };
}

// Export direct toast function for backward compatibility
export const toast = sonnerToast;
