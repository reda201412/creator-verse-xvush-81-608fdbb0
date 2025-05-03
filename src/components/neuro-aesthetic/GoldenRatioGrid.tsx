
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GoldenRatioGridProps {
  visible?: boolean;
  opacity?: number;
  className?: string;
}

const GoldenRatioGrid: React.FC<GoldenRatioGridProps> = ({
  visible = false,
  opacity = 0.1,
  className
}) => {
  if (!visible) return null;

  // Golden ratio is approximately 1.618
  const phi = 1.618;

  return (
    <motion.div
      className={cn("fixed inset-0 pointer-events-none z-10", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? opacity : 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Vertical lines based on Golden Ratio */}
      <div className="absolute inset-0 flex">
        {/* First golden section from left */}
        <div className="h-full border-r border-primary/20" style={{ width: `${100 / (phi + 1)}%` }}></div>
        
        {/* Second golden section from left */}
        <div className="h-full border-r border-primary/20" style={{ width: `${100 * phi / (phi + 1)}%` }}></div>
        
        {/* First golden section from right */}
        <div className="h-full border-l border-primary/20" style={{ width: `${100 / (phi + 1)}%`, marginLeft: `auto` }}></div>
      </div>
      
      {/* Horizontal lines based on Golden Ratio */}
      <div className="absolute inset-0 flex flex-col">
        {/* First golden section from top */}
        <div className="w-full border-b border-primary/20" style={{ height: `${100 / (phi + 1)}%` }}></div>
        
        {/* Second golden section from top */}
        <div className="w-full border-b border-primary/20" style={{ height: `${100 * phi / (phi + 1)}%` }}></div>
        
        {/* First golden section from bottom */}
        <div className="w-full border-t border-primary/20" style={{ height: `${100 / (phi + 1)}%`, marginTop: `auto` }}></div>
      </div>
    </motion.div>
  );
};

export default GoldenRatioGrid;
