
import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import MobileMenu from './MobileMenu'; // Import the whole component

interface HeaderProps {
  onMenuClick?: () => void;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, className }) => {
  return (
    <div className={cn(
      "sticky top-0 z-40 w-full bg-background/95 backdrop-blur-sm border-b",
      className
    )}>
      <div className="container flex items-center gap-2 py-2">
        {onMenuClick && (
          <Button variant="ghost" size="sm" className="mr-2 px-2 md:flex hidden" onClick={onMenuClick}>
            <Menu className="h-4 w-4" />
          </Button>
        )}
        <div className="md:hidden">
          <MobileMenu />
        </div>
        <div className="flex-1">
          <Input type="search" placeholder="Rechercher..." className="md:max-w-[300px]" />
        </div>
      </div>
    </div>
  );
};

export default Header;
