
import React from 'react';
import { Link } from 'react-router-dom';
import { HamburgerMenu } from './Sidebar';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={`flex items-center justify-between p-4 ${className}`}>
      <Link to="/" className="text-xvush-pink text-2xl font-bold">
        XVush
      </Link>
      <HamburgerMenu />
    </header>
  );
};

export default Header;
