
// Import toast notification types and functions from sonner
import { toast as sonnerToast } from "sonner";

export interface ToastProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  cancel?: React.ReactNode;
}

export function useToast() {
  return {
    toast: {
      success: (title: string, props?: Omit<ToastProps, "title">) => sonnerToast.success(title, props),
      error: (title: string, props?: Omit<ToastProps, "title">) => sonnerToast.error(title, props),
      info: (title: string, props?: Omit<ToastProps, "title">) => sonnerToast.info(title, props),
      warning: (title: string, props?: Omit<ToastProps, "title">) => sonnerToast.warning(title, props),
      message: (title: string, props?: Omit<ToastProps, "title">) => sonnerToast(title, props),
      promise: <T>(promise: Promise<T>, options: any) => sonnerToast.promise(promise, options),
      dismiss: (toastId?: string) => sonnerToast.dismiss(toastId),
    },
  };
}

// Export direct toast function for backward compatibility
export const toast = sonnerToast;
