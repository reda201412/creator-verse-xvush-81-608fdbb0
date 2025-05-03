
// Removing existing implementation and replacing with enhanced version that supports audio feedback

import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Pause, Play, Zap, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface Sound {
  id: string;
  name: string;
  url: string;
  icon: React.ReactNode;
  color: string;
}

interface AmbientSoundscapesProps {
  enabled?: boolean;
  volume?: number;
  onVolumeChange?: (volume: number) => void;
  className?: string;
  autoAdapt?: boolean;
  defaultSound?: string;
}

const AmbientSoundscapes: React.FC<AmbientSoundscapesProps> = ({
  enabled = false,
  volume = 50,
  onVolumeChange,
  className,
  autoAdapt = true,
  defaultSound = 'ambient'
}) => {
  const [isPlaying, setIsPlaying] = useState(enabled);
  const [currentVolume, setCurrentVolume] = useState(volume);
  const [activeSound, setActiveSound] = useState(defaultSound);
  const [previousVolume, setPreviousVolume] = useState(volume);
  const [showControls, setShowControls] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const sounds: Sound[] = [
    { 
      id: 'ambient', 
      name: 'Ambient', 
      url: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73467.mp3',
      icon: <Zap size={14} />,
      color: 'bg-purple-500'
    },
    { 
      id: 'rain', 
      name: 'Rain', 
      url: 'https://cdn.pixabay.com/download/audio/2021/11/02/audio_5b5349ab0d.mp3',
      icon: <Volume2 size={14} />,
      color: 'bg-blue-500'
    },
    { 
      id: 'lofi', 
      name: 'Lo-Fi', 
      url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
      icon: <Music size={14} />,
      color: 'bg-rose-500'
    }
  ];
  
  // Initialize audio
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
    }
    
    // Set current sound URL and load it
    const sound = sounds.find(s => s.id === activeSound) || sounds[0];
    audioRef.current.src = sound.url;
    audioRef.current.load();
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [activeSound, sounds]);
  
  // Update play state and volume
  useEffect(() => {
    if (!audioRef.current) return;
    
    // Set volume (0-1 scale)
    audioRef.current.volume = currentVolume / 100;
    
    // Play or pause
    if (isPlaying) {
      audioRef.current.play().catch((error) => {
        console.error("Error playing audio:", error);
        // Most browsers require user interaction before playing audio
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentVolume]);
  
  // Sync with enabled prop
  useEffect(() => {
    setIsPlaying(enabled);
  }, [enabled]);
  
  // Auto-adapt to page content if enabled
  useEffect(() => {
    if (!autoAdapt || !isPlaying) return;
    
    // Example: adapt sound based on current page content
    const detectPageContent = () => {
      const contentElements = document.querySelectorAll('main, article, section');
      
      let textContent = '';
      contentElements.forEach(el => {
        textContent += el.textContent || '';
      });
      
      textContent = textContent.toLowerCase();
      
      // Very simple content detection
      if (textContent.includes('relax') || 
          textContent.includes('calm') || 
          textContent.includes('peaceful')) {
        setActiveSound('ambient');
      } else if (textContent.includes('focus') || 
                 textContent.includes('work') || 
                 textContent.includes('study')) {
        setActiveSound('lofi');
      }
    };
    
    detectPageContent();
    
    // Re-detect when page content might change
    const observer = new MutationObserver(detectPageContent);
    observer.observe(document.body, { childList: true, subtree: true });
    
    return () => observer.disconnect();
  }, [autoAdapt, isPlaying]);
  
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };
  
  const toggleMute = () => {
    if (currentVolume === 0) {
      // Unmute: restore previous volume
      setCurrentVolume(previousVolume > 0 ? previousVolume : 50);
      if (onVolumeChange) onVolumeChange(previousVolume > 0 ? previousVolume : 50);
    } else {
      // Mute: save current volume and set to 0
      setPreviousVolume(currentVolume);
      setCurrentVolume(0);
      if (onVolumeChange) onVolumeChange(0);
    }
  };
  
  const handleVolumeChange = (newVolume: number[]) => {
    setCurrentVolume(newVolume[0]);
    if (onVolumeChange) onVolumeChange(newVolume[0]);
  };
  
  const changeSound = (soundId: string) => {
    setActiveSound(soundId);
  };

  return (
    <div className={cn("fixed bottom-20 right-4 z-40", className)}>
      <div 
        className="relative"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Main toggle button */}
        <Button
          size="icon"
          variant={isPlaying ? "default" : "outline"}
          className="h-10 w-10 rounded-full shadow-md"
          onClick={togglePlay}
        >
          {isPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </Button>
        
        {/* Controls panel */}
        {showControls && (
          <div className="absolute bottom-12 right-0 bg-background/80 backdrop-blur-sm border border-border rounded-lg p-3 w-48 shadow-lg">
            <div className="flex flex-col gap-3">
              {/* Sound selection buttons */}
              <div className="flex justify-between gap-1">
                {sounds.map((sound) => (
                  <Button
                    key={sound.id}
                    size="sm"
                    variant="outline"
                    className={cn(
                      "flex-1 gap-1 transition-colors",
                      activeSound === sound.id ? `${sound.color} text-white` : ""
                    )}
                    onClick={() => changeSound(sound.id)}
                  >
                    {sound.icon}
                    <span className="text-xs">{sound.name}</span>
                  </Button>
                ))}
              </div>
              
              {/* Volume slider and controls */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0"
                    onClick={toggleMute}
                  >
                    {currentVolume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  </Button>
                  
                  <Slider
                    value={[currentVolume]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={handleVolumeChange}
                    className="w-24"
                  />
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0"
                    onClick={togglePlay}
                  >
                    {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                  </Button>
                </div>
                
                <div className="text-xs text-center text-muted-foreground">
                  {isPlaying ? 'Now playing: ' + (sounds.find(s => s.id === activeSound)?.name || 'Sound') : 'Paused'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AmbientSoundscapes;
