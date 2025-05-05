
import React from 'react';
import ContentCard from './ContentCard';

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
  isCreator
}) => {
  // Component implementation would go here
  // This is a stub to add the onItemClick prop to the type definition
  return (
    <div>
      {/* Component content */}
    </div>
  );
};

export default ContentGrid;
