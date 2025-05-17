
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Menu, Compass, Camera, User, Heart, Settings, Mail, Video } from 'lucide-react';

interface RadialMenuProps {
  onClose?: () => void;
  onNavigate?: (page: string) => void;
}

const RadialMenu: React.FC<RadialMenuProps> = ({ onClose, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(true);

    const handleEscape = (e: React.KeyboardEvent | KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    // Modified to use React's KeyboardEvent type
    document.addEventListener('keydown', handleEscape as unknown as EventListener);
    
    return () => {
      document.removeEventListener('keydown', handleEscape as unknown as EventListener);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      onClose && onClose();
    }, 300); // Match animation duration
  };

  const handleNavigate = (page: string) => {
    if (onNavigate) {
      setIsOpen(false);
      setTimeout(() => {
        onNavigate(page);
      }, 300);
    }
  };

  const menuItems = [
    { icon: <Compass size={24} />, label: 'Explorer', page: '/' },
    { icon: <Camera size={24} />, label: 'Stories', page: '/stories' },
    { icon: <Video size={24} />, label: 'Vidéos', page: '/videos' },
    { icon: <Mail size={24} />, label: 'Messages', page: '/messages' },
    { icon: <Heart size={24} />, label: 'Favoris', page: '/favorites' },
    { icon: <User size={24} />, label: 'Profil', page: '/profile' },
    { icon: <Settings size={24} />, label: 'Paramètres', page: '/settings' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40" onClick={handleClose}>
      <motion.div
        className="relative"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={isOpen ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div className="absolute top-1/2 left-1/2 -mt-12 -ml-12 h-24 w-24 rounded-full bg-primary/80 backdrop-blur-md shadow-xl shadow-primary/20 flex items-center justify-center">
          <button onClick={handleClose} className="text-white p-4">
            <X size={32} />
          </button>
        </motion.div>

        <div className="w-[300px] h-[300px] relative">
          <AnimatePresence>
            {isOpen &&
              menuItems.map((item, index) => {
                const angle = (index * (360 / menuItems.length) * Math.PI) / 180;
                const radius = 120;
                const x = radius * Math.cos(angle);
                const y = radius * Math.sin(angle);

                return (
                  <motion.div
                    key={item.page}
                    className="absolute w-16 h-16 top-[142px] left-[142px] -mt-8 -ml-8 flex flex-col items-center justify-center gap-1"
                    initial={{ scale: 0, x: 0, y: 0 }}
                    animate={{ scale: 1, x, y }}
                    exit={{ scale: 0, x: 0, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.04 }}
                    onClick={() => handleNavigate(item.page)}
                  >
                    <motion.div
                      className="w-14 h-14 rounded-full flex items-center justify-center text-white bg-gray-800/80 shadow-lg backdrop-blur-md cursor-pointer"
                      whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {item.icon}
                    </motion.div>
                    <motion.span
                      className="text-xs text-white font-medium bg-black/40 px-2 py-0.5 rounded-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.04 + 0.2 }}
                    >
                      {item.label}
                    </motion.span>
                  </motion.div>
                );
              })}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default RadialMenu;
