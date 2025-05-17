import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { X } from 'lucide-react'; // Add X import

interface ImmersiveViewProps {
  children: React.ReactNode;
  className?: string;
  fullScreen?: boolean;
  immersionLevel?: 'low' | 'medium' | 'high';
  onClose?: () => void;
}

const ImmersiveView: React.FC<ImmersiveViewProps> = ({
  children,
  className,
  fullScreen = false,
  immersionLevel = 'medium',
  onClose,
}) => {
  // isMobile is not used, but keeping it since it might be used in the future
  
  return (
    <motion.div
      className={cn(
        "fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center",
        fullScreen && "h-screen w-screen",
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative w-full h-full">
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/10 z-50"
            onClick={onClose}
          >
            <X />
          </Button>
        )}
        {children}
      </div>
    </motion.div>
  );
};

export default ImmersiveView;
