
import React from 'react';
import { cn } from '@/lib/utils';
import CreatorBadge from '@/components/CreatorBadge';
import { Button } from '@/components/ui/button';
import { Bell, Mail, Share2, Flag } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderInfoProps {
  name: string;
  username: string;
  bio: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  className?: string;
}

const HeaderInfo: React.FC<HeaderInfoProps> = ({
  name,
  username,
  bio,
  tier,
  className
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">{name}</h1>
          <CreatorBadge tier={tier} />
        </div>
        
        <div className="flex gap-1.5">
          <Button variant="outline" size="icon">
            <Bell size={16} className="text-muted-foreground" />
          </Button>
          <Button variant="outline" size="icon">
            <Mail size={16} className="text-muted-foreground" />
          </Button>
          <Button variant="outline" size="icon">
            <Share2 size={16} className="text-muted-foreground" />
          </Button>
          <Button variant="outline" size="icon">
            <Flag size={16} className="text-muted-foreground" />
          </Button>
        </div>
      </div>
      
      <div>
        <p className="text-sm text-muted-foreground">@{username}</p>
        
        <motion.div 
          className="mt-3 text-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {bio}
        </motion.div>
      </div>
    </div>
  );
};

export default HeaderInfo;
