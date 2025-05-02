
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { motion, useAnimation } from 'framer-motion';

interface CreatorSignatureProps {
  creatorId: string;
  style?: 'minimal' | 'artistic' | 'elegant' | 'bold' | 'playful';
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  className?: string;
  onClick?: () => void;
}

const CreatorSignature: React.FC<CreatorSignatureProps> = ({
  creatorId,
  style = 'elegant',
  size = 'md',
  interactive = true,
  className,
  onClick
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controls = useAnimation();
  const [signatureLoaded, setSignatureLoaded] = useState(false);
  
  // Size mappings
  const sizeMap = {
    sm: { width: 80, height: 40 },
    md: { width: 120, height: 60 },
    lg: { width: 180, height: 80 }
  };
  
  // Style configurations
  const styleConfig = {
    minimal: {
      lineWidth: 1.5,
      strokeStyle: '#000',
      shadowBlur: 0,
      shadowColor: 'transparent',
      lineCap: 'round',
      lineJoin: 'round'
    },
    elegant: {
      lineWidth: 2,
      strokeStyle: '#8B5CF6',
      shadowBlur: 5,
      shadowColor: 'rgba(139, 92, 246, 0.5)',
      lineCap: 'round',
      lineJoin: 'round'
    },
    artistic: {
      lineWidth: 3,
      strokeStyle: '#EC4899',
      shadowBlur: 8,
      shadowColor: 'rgba(236, 72, 153, 0.6)',
      lineCap: 'round',
      lineJoin: 'bevel'
    },
    bold: {
      lineWidth: 4,
      strokeStyle: '#0F172A',
      shadowBlur: 2,
      shadowColor: 'rgba(15, 23, 42, 0.3)',
      lineCap: 'square',
      lineJoin: 'miter'
    },
    playful: {
      lineWidth: 2.5,
      strokeStyle: 'linear-gradient(45deg, #FF6B6B 0%, #FFD700 100%)',
      shadowBlur: 6,
      shadowColor: 'rgba(255, 107, 107, 0.4)',
      lineCap: 'round',
      lineJoin: 'round'
    }
  };
  
  // Fade in/out animations
  useEffect(() => {
    if (signatureLoaded && interactive) {
      controls.start({ opacity: 1 });
    }
  }, [signatureLoaded, interactive, controls]);
  
  // Generate signature
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = sizeMap[size].width;
    canvas.height = sizeMap[size].height;
    
    // Apply style config
    const config = styleConfig[style];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = config.lineWidth;
    
    // Handle gradient if needed
    if (config.strokeStyle.includes('gradient')) {
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      if (style === 'playful') {
        gradient.addColorStop(0, '#FF6B6B');
        gradient.addColorStop(1, '#FFD700');
      }
      ctx.strokeStyle = gradient;
    } else {
      ctx.strokeStyle = config.strokeStyle;
    }
    
    ctx.lineCap = config.lineCap as CanvasLineCap;
    ctx.lineJoin = config.lineJoin as CanvasLineJoin;
    ctx.shadowBlur = config.shadowBlur;
    ctx.shadowColor = config.shadowColor;
    
    // Generate signature based on creatorId
    // This uses a deterministic algorithm so the same creatorId always produces the same signature
    const seed = hashStringToInt(creatorId);
    const points = generateSignaturePoints(seed, canvas.width, canvas.height);
    
    // Draw the signature
    ctx.beginPath();
    
    // Animate drawing
    let currentPoint = 0;
    const totalPoints = points.length;
    
    const drawNextPoint = () => {
      if (currentPoint < totalPoints) {
        const point = points[currentPoint];
        
        if (currentPoint === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
          ctx.stroke();
        }
        
        currentPoint++;
        requestAnimationFrame(drawNextPoint);
      } else {
        setSignatureLoaded(true);
      }
    };
    
    drawNextPoint();
  }, [creatorId, style, size]);
  
  // Helper functions
  const hashStringToInt = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  };
  
  const generateSignaturePoints = (seed: number, width: number, height: number) => {
    const rng = seedRandom(seed);
    const points = [];
    
    // Choose starting position
    const startX = width * 0.1;
    const startY = height * (0.3 + rng() * 0.4);
    
    points.push({ x: startX, y: startY });
    
    // Number of control points
    const numPoints = 6 + Math.floor(rng() * 6);
    
    // Generate sequence of points
    for (let i = 0; i < numPoints; i++) {
      const x = startX + (i + 1) * (width * 0.8) / numPoints;
      const yVariation = height * 0.4 * (rng() - 0.5);
      const y = startY + yVariation;
      
      // Add intermediate control points for smoother curves
      if (i > 0) {
        const prevPoint = points[points.length - 1];
        const midX = (prevPoint.x + x) / 2;
        const controlY = prevPoint.y + (y - prevPoint.y) * rng();
        
        points.push({ x: midX, y: controlY });
      }
      
      points.push({ x, y });
    }
    
    return points;
  };
  
  const seedRandom = (seed: number) => {
    return () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
  };
  
  const handleClick = () => {
    if (interactive && onClick) {
      onClick();
    }
    
    // Add a pulse animation
    controls.start({
      scale: [1, 1.05, 1],
      transition: { duration: 0.3 }
    });
  };

  return (
    <motion.div
      animate={controls}
      initial={{ opacity: 0 }}
      whileHover={interactive ? { scale: 1.05 } : undefined}
      onClick={handleClick}
      className={cn(
        "inline-block",
        interactive ? "cursor-pointer" : "",
        className
      )}
    >
      <canvas 
        ref={canvasRef}
        width={sizeMap[size].width}
        height={sizeMap[size].height}
        className="max-w-full"
      />
      {!signatureLoaded && (
        <div 
          style={{ 
            width: sizeMap[size].width,
            height: sizeMap[size].height
          }}
          className="bg-muted animate-pulse rounded"
        />
      )}
    </motion.div>
  );
};

export default CreatorSignature;
