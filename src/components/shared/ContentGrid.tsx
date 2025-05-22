
import React, { useState } from 'react';
import ContentCard from './ContentCard';
import { cn } from '@/lib/utils';
import { useMobile } from '@/hooks/useMobile';
import useHapticFeedback from '@/hooks/use-haptic-feedback';
import { motion } from 'framer-motion';
import { useNeuroAesthetic } from '@/hooks/use-neuro-aesthetic';

export interface ContentGridProps {
  contents: Array<any>;
  layout?: 'grid' | 'masonry' | 'featured' | 'vertical' | 'collections';
  className?: string;
  onItemClick?: (id: string) => void;
  isCreator?: boolean;
  showAnimations?: boolean;
}

const ContentGrid: React.FC<ContentGridProps> = ({
  contents,
  layout = 'grid',
  className = '',
  onItemClick,
  isCreator = false,
  showAnimations = true
}) => {
  const { isMobile } = useMobile();
  const { withHapticFeedback } = useHapticFeedback();
  const { triggerMicroReward } = useNeuroAesthetic();
  
  // Animation configuration
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 70 }
    }
  };
  
  if (!contents || contents.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground bg-muted/20 rounded-lg border border-border/40">
        Aucun contenu à afficher
      </div>
    );
  }

  // Mobile-optimized grid classes
  let gridClassName = "grid gap-4";

  switch (layout) {
    case 'masonry':
      gridClassName = cn(
        "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4",
        className
      );
      break;
    case 'featured':
      gridClassName = cn(
        "grid grid-cols-1 md:grid-cols-2 gap-6",
        className
      );
      break;
    case 'vertical':
      gridClassName = cn(
        "flex flex-col gap-4",
        className
      );
      break;
    case 'collections':
      gridClassName = cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
        className
      );
      break;
    default:
      gridClassName = cn(
        "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4",
        className
      );
  }

  const handleItemClick = (id: string) => {
    if (onItemClick) {
      // Use haptic feedback for enhanced interaction
      if ('vibrate' in navigator) {
        navigator.vibrate(15); // Medium vibration for content click
      }
      triggerMicroReward('interest');
      onItemClick(id);
    }
  };

  // Conditional rendering based on animations preference
  if (!showAnimations) {
    return (
      <div className={gridClassName}>
        {contents.map((item) => (
          <ContentCard
            key={item.id}
            imageUrl={item.imageUrl || item.thumbnailUrl}
            title={item.title}
            type={item.type}
            format={item.format}
            duration={item.duration}
            metrics={item.metrics}
            isCreator={isCreator}
            className={cn(
              layout === 'featured' && item.isFeatured ? "col-span-2 row-span-2" : "",
              isMobile ? "touch-manipulation haptic-feedback" : "" // Improve touch responsiveness with haptic feedback
            )}
            isTrending={item.isTrending}
            collectionName={item.collectionName}
            onClick={() => handleItemClick(item.id)}
          />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className={gridClassName}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {contents.map((item) => (
        <motion.div key={item.id} variants={itemVariants}>
          <ContentCard
            imageUrl={item.imageUrl || item.thumbnailUrl}
            title={item.title}
            type={item.type}
            format={item.format}
            duration={item.duration}
            metrics={item.metrics}
            isCreator={isCreator}
            className={cn(
              layout === 'featured' && item.isFeatured ? "col-span-2 row-span-2" : "",
              isMobile ? "touch-manipulation haptic-feedback" : "",
              "hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
            )}
            isTrending={item.isTrending}
            collectionName={item.collectionName}
            onClick={() => handleItemClick(item.id)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ContentGrid;
