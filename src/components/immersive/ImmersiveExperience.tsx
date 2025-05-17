
// Remove unused React import
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdaptiveMoodLighting from '@/components/neuro-aesthetic/AdaptiveMoodLighting';
// Remove non-existent CreatorContentContext import

interface ImmersiveExperienceProps {
  children: React.ReactNode;
  title?: string;
  onClose?: () => void;
  showCloseButton?: boolean;
  showBackButton?: boolean;
  onBack?: () => void;
}

const ImmersiveExperience: React.FC<ImmersiveExperienceProps> = ({
  children,
  title,
  onClose,
  showCloseButton = true,
  showBackButton = false,
  onBack,
}) => {
  // Remove unused mode and contentContext variables
  const [isFullyVisible, setIsFullyVisible] = useState(false);
  
  useEffect(() => {
    // Add a slight delay to ensure smooth animation
    const timer = setTimeout(() => {
      setIsFullyVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/95 backdrop-blur-md z-50 flex flex-col"
    >
      <AdaptiveMoodLighting intensity="high" />
      
      <div className="flex items-center justify-between p-4">
        {showBackButton && (
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        
        {title && (
          <h2 className="text-xl font-bold">{title}</h2>
        )}
        
        {showCloseButton && (
          <Button variant="ghost" size="icon" onClick={onClose} className="ml-auto">
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {children}
      </div>
    </motion.div>
  );
};

export default ImmersiveExperience;
