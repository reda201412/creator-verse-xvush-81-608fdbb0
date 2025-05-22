
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CalendarClock } from 'lucide-react';

interface HeaderInfoProps {
  joinDate?: string;
  location?: string;
  tags?: string[];
}

const HeaderInfo = ({
  joinDate,
  location,
  tags = []
}: HeaderInfoProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Membre récent';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
        <CalendarClock className="h-4 w-4" />
        <span>A rejoint en {formatDate(joinDate)}</span>
        {location && (
          <>
            <span className="mx-1">•</span>
            <span>{location}</span>
          </>
        )}
      </div>
      
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default HeaderInfo;
