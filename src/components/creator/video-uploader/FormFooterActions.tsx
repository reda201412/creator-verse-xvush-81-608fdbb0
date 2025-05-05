
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';

interface FormFooterActionsProps {
  isUploading: boolean;
  uploadProgress: number;
  onClose: () => void;
  videoFile: File | null;
}

const FormFooterActions: React.FC<FormFooterActionsProps> = ({
  isUploading,
  uploadProgress,
  onClose,
  videoFile
}) => {
  return (
    <DialogFooter>
      <Button 
        variant="outline" 
        type="button"
        onClick={onClose}
      >
        Annuler
      </Button>
      <Button 
        type="submit"
        disabled={!videoFile || isUploading}
      >
        {isUploading ? (
          <div className="flex items-center">
            <span className="mr-2">{Math.round(uploadProgress)}%</span>
            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>Publier</>
        )}
      </Button>
    </DialogFooter>
  );
};

export default FormFooterActions;
