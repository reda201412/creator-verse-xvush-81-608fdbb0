
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNeuroAesthetic } from '@/hooks/use-neuro-aesthetic';

interface XDoseLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animated?: boolean;
}

const XDoseLogo: React.FC<XDoseLogoProps> = ({ 
  size = 'md', 
  className = '',
  animated = true
}) => {
  const { triggerMicroReward } = useNeuroAesthetic();
  const [isHovered, setIsHovered] = useState(false);
  const [randomColor, setRandomColor] = useState(0);
  
  const colors = [
    'from-purple-500 to-pink-500',
    'from-blue-500 to-teal-400',
    'from-amber-500 to-pink-500',
    'from-green-400 to-blue-500',
    'from-pink-500 to-orange-400',
  ];
  
  const sizes = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl',
    xl: 'text-7xl',
  };
  
  useEffect(() => {
    if (isHovered) {
      const interval = setInterval(() => {
        setRandomColor(prev => (prev + 1) % colors.length);
      }, 700);
      
      return () => clearInterval(interval);
    }
  }, [isHovered, colors.length]);
  
  const handleHover = () => {
    setIsHovered(true);
    triggerMicroReward('aesthetic');
  };

  return (
    <div 
      className={`inline-block ${className}`}
      onMouseEnter={handleHover}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className={`font-bold ${sizes[size]} text-transparent bg-clip-text`}
        style={{ WebkitTextStroke: '1px rgba(0,0,0,0.1)' }}
        initial={{ opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <motion.span 
          className={`bg-gradient-to-r ${colors[randomColor]} bg-clip-text text-transparent`}
          animate={animated ? { 
            opacity: [1, 0.8, 1],
            scale: [1, 1.02, 1],
          } : {}}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        >
          X
        </motion.span>
        <motion.span 
          className={`bg-gradient-to-r ${colors[(randomColor + 2) % colors.length]} bg-clip-text text-transparent`}
          animate={animated ? { 
            opacity: [0.9, 1, 0.9],
          } : {}}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            repeatType: "reverse",
            delay: 0.5 
          }}
        >
          Dose
        </motion.span>
      </motion.div>
      
      {/* Effet visuel sous le logo */}
      <motion.div 
        className={`h-1 bg-gradient-to-r ${colors[randomColor]} rounded-full mt-1`}
        initial={{ width: "0%" }}
        animate={{ width: isHovered ? "100%" : "40%" }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
};

export default XDoseLogo;
