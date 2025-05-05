import React from 'react';
import ContentCard from './ContentCard';

export interface ContentGridProps {
  contents: Array<any>;
  layout?: 'grid' | 'masonry' | 'featured';
  className?: string;
  onItemClick?: (id: string) => void; // Add this prop
}

const ContentGrid: React.FC<ContentGridProps> = ({
  contents,
  layout = 'grid',
  className = '',
  onItemClick // Make it available here
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
