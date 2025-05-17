import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface RadialMenuItem {
  icon: React.ReactNode;
  label: string;
  action: () => void;
}

interface RadialMenuProps {
  items: RadialMenuItem[];
  onSelect: (item: RadialMenuItem) => void;
  onClose: () => void;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
}

const RadialMenu = ({ items, onSelect, onClose, position = 'center' }: RadialMenuProps) => {
  const [visible, setVisible] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setVisible(false);
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setVisible(false);
        onClose();
      }
    };

    if (visible) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [visible, onClose]);

  const calculateItemPosition = (index: number, totalItems: number) => {
    const angle = (index / totalItems) * 2 * Math.PI - Math.PI / 2;
    const radius = 80;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    return { x, y };
  };

  const handleItemClick = (item: RadialMenuItem) => {
    onSelect(item);
    item.action();
    setVisible(false);
    onClose();
  };

  const menuVariants = {
    open: { scale: 1, opacity: 1, transition: { duration: 0.2, ease: "easeInOut" } },
    closed: { scale: 0.5, opacity: 0, transition: { duration: 0.2, ease: "easeInOut" } },
  };

  const itemVariants = {
    open: { opacity: 1, y: 0, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
    closed: { opacity: 0, y: 0, x: 0, transition: { duration: 0.2, ease: "easeIn" } },
  };

  const getMenuPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-0 left-0 origin-top-left';
      case 'top-right':
        return 'top-0 right-0 origin-top-right';
      case 'bottom-left':
        return 'bottom-0 left-0 origin-bottom-left';
      case 'bottom-right':
        return 'bottom-0 right-0 origin-bottom-right';
      case 'center':
      default:
        return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 origin-center';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setVisible(!visible)}
        className="p-2 rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors duration-200"
      >
        Menu
      </button>

      <AnimatePresence>
        {visible && (
          <motion.div
            ref={menuRef}
            className={cn(
              "absolute z-50 w-48 h-48",
              getMenuPositionClasses(),
              "bg-background shadow-lg rounded-full flex items-center justify-center"
            )}
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            {items.map((item, index) => {
              const { x, y } = calculateItemPosition(index, items.length);
              return (
                <motion.button
                  key={index}
                  className="absolute w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-200"
                  style={{ x, y }}
                  onClick={() => handleItemClick(item)}
                  variants={itemVariants}
                >
                  {item.icon}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RadialMenu;
