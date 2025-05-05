
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Upload, X, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

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
    <DialogFooter className="flex flex-col sm:flex-row gap-2">
      {isUploading && (
        <div className="w-full mb-2">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Chargement en cours...</span>
            <span>{Math.round(uploadProgress)}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}
      
      <div className="flex w-full sm:w-auto justify-end gap-2">
        <Button 
          variant="outline" 
          type="button"
          onClick={onClose}
          disabled={isUploading}
          className="flex items-center gap-1"
        >
          <X className="h-4 w-4" />
          Annuler
        </Button>
        
        <Button 
          type="submit"
          disabled={!videoFile || isUploading}
          className="flex items-center gap-1"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Traitement...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Publier
            </>
          )}
        </Button>
      </div>
    </DialogFooter>
  );
};

export default FormFooterActions;
