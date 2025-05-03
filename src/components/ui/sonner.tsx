
import { useTheme } from "next-themes"
import { Toaster as Sonner, toast } from "sonner"

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

// Modified toast function with defaults that prevent spam
const enhancedToast = Object.assign(
  (props: Parameters<typeof toast>[0]) => {
    // Only show the toast if it's not a navigation notification
    if (props && typeof props === 'object' && 'title' in props && 
        props.title && 
        (typeof props.title === 'string' && 
         (props.title.includes('Bienvenue') || 
          props.title.includes('Loading')))) {
      return { id: 'suppressed-toast' };
    }
    return toast(props);
  },
  toast
);

export { Toaster, enhancedToast as toast }
