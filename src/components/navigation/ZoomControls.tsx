
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';

interface ZoomControlsProps {
  zoomLevel: number;
  onZoomChange: (level: number) => void;
  onEnterImmersiveMode: () => void;
  className?: string;
}

const ZoomControls = ({ zoomLevel, onZoomChange, onEnterImmersiveMode, className }: ZoomControlsProps) => {
  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event propagation to prevent accidental scrolling
    const newZoom = Math.max(25, zoomLevel - 10);
    onZoomChange(newZoom);
  };
  
  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event propagation to prevent accidental scrolling
    const newZoom = Math.min(75, zoomLevel + 10);
    onZoomChange(newZoom);
  };
  
  const handleSliderChange = (value: number[]) => {
    // Apply small debounce for smoother experience
    requestAnimationFrame(() => {
      onZoomChange(value[0]);
    });
  };
  
  const handleImmersiveMode = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event propagation to prevent accidental scrolling
    onEnterImmersiveMode();
  };
  
  return (
    <div className={cn(
      "flex items-center gap-2 bg-background/50 backdrop-blur-sm rounded-full px-2 py-1 shadow-sm border border-border/50 transition-all duration-300",
      "touch-none", // Prevent touch events from interfering with parent scrolling
      className
    )}>
      <Button 
        size="icon" 
        variant="ghost" 
        className="h-6 w-6 rounded-full"
        onClick={handleZoomOut}
        onTouchEnd={(e) => e.stopPropagation()} // Extra safety for touch devices
      >
        <ZoomOut size={13} />
      </Button>
      
      <div className="relative w-24 touch-none">
        <Slider
          value={[zoomLevel]}
          min={25}
          max={75}
          step={5}
          className="w-24"
          onValueChange={handleSliderChange}
          onValueCommit={handleSliderChange} // For when user finishes dragging
        />
        <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-xs font-medium bg-primary text-primary-foreground px-1 py-0.5 rounded-sm opacity-60 scale-75">
          {zoomLevel}%
        </div>
      </div>
      
      <Button 
        size="icon" 
        variant="ghost" 
        className="h-6 w-6 rounded-full"
        onClick={handleZoomIn}
        onTouchEnd={(e) => e.stopPropagation()} // Extra safety for touch devices
      >
        <ZoomIn size={13} />
      </Button>
      
      <div className="h-4 border-l border-border/50 mx-0.5"></div>
      
      <Button
        size="icon"
        variant="ghost"
        className="h-6 w-6 rounded-full"
        onClick={handleImmersiveMode}
        onTouchEnd={(e) => e.stopPropagation()} // Extra safety for touch devices
        title="Mode immersif"
      >
        <Maximize size={13} />
      </Button>
    </div>
  );
};

export default ZoomControls;
