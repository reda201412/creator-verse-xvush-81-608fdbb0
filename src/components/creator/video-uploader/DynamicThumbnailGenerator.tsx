
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { ImagePlus, RefreshCw, Wand2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMicroRewards } from '@/hooks/use-microrewards';

interface DynamicThumbnailGeneratorProps {
  videoUrl: string;
  onThumbnailGenerated: (file: File) => void;
  className?: string;
}

const DynamicThumbnailGenerator: React.FC<DynamicThumbnailGeneratorProps> = ({
  videoUrl,
  onThumbnailGenerated,
  className
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [selectedThumbnail, setSelectedThumbnail] = useState<string | null>(null);
  const { triggerCreationReward } = useMicroRewards();
  
  // When video loads, get its duration
  const handleVideoMetadata = useCallback(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      // Set initial time to 2 seconds or 10% of the video, whichever is less
      const initialTime = Math.min(2, videoRef.current.duration * 0.1);
      setCurrentTime(initialTime);
      videoRef.current.currentTime = initialTime;
    }
  }, []);
  
  // Generate thumbnail at current time
  const generateThumbnail = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setThumbnails(prev => [...prev, url]);
            
            // If this is the first thumbnail, select it automatically
            if (selectedThumbnail === null) {
              setSelectedThumbnail(url);
            }
          }
        }, 'image/jpeg', 0.95);
      }
    }
  }, [selectedThumbnail]);
  
  // Generate thumbnail when time changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = currentTime;
    }
  }, [currentTime]);
  
  // Listen for seeked event to generate thumbnail
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const handleSeeked = () => {
      if (!isGenerating) {
        generateThumbnail();
      }
    };
    
    video.addEventListener('seeked', handleSeeked);
    return () => {
      video.removeEventListener('seeked', handleSeeked);
    };
  }, [generateThumbnail, isGenerating]);
  
  // Auto-generate thumbnails from key moments
  const generateSmartThumbnails = useCallback(async () => {
    if (!videoRef.current) return;
    
    setIsGenerating(true);
    setProgress(0);
    
    const video = videoRef.current;
    const totalDuration = video.duration;
    
    // Algorithm to find frames: 
    // 1. Always include beginning (10%), middle and near-end (80%)
    // 2. Add some random frames throughout the video
    
    const keyFramePositions = [
      totalDuration * 0.1,   // Near beginning
      totalDuration * 0.33,  // First third
      totalDuration * 0.5,   // Middle
      totalDuration * 0.66,  // Second third
      totalDuration * 0.8    // Near end, but not too close
    ];
    
    // Add 2 random positions
    for (let i = 0; i < 2; i++) {
      const randomPos = Math.random() * (totalDuration * 0.7) + (totalDuration * 0.15);
      keyFramePositions.push(randomPos);
    }
    
    // Sort the positions
    keyFramePositions.sort((a, b) => a - b);
    
    // Clear previous thumbnails
    setThumbnails([]);
    setSelectedThumbnail(null);
    
    // Generate thumbnails for each key frame
    for (let i = 0; i < keyFramePositions.length; i++) {
      const position = keyFramePositions[i];
      video.currentTime = position;
      
      // Wait for the video to seek to the new position
      await new Promise<void>(resolve => {
        const handleSeeked = () => {
          video.removeEventListener('seeked', handleSeeked);
          resolve();
        };
        video.addEventListener('seeked', handleSeeked);
      });
      
      // Generate thumbnail
      generateThumbnail();
      
      // Update progress
      const newProgress = ((i + 1) / keyFramePositions.length) * 100;
      setProgress(newProgress);
    }
    
    setIsGenerating(false);
    triggerCreationReward({ type: 'thumbnail_generated', count: keyFramePositions.length });
  }, [generateThumbnail, triggerCreationReward]);
  
  // Handle selection of a thumbnail
  const selectThumbnail = useCallback(async (url: string) => {
    setSelectedThumbnail(url);
    
    // Convert the thumbnail URL to a file
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const file = new File([blob], 'thumbnail.jpg', { type: 'image/jpeg' });
      onThumbnailGenerated(file);
      triggerCreationReward({ type: 'thumbnail_selected' });
    } catch (error) {
      console.error('Error converting thumbnail to file:', error);
    }
  }, [onThumbnailGenerated, triggerCreationReward]);
  
  // Clean up URLs on unmount
  useEffect(() => {
    return () => {
      thumbnails.forEach(url => URL.revokeObjectURL(url));
    };
  }, [thumbnails]);
  
  return (
    <div className={className}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Générateur de Miniature Intelligent</h3>
          
          <Button 
            variant="outline" 
            size="sm"
            disabled={isGenerating}
            onClick={generateSmartThumbnails}
          >
            {isGenerating ? (
              <>
                <RefreshCw size={14} className="mr-2 animate-spin" />
                Génération...
              </>
            ) : (
              <>
                <Wand2 size={14} className="mr-2" />
                Générer des miniatures
              </>
            )}
          </Button>
        </div>
        
        {isGenerating && (
          <div className="space-y-2">
            <Progress value={progress} />
            <p className="text-xs text-muted-foreground text-center">
              Analyse des moments clés de votre vidéo: {Math.round(progress)}%
            </p>
          </div>
        )}
        
        <div className="bg-black/10 rounded-md p-2 relative overflow-hidden">
          {/* Hidden video element for thumbnail generation */}
          <video 
            ref={videoRef}
            src={videoUrl}
            onLoadedMetadata={handleVideoMetadata}
            className="hidden"
          />
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Manual thumbnail selection */}
          {!isGenerating && (
            <>
              <div className="flex items-center space-x-2 mb-4">
                <Clock size={14} />
                <span className="text-xs font-medium">Position: {currentTime.toFixed(1)}s</span>
                <span className="text-xs text-muted-foreground">
                  / {duration.toFixed(1)}s
                </span>
              </div>
              <Slider 
                value={[currentTime]}
                min={0}
                max={duration}
                step={0.1}
                onValueChange={(value) => setCurrentTime(value[0])}
                className="mb-3"
              />
            </>
          )}
        </div>
        
        {/* Thumbnails display */}
        {thumbnails.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">
              Sélectionnez une miniature
            </h4>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {thumbnails.map((thumbnail, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`
                    relative cursor-pointer rounded-md overflow-hidden aspect-video
                    ${selectedThumbnail === thumbnail ? 'ring-2 ring-primary' : ''}
                  `}
                  onClick={() => selectThumbnail(thumbnail)}
                >
                  <img 
                    src={thumbnail} 
                    alt={`Thumbnail ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicThumbnailGenerator;
