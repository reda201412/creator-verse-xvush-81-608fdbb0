
import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface AppleGradeTransitionProps {
  children: React.ReactNode;
  isActive?: boolean;
  type?: 'fade' | 'slide' | 'zoom' | 'flip' | 'parallax';
  duration?: number;
  delay?: number;
  className?: string;
}

const AppleGradeTransition: React.FC<AppleGradeTransitionProps> = ({
  children,
  isActive = true,
  type = 'fade',
  duration = 0.5,
  delay = 0,
  className
}) => {
  const [key, setKey] = useState(0);
  
  // Animation variants based on type
  const variants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration, ease: [0.25, 0.1, 0.25, 1.0], delay } },
      exit: { opacity: 0, transition: { duration: duration * 0.75, ease: [0.25, 0.1, 0.25, 1.0] } }
    },
    slide: {
      initial: { opacity: 0, y: 20 },
      animate: { 
        opacity: 1, 
        y: 0, 
        transition: { 
          duration, 
          ease: [0.25, 0.1, 0.25, 1.0], 
          delay,
          y: { type: "spring", stiffness: 300, damping: 30, delay }
        } 
      },
      exit: { 
        opacity: 0, 
        y: -10,
        transition: { 
          duration: duration * 0.75,
          ease: [0.25, 0.1, 0.25, 1.0],
          y: { type: "spring", stiffness: 500, damping: 50 } 
        } 
      }
    },
    zoom: {
      initial: { opacity: 0, scale: 0.96 },
      animate: { 
        opacity: 1, 
        scale: 1,
        transition: { 
          duration, 
          ease: [0.25, 0.1, 0.25, 1.0], 
          delay,
          scale: { type: "spring", stiffness: 300, damping: 30, delay }
        } 
      },
      exit: { 
        opacity: 0, 
        scale: 1.02,
        transition: { 
          duration: duration * 0.75, 
          ease: [0.25, 0.1, 0.25, 1.0], 
          scale: { type: "spring", stiffness: 500, damping: 50 }
        } 
      }
    },
    flip: {
      initial: { opacity: 0, rotateX: 15 },
      animate: { 
        opacity: 1, 
        rotateX: 0,
        transition: { 
          duration, 
          ease: [0.25, 0.1, 0.25, 1.0], 
          delay,
          rotateX: { type: "spring", stiffness: 300, damping: 30, delay }
        } 
      },
      exit: { 
        opacity: 0, 
        rotateX: -15,
        transition: { 
          duration: duration * 0.75, 
          ease: [0.25, 0.1, 0.25, 1.0],
          rotateX: { type: "spring", stiffness: 500, damping: 50 }
        } 
      }
    },
    parallax: {
      initial: { opacity: 0, y: 20, scale: 0.98 },
      animate: { 
        opacity: 1, 
        y: 0,
        scale: 1,
        transition: { 
          duration, 
          ease: [0.25, 0.1, 0.25, 1.0], 
          delay,
          scale: { delay: delay + 0.1 }
        } 
      },
      exit: { 
        opacity: 0, 
        y: -10,
        scale: 1.02,
        transition: { 
          duration: duration * 0.75, 
          ease: [0.25, 0.1, 0.25, 1.0] 
        } 
      }
    }
  };

  // Update key when isActive changes to force re-render
  useEffect(() => {
    if (isActive) {
      setKey(prev => prev + 1);
    }
  }, [isActive]);

  const selectedVariant = variants[type];

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          key={key}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={selectedVariant}
          className={className}
          style={{ willChange: 'transform, opacity' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AppleGradeTransition;
