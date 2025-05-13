
import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster 
      position="bottom-right"
      closeButton
      toastOptions={{
        className: "toast-custom-class",
        duration: 3000,
      }}
    />
  );
}
