
import React from 'react';
import { Film, Check, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface VideoFormatInfoProps {
  videoPreviewUrl: string | null;
  videoFormat: '16:9' | '9:16' | '1:1' | 'other';
}

const VideoFormatInfo: React.FC<VideoFormatInfoProps> = ({ 
  videoPreviewUrl, 
  videoFormat 
}) => {
  if (!videoPreviewUrl) return null;
  
  // Récupérer la classe CSS et l'icône en fonction du format
  const getFormatInfo = () => {
    switch (videoFormat) {
      case '9:16':
        return {
          badgeClass: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
          icon: <Check className="h-3 w-3" />,
          description: 'Format idéal pour Xtease'
        };
      case '16:9':
        return {
          badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
          icon: <Info className="h-3 w-3" />,
          description: 'Format standard pour ordinateur'
        };
      case '1:1':
        return {
          badgeClass: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
          icon: <Info className="h-3 w-3" />,
          description: 'Format carré pour médias sociaux'
        };
      default:
        return {
          badgeClass: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
          icon: <Info className="h-3 w-3" />,
          description: 'Format non standard'
        };
    }
  };
  
  const formatInfo = getFormatInfo();
  
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-sm">
        <Film className="h-4 w-4 text-muted-foreground" />
        <span>Format détecté: {videoFormat}</span>
      </div>
      
      <Badge variant="outline" className={`flex items-center gap-1.5 px-2 py-1 ${formatInfo.badgeClass}`}>
        {formatInfo.icon}
        <span>{formatInfo.description}</span>
      </Badge>
      
      <div className="text-xs text-muted-foreground mt-1">
        {videoFormat === '9:16' ? (
          "Ce format vertical est optimisé pour les appareils mobiles et augmente l'engagement."
        ) : videoFormat === '16:9' ? (
          "Ce format horizontal est adapté pour la visualisation sur ordinateur."
        ) : videoFormat === '1:1' ? (
          "Ce format carré est polyvalent pour la diffusion sur différentes plateformes."
        ) : (
          "Ce format non standard pourrait s'afficher avec des barres noires sur certains appareils."
        )}
      </div>
    </div>
  );
};

export default VideoFormatInfo;
