
// Import the toast notification types and functions from sonner
import { toast as sonnerToast } from "sonner";

export interface ToastProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  cancel?: React.ReactNode;
}

export function useToast() {
  return {
    toast: sonnerToast
  };
}

// Export direct toast function for backward compatibility
export const toast = sonnerToast;
