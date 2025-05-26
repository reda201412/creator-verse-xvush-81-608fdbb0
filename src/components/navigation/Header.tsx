
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <div className={cn(
      "sticky top-0 z-40 w-full bg-background/95 backdrop-blur-sm border-b",
      className
    )}>
      <div className="container flex items-center gap-2 py-2 px-4">
        <SidebarTrigger />
        <div className="flex-1">
          <Input type="search" placeholder="Rechercher..." className="md:max-w-[300px]" />
        </div>
      </div>
    </div>
  );
};

export default Header;
