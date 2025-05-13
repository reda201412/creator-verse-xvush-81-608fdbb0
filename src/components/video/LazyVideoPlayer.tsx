
import React from 'react';
import { useLazyLoad } from '@/hooks/use-lazy-load';
import XteaseVideoPlayer, { XteaseVideoPlayerProps } from './XteaseVideoPlayer';
import { cn } from '@/lib/utils';

interface LazyVideoPlayerProps extends XteaseVideoPlayerProps {
  previewHeight?: string;
  className?: string;
}

const LazyVideoPlayer: React.FC<LazyVideoPlayerProps> = ({ 
  previewHeight = 'h-[300px]',
  className,
  ...videoProps
}) => {
  const { elementRef, isVisible, hasLoaded } = useLazyLoad({ threshold: 0.1 });

  return (
    <div 
      ref={elementRef} 
      className={cn(
        'w-full overflow-hidden transition-all duration-300', 
        previewHeight,
        hasLoaded ? 'aspect-[9/16]' : '',
        className
      )}
    >
      {/* Affiche un placeholder jusqu'à ce que l'élément soit visible */}
      {!hasLoaded && !isVisible && (
        <div className="w-full h-full bg-muted/20 flex items-center justify-center rounded-lg animate-pulse">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-sm text-muted-foreground">Chargement de la vidéo...</p>
          </div>
        </div>
      )}

      {/* Charge le lecteur vidéo seulement si l'élément est/a été visible */}
      {(isVisible || hasLoaded) && (
        <XteaseVideoPlayer {...videoProps} />
      )}
    </div>
  );
};

export default LazyVideoPlayer;
