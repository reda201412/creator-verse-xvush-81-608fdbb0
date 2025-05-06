
import { useTheme } from "next-themes"
import { Toaster as Sonner, toast as sonnerToast, type ToastT } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        duration: 3000, // Shorter duration
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

// Modified toast function with extended methods
const toast = Object.assign(
  (message: React.ReactNode, options?: Parameters<typeof sonnerToast>[1]) => {
    // Filter out welcome and loading messages
    if (
      typeof message === 'string' && 
      (message.includes('Bienvenue') || message.includes('Loading'))
    ) {
      return { id: 'suppressed-toast' };
    }

    // Filter by title if options contain title
    if (
      options && 
      'title' in options && 
      typeof options.title === 'string' && 
      (options.title.includes('Bienvenue') || options.title.includes('Loading'))
    ) {
      return { id: 'suppressed-toast' };
    }

    return sonnerToast(message, options);
  },
  {
    ...sonnerToast,
    // Add success and error methods
    success: (message: React.ReactNode, options?: Parameters<typeof sonnerToast.success>[1]) => {
      return sonnerToast.success(message, options);
    },
    error: (message: React.ReactNode, options?: Parameters<typeof sonnerToast.error>[1]) => {
      return sonnerToast.error(message, options);
    }
  }
);

export { Toaster, toast }
