
import React from 'react';
import { Link } from 'react-router-dom';
import { HamburgerMenu } from './MobileMenu';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const isMobile = useIsMobile();
  
  return (
    <header className={`flex items-center justify-between p-4 ${className}`}>
      <Link to="/" className="text-xvush-pink text-2xl font-bold transition-transform hover:scale-105">
        XVush
      </Link>
      {isMobile && <HamburgerMenu />}
    </header>
  );
};

export default Header;
