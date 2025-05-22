
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { VideoData } from '@/types/video';
import { useAuth } from '@/contexts/AuthContext';
import { FiLock, FiCreditCard, FiCheck } from 'react-icons/fi';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '@/components/ui/ProgressBar';
import { ContentPrice } from '@/types/monetization';

interface ContentPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  video?: VideoData;
  onPurchaseComplete: () => void;
  contentTitle?: string;
  contentThumbnail?: string;
  pricing?: ContentPrice;
  userTokenBalance?: number;
}

const ContentPurchaseModal: React.FC<ContentPurchaseModalProps> = ({
  isOpen,
  onClose,
  video,
  onPurchaseComplete,
  contentTitle,
  contentThumbnail,
  pricing,
  userTokenBalance = 0
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseStep, setPurchaseStep] = useState<'info' | 'processing' | 'complete'>('info');
  const [progress, setProgress] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Calculate video price based on what's available
  const videoPrice = video?.price || video?.tokenPrice || (pricing?.tokenPrice ?? 5);
  
  // Use the provided content title or fallback to video title
  const title = contentTitle || video?.title || "Premium Content";
  
  // Use the provided content thumbnail or fallback to video thumbnail
  const thumbnailUrl = contentThumbnail || video?.thumbnail_url || video?.thumbnailUrl || 'https://via.placeholder.com/120x68';
  
  const handleLoginRedirect = () => {
    onClose();
    navigate('/auth');
  };
  
  const handlePurchase = async () => {
    // Check if user has enough tokens
    if (userTokenBalance < videoPrice) {
      // Would redirect to token purchase page
      return;
    }
    
    // Process the purchase
    setIsProcessing(true);
    setPurchaseStep('processing');
    
    // Simulate purchase progress
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setProgress(currentProgress);
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        setPurchaseStep('complete');
        
        // Wait a moment before completing
        setTimeout(() => {
          setIsProcessing(false);
          onPurchaseComplete();
        }, 1000);
      }
    }, 300);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <FiLock className="mr-2 text-yellow-500" />
            Contenu Premium
          </DialogTitle>
          <DialogDescription>
            Ce contenu nécessite un achat pour être visionné.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {purchaseStep === 'info' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <img 
                  src={thumbnailUrl} 
                  alt={title}
                  className="w-24 h-16 object-cover rounded"
                />
                <div>
                  <h3 className="font-medium">{title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{video?.description}</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Prix</span>
                  <span className="font-bold text-yellow-600">{videoPrice} tokens</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Votre solde</span>
                  <span className="font-bold">{userTokenBalance} tokens</span>
                </div>
              </div>
              
              {!user ? (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-lg text-sm">
                  <p className="font-medium">Connectez-vous pour acheter ce contenu</p>
                </div>
              ) : userTokenBalance < videoPrice ? (
                <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg text-sm">
                  <p className="font-medium">Solde insuffisant</p>
                  <p className="mt-1">Vous avez besoin de {videoPrice - userTokenBalance} tokens supplémentaires.</p>
                </div>
              ) : null}
            </div>
          )}
          
          {purchaseStep === 'processing' && (
            <div className="text-center py-4 space-y-4">
              <Loader2 className="animate-spin h-8 w-8 mx-auto text-indigo-600" />
              <p>Traitement de votre achat...</p>
              <ProgressBar 
                value={progress} 
                max={100} 
                color="bg-indigo-600" 
                height="h-2" 
                showPercentage 
              />
            </div>
          )}
          
          {purchaseStep === 'complete' && (
            <div className="text-center py-6">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <FiCheck className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mt-3 text-lg font-medium">Achat réussi !</h3>
              <p className="mt-1 text-sm text-gray-500">
                Vous avez maintenant accès à ce contenu premium.
              </p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          {purchaseStep === 'info' && (
            <>
              <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
                Annuler
              </Button>
              {!user ? (
                <Button onClick={handleLoginRedirect} className="w-full sm:w-auto">
                  Se connecter
                </Button>
              ) : (
                <Button 
                  onClick={handlePurchase} 
                  disabled={isProcessing || userTokenBalance < videoPrice}
                  className="w-full sm:w-auto"
                >
                  <FiCreditCard className="mr-2 h-4 w-4" />
                  Acheter pour {videoPrice} tokens
                </Button>
              )}
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContentPurchaseModal;
