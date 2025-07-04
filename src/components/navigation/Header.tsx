
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { HamburgerMenu } from './MobileMenu';
import { useResponsive } from '@/hooks/use-responsive';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const { isMobile } = useResponsive();

  return (
    <div className={cn(
      "sticky top-0 z-40 w-full bg-background/95 backdrop-blur-sm border-b",
      className
    )}>
      <div className="flex items-center gap-2 py-2 px-2 sm:px-4">
        {/* Desktop sidebar trigger */}
        {!isMobile && <SidebarTrigger />}
        
        {/* Mobile hamburger menu */}
        {isMobile && <HamburgerMenu />}
        
        <div className="flex-1">
          <Input 
            type="search" 
            placeholder="Rechercher..." 
            className={cn(
              "w-full",
              !isMobile && "md:max-w-[300px]"
            )} 
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
