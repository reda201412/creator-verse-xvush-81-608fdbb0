
import React from 'react';
import ContentCard from './ContentCard';
import { cn } from '@/lib/utils';

interface Content {
  id: string;
  imageUrl: string;
  title?: string;
  type: 'premium' | 'vip' | 'standard';
  metrics?: {
    likes?: number;
    comments?: number;
    views?: number;
    revenue?: number;
  };
}

interface ContentGridProps {
  contents: Content[];
  layout?: 'grid' | 'masonry' | 'featured';
  className?: string;
  isCreator?: boolean;
}

const ContentGrid = ({ 
  contents, 
  layout = 'grid', 
  className,
  isCreator = false
}: ContentGridProps) => {
  if (layout === 'featured') {
    // First item is featured (larger), rest are in a standard grid
    const featured = contents[0];
    const rest = contents.slice(1);
    
    return (
      <div className={cn("space-y-4", className)}>
        {featured && (
          <ContentCard 
            imageUrl={featured.imageUrl}
            title={featured.title}
            type={featured.type}
            metrics={featured.metrics}
            size="lg"
            isCreator={isCreator}
            className="w-full"
          />
        )}
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
          {rest.map((content) => (
            <ContentCard 
              key={content.id}
              imageUrl={content.imageUrl}
              title={content.title}
              type={content.type}
              metrics={content.metrics}
              isCreator={isCreator}
            />
          ))}
        </div>
      </div>
    );
  }
  
  if (layout === 'masonry') {
    // Create an irregular grid for visual interest
    return (
      <div className={cn("grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 auto-rows-max", className)}>
        {contents.map((content, index) => (
          <ContentCard 
            key={content.id}
            imageUrl={content.imageUrl}
            title={content.title}
            type={content.type}
            metrics={content.metrics}
            isCreator={isCreator}
            size={index % 5 === 0 ? 'lg' : index % 7 === 0 ? 'sm' : 'md'}
            className={
              index % 5 === 0 ? 'col-span-2 row-span-2' : ''
            }
          />
        ))}
      </div>
    );
  }
  
  // Default grid layout
  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4", className)}>
      {contents.map((content) => (
        <ContentCard 
          key={content.id}
          imageUrl={content.imageUrl}
          title={content.title}
          type={content.type}
          metrics={content.metrics}
          isCreator={isCreator}
        />
      ))}
    </div>
  );
};

export default ContentGrid;
