
import React, { useEffect, useRef } from 'react';

interface GoldenRatioGridProps {
  visible?: boolean;
  opacity?: number;
  className?: string;
}

const GoldenRatioGrid: React.FC<GoldenRatioGridProps> = ({ 
  visible = false, 
  opacity = 0.05,
  className 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!visible || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawGoldenRatioGrid(ctx, canvas.width, canvas.height);
    };
    
    const drawGoldenRatioGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = `rgba(255, 215, 0, ${opacity})`;
      ctx.lineWidth = 0.5;
      
      // Golden ratio: 1.618033988749895
      const phi = 1.618033988749895;
      
      // Draw vertical golden ratio lines
      const startX = 0;
      let x = startX;
      while (x < width) {
        x += width / phi;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
        
        // Secondary lines
        const secondaryX = x - width / (phi * phi);
        if (secondaryX > 0) {
          ctx.strokeStyle = `rgba(255, 215, 0, ${opacity / 2})`;
          ctx.beginPath();
          ctx.moveTo(secondaryX, 0);
          ctx.lineTo(secondaryX, height);
          ctx.stroke();
          ctx.strokeStyle = `rgba(255, 215, 0, ${opacity})`;
        }
      }
      
      // Draw horizontal golden ratio lines
      const startY = 0;
      let y = startY;
      while (y < height) {
        y += height / phi;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
        
        // Secondary lines
        const secondaryY = y - height / (phi * phi);
        if (secondaryY > 0) {
          ctx.strokeStyle = `rgba(255, 215, 0, ${opacity / 2})`;
          ctx.beginPath();
          ctx.moveTo(0, secondaryY);
          ctx.lineTo(width, secondaryY);
          ctx.stroke();
          ctx.strokeStyle = `rgba(255, 215, 0, ${opacity})`;
        }
      }
      
      // Draw spiral
      const spiralSize = Math.min(width, height) * 0.4;
      const centerX = width / 2;
      const centerY = height / 2;
      
      ctx.strokeStyle = `rgba(255, 215, 0, ${opacity * 2})`;
      ctx.beginPath();
      
      let radius = 0;
      let angle = 0;
      const angleIncrement = 0.1;
      const growthFactor = 0.05;
      
      while (radius < spiralSize) {
        radius = growthFactor * angle;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        if (angle === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        
        angle += angleIncrement;
      }
      
      ctx.stroke();
    };
    
    // Initial draw and setup resize handler
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [visible, opacity]);
  
  if (!visible) return null;
  
  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 z-0 pointer-events-none ${className || ''}`}
    />
  );
};

export default GoldenRatioGrid;
