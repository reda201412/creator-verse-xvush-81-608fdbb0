
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface OrganicFluidityContainerProps {
  children: React.ReactNode;
  intensity?: number; // 0-100
  speed?: number; // 0-100
  className?: string;
  interactive?: boolean;
  animated?: boolean;
}

const OrganicFluidityContainer: React.FC<OrganicFluidityContainerProps> = ({
  children,
  intensity = 50,
  speed = 50,
  className,
  interactive = true,
  animated = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const requestRef = useRef<number>();
  const mousePosition = useRef({ x: 0, y: 0 });
  const pointsRef = useRef<{ x: number; y: number; originX: number; originY: number; noiseOffsetX: number; noiseOffsetY: number }[]>([]);
  
  // Convert intensity and speed to usable values
  const actualIntensity = intensity * 0.5 / 100; // 0-0.5
  const actualSpeed = speed * 0.001 / 100; // 0-0.001
  
  // Initialize blob points
  useEffect(() => {
    if (!containerRef.current) return;
    
    const initializePoints = () => {
      // Create points for the blob
      const numPoints = 8;
      const angleStep = (Math.PI * 2) / numPoints;
      const points = [];
      
      for (let i = 0; i < numPoints; i++) {
        const angle = i * angleStep;
        const x = Math.cos(angle);
        const y = Math.sin(angle);
        
        // Random noise offsets for each point
        const noiseOffsetX = Math.random() * 1000;
        const noiseOffsetY = Math.random() * 1000;
        
        points.push({
          x,
          y,
          originX: x,
          originY: y,
          noiseOffsetX,
          noiseOffsetY
        });
      }
      
      pointsRef.current = points;
    };
    
    initializePoints();
    
    if (animated) {
      // Start animation loop
      const animate = () => {
        updateBlobPath();
        requestRef.current = requestAnimationFrame(animate);
      };
      
      requestRef.current = requestAnimationFrame(animate);
      
      // Clean up
      return () => {
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
        }
      };
    } else {
      // Just render once without animation
      updateBlobPath();
    }
  }, [animated, actualIntensity, actualSpeed]);
  
  // Handle mouse interaction
  useEffect(() => {
    if (!interactive) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      
      // Normalize mouse position to -1..1
      mousePosition.current = {
        x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
        y: ((e.clientY - rect.top) / rect.height) * 2 - 1
      };
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [interactive]);
  
  // Update blob path
  const updateBlobPath = () => {
    if (!pathRef.current || pointsRef.current.length === 0) return;
    
    const points = pointsRef.current;
    const time = Date.now() * actualSpeed;
    
    // Update points with perlin noise
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      
      // Simplified Perlin-like noise
      const nX = Math.sin(time + point.noiseOffsetX) * actualIntensity;
      const nY = Math.cos(time + point.noiseOffsetY) * actualIntensity;
      
      // Add mouse influence if interactive
      let mouseInfluenceX = 0;
      let mouseInfluenceY = 0;
      
      if (interactive) {
        const distX = point.originX - mousePosition.current.x;
        const distY = point.originY - mousePosition.current.y;
        const distance = Math.sqrt(distX * distX + distY * distY);
        const influence = Math.max(0, 1 - distance);
        
        mouseInfluenceX = distX * influence * 0.1;
        mouseInfluenceY = distY * influence * 0.1;
      }
      
      point.x = point.originX + nX - mouseInfluenceX;
      point.y = point.originY + nY - mouseInfluenceY;
    }
    
    // Create SVG path from points
    const svgPath = createSvgPath(points);
    pathRef.current.setAttribute('d', svgPath);
  };
  
  const createSvgPath = (points: typeof pointsRef.current) => {
    if (points.length === 0) return '';
    
    const size = 50; // SVG coordinate space size
    let path = `M ${points[0].x * size + size} ${points[0].y * size + size}`;
    
    for (let i = 0; i < points.length; i++) {
      const current = points[i];
      const next = points[(i + 1) % points.length];
      
      // Control points for smooth curve
      const cx = (current.x + next.x) / 2 * size + size;
      const cy = (current.y + next.y) / 2 * size + size;
      
      path += ` Q ${current.x * size + size} ${current.y * size + size}, ${cx} ${cy}`;
    }
    
    path += ' Z';
    return path;
  };

  return (
    <div 
      ref={containerRef} 
      className={cn("relative", className)}
    >
      <svg 
        className="absolute inset-0 w-full h-full -z-10 overflow-visible"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="blob-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(147, 112, 219, 0.1)" />
            <stop offset="100%" stopColor="rgba(72, 209, 204, 0.1)" />
          </linearGradient>
        </defs>
        <path 
          ref={pathRef}
          fill="url(#blob-gradient)"
          d="M 50 50 Q 50 50, 50 50"
          className="transition-all duration-500"
        />
      </svg>
      <div className="relative z-0">
        {children}
      </div>
    </div>
  );
};

export default OrganicFluidityContainer;
