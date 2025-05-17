import React from 'react';
// Remove unused import
// import { useState, useEffect } from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, Compass, PlusCircle, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link, useLocation } from 'react-router-dom';

interface BottomNavigationProps {
  className?: string;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ className }) => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!isMobile) return null;

  const navItems = [
    {
      icon: Home,
      label: 'Accueil',
      route: '/',
    },
    {
      icon: Compass,
      label: 'Explorer',
      route: '/explore',
    },
    {
      icon: PlusCircle,
      label: 'Créer',
      route: '/create',
    },
    {
      icon: User,
      label: 'Profil',
      route: '/profile',
    },
  ];

  return (
    <motion.nav
      className={cn(
        'fixed bottom-0 left-0 w-full bg-background/90 backdrop-blur-md border-t border-border/30 z-40',
        'flex items-center justify-around p-3',
        className
      )}
    >
      {navItems.map((item) => (
        <Link key={item.label} to={item.route}>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'h-10 w-10 rounded-full',
              location.pathname === item.route ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground'
            )}
          >
            <item.icon size={20} />
          </Button>
        </Link>
      ))}
    </motion.nav>
  );
};

export default BottomNavigation;
