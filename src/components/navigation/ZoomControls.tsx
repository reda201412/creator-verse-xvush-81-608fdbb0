
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
  const handleZoomOut = () => {
    const newZoom = Math.max(0, zoomLevel - 25);
    onZoomChange(newZoom);
  };
  
  const handleZoomIn = () => {
    const newZoom = Math.min(100, zoomLevel + 25);
    onZoomChange(newZoom);
  };
  
  const handleSliderChange = (value: number[]) => {
    onZoomChange(value[0]);
  };
  
  return (
    <div className={cn(
      "flex items-center gap-2 bg-background/70 backdrop-blur-sm rounded-full px-3 py-1 shadow-sm border border-border transition-all duration-300 hover:bg-background/90",
      className
    )}>
      <Button 
        size="icon" 
        variant="ghost" 
        className="h-7 w-7 rounded-full"
        onClick={handleZoomOut}
      >
        <ZoomOut size={15} />
      </Button>
      
      <div className="relative w-32">
        <Slider
          value={[zoomLevel]}
          min={0}
          max={100}
          step={5}
          className="w-32"
          onValueChange={handleSliderChange}
        />
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium bg-primary text-primary-foreground px-1.5 py-0.5 rounded-sm opacity-70">
          {zoomLevel}%
        </div>
      </div>
      
      <Button 
        size="icon" 
        variant="ghost" 
        className="h-7 w-7 rounded-full"
        onClick={handleZoomIn}
      >
        <ZoomIn size={15} />
      </Button>
      
      <div className="h-5 border-l border-border mx-1"></div>
      
      <Button
        size="icon"
        variant="ghost"
        className="h-7 w-7 rounded-full"
        onClick={onEnterImmersiveMode}
        title="Mode immersif"
      >
        <Maximize size={15} />
      </Button>
    </div>
  );
};

export default ZoomControls;
