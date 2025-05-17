import React from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
// Remove unused import
// import { Button } from '@/components/ui/button';

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
