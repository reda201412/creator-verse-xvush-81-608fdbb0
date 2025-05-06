
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, Video, MessageCircle, User, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { useMobile } from '@/hooks/useMobile';

export interface BottomNavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  requiresAuth?: boolean;
  creatorOnly?: boolean;
}

export const BottomNavigation = () => {
  const { isMobile } = useMobile();
  const { user, isCreator } = useAuth();
  
  if (!isMobile) return null;
  
  // Define navigation items
  const navItems: BottomNavItem[] = [
    { icon: <Home size={20} />, label: 'Accueil', href: '/' },
    { icon: <TrendingUp size={20} />, label: 'Tendances', href: '/trending' },
    { icon: <Users size={20} />, label: 'Créateurs', href: '/creators' },
    { 
      icon: <MessageCircle size={20} />, 
      label: 'Messages', 
      href: '/messages',
      requiresAuth: true
    },
    { 
      icon: isCreator ? <Video size={20} /> : <User size={20} />,
      label: isCreator ? 'Vidéos' : 'Profil',
      href: isCreator ? '/videos' : '/settings',
      requiresAuth: true 
    },
  ];
  
  // Filter items based on auth state
  const filteredItems = navItems.filter(item => 
    !item.requiresAuth || (item.requiresAuth && user) && 
    (!item.creatorOnly || (item.creatorOnly && isCreator))
  );

  return (
    <motion.nav 
      className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t z-50"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex justify-around items-center">
        {filteredItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center py-3 px-2 flex-1 transition-colors",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  {item.icon}
                  {isActive && (
                    <motion.div
                      layoutId="bottomNavIndicator"
                      className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 h-1 w-5 bg-primary rounded-full"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </div>
                <span className="text-xs mt-1">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
      
      {/* Safe area for iOS devices */}
      <div className="h-safe-bottom bg-background" />
    </motion.nav>
  );
};

export default BottomNavigation;
