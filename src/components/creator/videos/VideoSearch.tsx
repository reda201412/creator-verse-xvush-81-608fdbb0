
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface VideoSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const VideoSearch: React.FC<VideoSearchProps> = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="relative w-full md:w-96">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Rechercher des vidéos..."
        className="pl-10"
      />
    </div>
  );
};

export default VideoSearch;
