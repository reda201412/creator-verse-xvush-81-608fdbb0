
import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import XteaseVideoPlayer from './XteaseVideoPlayer';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import useHapticFeedback from '@/hooks/use-haptic-feedback';

interface XteasePlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoSrc: string;
  thumbnailUrl?: string;
  title?: string;
}

const XteasePlayerModal: React.FC<XteasePlayerModalProps> = ({
  isOpen,
  onClose,
  videoSrc,
  thumbnailUrl,
  title
}) => {
  const { triggerHaptic } = useHapticFeedback();
  
  // Lock body scroll when modal is open, but allow clean-up on unmount
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen]);
  
  // Handle closing with haptic feedback
  const handleClose = () => {
    triggerHaptic('medium');
    
    // Force scroll enabling on close
    document.body.style.overflow = 'auto';
    document.body.style.overflowY = 'auto';
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black touch-auto overflow-auto">
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-4 right-4 z-50 bg-black/50 rounded-full"
        onClick={handleClose}
      >
        <X className="h-5 w-5 text-white" />
      </Button>
      
      <div className="xtease-video-container h-full w-full">
        <XteaseVideoPlayer
          src={videoSrc}
          thumbnailUrl={thumbnailUrl}
          title={title}
          autoPlay={true}
          loop={false}
          className="xtease-video"
          onClose={handleClose}
        />
      </div>
    </div>
  );
};

export default XteasePlayerModal;
