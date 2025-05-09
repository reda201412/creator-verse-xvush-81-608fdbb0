
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface FormFooterActionsProps {
  isUploading: boolean;
  uploadProgress: number;
  uploadStage?: string;
  onClose: () => void;
  videoFile: File | null;
}

const FormFooterActions: React.FC<FormFooterActionsProps> = ({
  isUploading,
  uploadProgress,
  uploadStage,
  onClose,
  videoFile
}) => {
  return (
    <div className="space-y-4">
      {isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{uploadStage || 'Téléchargement...'}</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}
      
      <div className="flex justify-between">
        <Button 
          type="button" 
          variant="outline"
          onClick={onClose}
          disabled={isUploading}
        >
          Annuler
        </Button>
        
        <Button 
          type="submit" 
          disabled={!videoFile || isUploading}
        >
          {isUploading ? 'Publication...' : 'Publier la vidéo'}
        </Button>
      </div>
    </div>
  );
};

export default FormFooterActions;
