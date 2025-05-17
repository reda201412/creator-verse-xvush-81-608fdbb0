
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import EnhancedVideoUpload from './video-uploader/EnhancedVideoUpload';

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
  const handleClose = () => {
    onOpenChange(false);
  };

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
