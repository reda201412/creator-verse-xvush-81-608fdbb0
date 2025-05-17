
import React from 'react';
// Remove unused motion import
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
// Remove commented out Button import

interface ContentFiltersProps {
  filters: {
    label: string;
    value: string;
  }[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const ContentFilters: React.FC<ContentFiltersProps> = ({ filters, activeFilter, onFilterChange }) => {
  return (
    <Tabs defaultValue={activeFilter} className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        {filters.map(filter => (
          <TabsTrigger 
            key={filter.value} 
            value={filter.value} 
            className="data-[state=active]:bg-muted data-[state=active]:text-foreground"
            onClick={() => onFilterChange(filter.value)}
          >
            {filter.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default ContentFilters;
