import React, { useState, useContext, useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Toggle } from '@/components/ui/toggle';
import { Sparkles } from 'lucide-react';
import { CreatorContentContext } from '@/contexts/CreatorContentContext';

interface ImmersiveExperienceProps {
  content: string;
  mode?: 'standard' | 'immersive' | 'vr';
  settings?: {
    adaptiveLighting?: boolean;
    sensoryEffects?: boolean;
    hapticFeedback?: boolean;
  };
}

const defaultSettings = {
  adaptiveLighting: true,
  sensoryEffects: true,
  hapticFeedback: true,
};

const calculateImmersionLevel = (intensity: number, settings: any) => {
  let level = intensity;
  if (settings.adaptiveLighting) level += 0.2;
  if (settings.sensoryEffects) level += 0.3;
  if (settings.hapticFeedback) level += 0.1;
  return Math.min(level, 1);
};

const ImmersiveExperience = ({
  content,
  mode = 'standard',
  settings = defaultSettings
}: ImmersiveExperienceProps) => {
  const contentContext = useContext(CreatorContentContext);
  const [isImmersive, setIsImmersive] = useState(false);
  const [intensity, setIntensity] = useState(0.5);
  const immersionLevel = useMemo(() => calculateImmersionLevel(intensity, settings), [intensity, settings]);
  
  return (
    <div className="relative">
      <div className={cn(
        "p-4 rounded-md border shadow-sm",
        isImmersive ? "bg-black text-white" : "bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-100"
      )}>
        <h2 className="text-lg font-semibold mb-2">Immersive Experience</h2>
        <p>{content}</p>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="intensity" className="text-sm font-medium">Intensity</label>
            <Slider
              id="intensity"
              defaultValue={[intensity * 100]}
              max={100}
              step={1}
              onValueChange={(value) => setIntensity(value[0] / 100)}
              className="w-48"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label htmlFor="adaptiveLighting" className="text-sm font-medium">Adaptive Lighting</label>
            <Toggle id="adaptiveLighting" defaultChecked={settings.adaptiveLighting} />
          </div>
          
          <div className="flex items-center justify-between">
            <label htmlFor="sensoryEffects" className="text-sm font-medium">Sensory Effects</label>
            <Toggle id="sensoryEffects" defaultChecked={settings.sensoryEffects} />
          </div>
          
          <div className="flex items-center justify-between">
            <label htmlFor="hapticFeedback" className="text-sm font-medium">Haptic Feedback</label>
            <Toggle id="hapticFeedback" defaultChecked={settings.hapticFeedback} />
          </div>
        </div>
      </div>
      
      <div className="absolute top-2 right-2">
        <Button variant="secondary" size="icon" onClick={() => setIsImmersive(!isImmersive)}>
          <Sparkles size={16} className="mr-2" />
          {isImmersive ? 'Disable' : 'Enable'}
        </Button>
      </div>
      
      {isImmersive && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: immersionLevel }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-md z-10"
        />
      )}
    </div>
  );
};

export default ImmersiveExperience;
