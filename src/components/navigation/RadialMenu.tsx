
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

interface RadialMenuItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  color?: string;
  action: () => void;
}

interface RadialMenuProps {
  items: RadialMenuItem[];
  isOpen: boolean;
  onClose: () => void;
  originX: number;
  originY: number;
}

const RadialMenu = ({ items, isOpen, onClose, originX, originY }: RadialMenuProps) => {
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();
  
  // Calculate positions in a circle around the center point
  const getItemPosition = (index: number, total: number, radius: number) => {
    const angle = (index / total) * 2 * Math.PI;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    return { x, y };
  };

  // Handle click outside
  useEffect(() => {
    if (!isOpen) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      if (isOpen) {
        onClose();
      }
    };
    
    // Add a small delay to avoid immediate closing
    setTimeout(() => {
      setMounted(true);
      document.addEventListener('click', handleClickOutside);
    }, 10);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
      setMounted(false);
    };
  }, [isOpen, onClose]);

  const handleItemClick = (item: RadialMenuItem) => {
    item.action();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div 
            className="absolute rounded-full bg-background/80 backdrop-blur-md shadow-lg border border-border"
            style={{ 
              width: '300px', 
              height: '300px',
              left: originX - 150,
              top: originY - 150,
            }}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {items.map((item, index) => {
              const { x, y } = getItemPosition(index, items.length, 100);
              
              return (
                <motion.button
                  key={item.id}
                  className={cn(
                    "absolute rounded-full flex flex-col items-center justify-center",
                    "w-16 h-16 bg-background shadow-md border border-border",
                    "hover:scale-110 transition-transform"
                  )}
                  style={{ 
                    left: 'calc(50% + ' + x + 'px - 32px)',
                    top: 'calc(50% + ' + y + 'px - 32px)',
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleItemClick(item)}
                >
                  <div className="text-xl">{item.icon}</div>
                  <div className="text-[10px] mt-1 font-medium">{item.label}</div>
                </motion.button>
              );
            })}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RadialMenu;
