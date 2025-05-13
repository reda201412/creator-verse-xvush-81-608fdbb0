
import React from 'react';
import { useLazyLoad } from '@/hooks/use-lazy-load';
import XteaseVideoPlayer from './XteaseVideoPlayer';
import { cn } from '@/lib/utils';

interface LazyVideoPlayerProps {
  playbackId: string;
  title?: string;
  poster?: string;
  previewHeight?: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
}

const LazyVideoPlayer: React.FC<LazyVideoPlayerProps> = ({ 
  playbackId,
  title,
  poster,
  previewHeight = 'h-[300px]',
  className,
  autoPlay = false,
  muted = false,
  loop = false
}) => {
  const { elementRef, isVisible, hasLoaded } = useLazyLoad({ threshold: 0.1 });

  return (
    <div 
      ref={elementRef} 
      className={cn(
        'w-full overflow-hidden transition-all duration-300', 
        previewHeight,
        hasLoaded ? 'aspect-video' : '',
        className
      )}
    >
      {/* Display a placeholder until the element is visible */}
      {!hasLoaded && !isVisible && (
        <div className="w-full h-full bg-muted/20 flex items-center justify-center rounded-lg animate-pulse">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-sm text-muted-foreground">Chargement de la vidéo...</p>
          </div>
        </div>
      )}

      {/* Load the video player only if the element is/has been visible */}
      {(isVisible || hasLoaded) && (
        <XteaseVideoPlayer 
          playbackId={playbackId}
          title={title}
          poster={poster}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
        />
      )}
    </div>
  );
};

export default LazyVideoPlayer;
