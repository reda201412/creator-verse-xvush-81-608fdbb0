
import React from 'react';
import ContentCard from './ContentCard';
import { cn } from '@/lib/utils';

export interface ContentGridProps {
  contents: Array<any>;
  layout?: 'grid' | 'masonry' | 'featured' | 'vertical' | 'collections';
  className?: string;
  onItemClick?: (id: string) => void;
  isCreator?: boolean;
}

const ContentGrid: React.FC<ContentGridProps> = ({
  contents,
  layout = 'grid',
  className = '',
  onItemClick,
  isCreator = false
}) => {
  if (!contents || contents.length === 0) {
    return <div className="text-center p-8 text-muted-foreground">Aucun contenu à afficher</div>;
  }

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
          className={layout === 'featured' && item.isFeatured ? "col-span-2 row-span-2" : ""}
          isTrending={item.isTrending}
          collectionName={item.collectionName}
          onClick={() => onItemClick && onItemClick(item.id)}
        />
      ))}
    </div>
  );
};

export default ContentGrid;
