import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface Layer {
  id: string;
  depth: number; // 0-1, 0 = closest (most movement), 1 = furthest (least movement)
  children: React.ReactNode;
  className?: string;
}

interface ParallaxLayersProps {
  layers: Layer[];
  sensitivity?: number; // 0-1, default 0.5
  className?: string;
  mouseParallax?: boolean;
  scrollParallax?: boolean;
}

// Composant de couche séparé pour utiliser useTransform correctement
const ParallaxLayer: React.FC<{
  layer: Layer;
  mousePosition: { x: number; y: number };
  scrollYProgress: any;
  moveFactor: number;
  mouseParallax: boolean;
  scrollParallax: boolean;
}> = ({ layer, mousePosition, scrollYProgress, moveFactor, mouseParallax, scrollParallax }) => {
  // Pour le parallaxe de souris
  const x = mouseParallax ? mousePosition.x * moveFactor : 0;
  const y = mouseParallax ? mousePosition.y * moveFactor : 0;
  
  // Pour le parallaxe de défilement
  const scrollY = useTransform(
    scrollYProgress, 
    [0, 1], 
    [moveFactor * 2, -moveFactor * 2]
  );

  return (
    <motion.div
      key={layer.id}
      className={`absolute inset-0 ${layer.className || ''}`}
      style={{ 
        x: mouseParallax ? x : 0,
        y: mouseParallax ? y : (scrollParallax ? scrollY : 0),
        zIndex: Math.round(layer.depth * 10),
        willChange: 'transform'
      }}
      transition={{ 
        type: "spring", 
        stiffness: 60, 
        damping: 30,
        mass: layer.depth + 0.5 // Higher depth = more mass = slower movement
      }}
    >
      {layer.children}
    </motion.div>
  );
};

const ParallaxLayers: React.FC<ParallaxLayersProps> = ({
  layers,
  sensitivity = 0.5,
  className,
  mouseParallax = true,
  scrollParallax = true,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // For scroll parallax
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });
  
  // Handle mouse movement for parallax effect
  useEffect(() => {
    if (!mouseParallax) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      
      // Get container dimensions and position
      const { width, height, left, top } = ref.current.getBoundingClientRect();
      
      // Calculate mouse position relative to container center
      const x = ((e.clientX - left) / width - 0.5) * 2;
      const y = ((e.clientY - top) / height - 0.5) * 2;
      
      setMousePosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseParallax]);
  
  return (
    <div 
      ref={ref} 
      className={`relative overflow-hidden ${className || ''}`}
    >
      {layers.map((layer) => {
        // Calculate movement amount based on depth (0-1) and sensitivity
        // Depth of 0 means most movement, 1 means least movement
        const moveFactor = (1 - layer.depth) * sensitivity * 20;
        
        return (
          <ParallaxLayer
            key={layer.id}
            layer={layer}
            mousePosition={mousePosition}
            scrollYProgress={scrollYProgress}
            moveFactor={moveFactor}
            mouseParallax={mouseParallax}
            scrollParallax={scrollParallax}
          />
        );
      })}
    </div>
  );
};

export default ParallaxLayers;
