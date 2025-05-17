
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import EnhancedVideoUpload from './video-uploader/EnhancedVideoUpload';
import ImmersiveView from '../navigation/ImmersiveView';
import { useMicroRewards } from '@/hooks/use-microrewards';
import { useEffect } from 'react';

interface EnhancedVideoUploadModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadComplete: (metadata?: any) => void;
}

const EnhancedVideoUploadModal: React.FC<EnhancedVideoUploadModalProps> = ({
  isOpen,
  onOpenChange,
  onUploadComplete
}) => {
  const { triggerMediaReward } = useMicroRewards();
  
  // Trigger micro-reward when modal opens
  useEffect(() => {
    if (isOpen) {
      // Trigger a reward when the modal opens to create a positive association
      triggerMediaReward({ action: 'open_upload', emotion: 'creative' });
    }
  }, [isOpen, triggerMediaReward]);

  const handleClose = () => {
    onOpenChange(false);
  };

  // Use ImmersiveView for a more immersive experience on mobile devices
  const isMobile = window.innerWidth < 768;
  
  if (isMobile) {
    return (
      <ImmersiveView
        fullScreen={true}
        onClose={handleClose}
        className="bg-black/90"
      >
        <div className="h-full w-full flex items-center justify-center">
          <EnhancedVideoUpload 
            onClose={handleClose}
            onUploadComplete={onUploadComplete}
          />
        </div>
      </ImmersiveView>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] p-0 max-h-[90vh] overflow-hidden">
        <EnhancedVideoUpload 
          onClose={handleClose}
          onUploadComplete={onUploadComplete}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedVideoUploadModal;
