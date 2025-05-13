
import { toast as sonnerToast } from 'sonner';

// Helper function to convert from our toast API to sonner's
export function convertToSonnerToast(props: { 
  title: string;
  description?: React.ReactNode;
  variant?: string;
  action?: React.ReactNode;
}) {
  const { title, description, variant, action } = props;
  
  if (variant === 'destructive') {
    return sonnerToast.error(title, { description, action });
  }
  
  return sonnerToast(title, { description, action });
}
