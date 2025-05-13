
import { toast as sonnerToast } from 'sonner';

// Helper function to convert from our toast API to sonner's
export function convertToSonnerToast(title: string, props?: { description?: React.ReactNode, variant?: string }) {
  if (props?.variant === 'destructive') {
    return sonnerToast.error(title, { description: props.description });
  }
  return sonnerToast(title, { description: props.description });
}
