
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import XteaseVideoPlayer from './XteaseVideoPlayer';
import { X } from 'lucide-react';

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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 max-w-md border-none bg-black overflow-hidden">
        <button 
          className="absolute top-2 right-2 z-10 bg-black/50 rounded-full p-1" 
          onClick={onClose}
        >
          <X className="h-5 w-5 text-white" />
        </button>
        
        <XteaseVideoPlayer
          src={videoSrc}
          thumbnailUrl={thumbnailUrl}
          title={title}
          autoPlay={true}
        />
      </DialogContent>
    </Dialog>
  );
};

export default XteasePlayerModal;
