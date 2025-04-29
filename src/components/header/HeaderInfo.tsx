
import React from 'react';
import { MessageSquare, Bell, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CreatorBadge from '../CreatorBadge';

interface HeaderInfoProps {
  name: string;
  username: string;
  bio: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
}

const HeaderInfo = ({ name, username, bio, tier }: HeaderInfoProps) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between items-start">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-display font-bold">{name}</h1>
            <CreatorBadge tier={tier} />
          </div>

          <p className="text-muted-foreground">@{username}</p>
          <p className="text-sm max-w-lg">{bio}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="rounded-full"
          >
            <MessageSquare size={18} className="mr-1" />
            Message
          </Button>

          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-full w-9 p-0"
          >
            <Bell size={18} />
          </Button>

          <Button 
            variant="ghost" 
            size="sm" 
            className="rounded-full w-9 p-0"
          >
            <MoreHorizontal size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeaderInfo;
