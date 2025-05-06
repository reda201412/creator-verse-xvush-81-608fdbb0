
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Circle } from 'lucide-react';

interface EphemeralIndicatorProps {
  duration: number;
  onComplete: () => void;
}

const EphemeralIndicator: React.FC<EphemeralIndicatorProps> = ({ 
  duration = 5, 
  onComplete 
}) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const startTime = Date.now();
    const endTime = startTime + (duration * 1000);
    
    const updateProgress = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const total = endTime - startTime;
      const newProgress = Math.min(elapsed / total, 1);
      
      setProgress(newProgress);
      
      if (newProgress < 1) {
        requestAnimationFrame(updateProgress);
      } else {
        onComplete();
      }
    };
    
    const animationFrame = requestAnimationFrame(updateProgress);
    
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [duration, onComplete]);
  
  return (
    <div className="relative w-6 h-6 flex items-center justify-center">
      <svg width="24" height="24" viewBox="0 0 24 24" className="absolute">
        <motion.circle
          cx="12"
          cy="12"
          r="10"
          strokeWidth="2"
          stroke="currentColor"
          fill="transparent"
          strokeDasharray={2 * Math.PI * 10}
          strokeDashoffset={2 * Math.PI * 10 * (1 - progress)}
          className="text-purple-500"
        />
      </svg>
      <Circle size={16} className="text-white/20" />
    </div>
  );
};

export default EphemeralIndicator;
