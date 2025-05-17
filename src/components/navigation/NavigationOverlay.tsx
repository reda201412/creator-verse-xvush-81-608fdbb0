
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RadialMenu from './RadialMenu';
import ContentFilters from './ContentFilters';
import ZoomControls from './ZoomControls';
import { cn } from '@/lib/utils';
import { 
  Grid, 
  List, 
  Filter,
  Crown,
  Star,
  Heart,
  MessageSquare,
  Send,
  Share2,
  Bookmark,
  Heart as HeartIcon
} from 'lucide-react';

interface NavigationOverlayProps {
  isRadialMenuOpen: boolean;
  onRadialMenuClose: () => void;
  radialMenuPosition: { x: number; y: number };
  activeFilter: string;
  onFilterChange: (filterId: string) => void;
  zoomLevel: number;
  onZoomChange: (level: number) => void;
  onEnterImmersiveMode: () => void;
  className?: string;
}

const NavigationOverlay = ({
  isRadialMenuOpen,
  onRadialMenuClose,
  radialMenuPosition,
  activeFilter,
  onFilterChange,
  zoomLevel,
  onZoomChange,
  onEnterImmersiveMode,
  className
}: NavigationOverlayProps) => {
  // Radial menu items definition
  const radialMenuItems = [
    {
      id: 'grid',
      icon: <Grid size={16} />,
      label: 'Grid',
      action: () => onFilterChange('grid')
    },
    {
      id: 'list',
      icon: <List size={16} />,
      label: 'List',
      action: () => onFilterChange('list')
    },
    {
      id: 'premium',
      icon: <Crown size={16} />,
      label: 'Premium',
      action: () => onFilterChange('premium')
    },
    {
      id: 'vip',
      icon: <Star size={16} />,
      label: 'VIP',
      action: () => onFilterChange('vip')
    },
    {
      id: 'favorites',
      icon: <Heart size={16} />,
      label: 'Favorites',
      action: () => onFilterChange('favorites')
    },
    {
      id: 'comments',
      icon: <MessageSquare size={16} />,
      label: 'Comments',
      action: () => onFilterChange('comments')
    },
    {
      id: 'send',
      icon: <Send size={16} />,
      label: 'Send',
      action: () => console.log('Send clicked')
    },
    {
      id: 'share',
      icon: <Share2 size={16} />,
      label: 'Share',
      action: () => console.log('Share clicked')
    },
  ];
  
  return (
    <div className={cn("relative", className)}>
      {/* Content filters */}
      <ContentFilters 
        activeFilter={activeFilter}
        onFilterChange={onFilterChange}
      />
      
      {/* Zoom controls */}
      <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-30">
        <ZoomControls
          zoomLevel={zoomLevel}
          onZoomChange={onZoomChange}
          onEnterImmersiveMode={onEnterImmersiveMode}
        />
      </div>
      
      {/* Radial menu */}
      <RadialMenu 
        items={radialMenuItems}
        isOpen={isRadialMenuOpen}
        onClose={onRadialMenuClose}
        originX={radialMenuPosition.x}
        originY={radialMenuPosition.y}
      />
      
      {/* Quick action buttons (floating) */}
      <div className="fixed right-4 bottom-20 flex flex-col gap-2 z-30">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
        >
          <HeartIcon size={20} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-secondary text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
        >
          <Bookmark size={20} />
        </motion.button>
      </div>
    </div>
  );
};

export default NavigationOverlay;
