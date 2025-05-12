
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Users, Video, MessageCircle, User, Settings, LogOut, LayoutDashboard, Calendar, Star, FileVideo, LucideIcon } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useResponsive } from '@/hooks/use-responsive';
import { RouteChangeProps } from '@/types/navigation';

interface NavItem {
  icon: LucideIcon;
  label: string;
  href: string;
  requiresAuth?: boolean;
  creatorOnly?: boolean;
}

interface DesktopSidebarProps {
  expanded: boolean;
  onToggle: () => void;
}

export function DesktopSidebar({ expanded, onToggle }: DesktopSidebarProps) {
  const { user, profile, signOut, isCreator } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const { isMobile } = useResponsive();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Add listener for route changes to close sidebar on mobile
  useEffect(() => {
    if (isMobile && expanded) {
      onToggle();
    }
  }, [location.pathname, isMobile, expanded, onToggle]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur de déconnexion",
        description: "Une erreur s'est produite lors de la déconnexion. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  const navItems: NavItem[] = [
    { icon: Home, label: 'Accueil', href: '/' },
    { icon: Users, label: 'Créateurs', href: '/creators' },
    { icon: Star, label: 'Tendances', href: '/trending' },
    { icon: MessageCircle, label: 'Messages', href: '/messages', requiresAuth: true },
    { icon: LayoutDashboard, label: 'Tableau de bord', href: '/dashboard', requiresAuth: true, creatorOnly: true },
    { icon: FileVideo, label: 'Vidéos', href: '/videos', requiresAuth: true, creatorOnly: true },
    { icon: Calendar, label: 'Calendrier', href: '/calendar', requiresAuth: true, creatorOnly: true },
    { icon: Settings, label: 'Paramètres', href: '/settings', requiresAuth: true },
  ];

  const filteredNavItems = navItems.filter(item =>
    !item.requiresAuth || (item.requiresAuth && user) &&
    (!item.creatorOnly || (item.creatorOnly && isCreator))
  );

  if (!isMounted) {
    return null;
  }

  return (
    <div
      className={cn(
        "border-r flex-col py-4 fixed left-0 top-0 z-50 h-screen bg-background border-border transition-transform duration-300 w-64",
        isMobile ? (expanded ? "translate-x-0" : "-translate-x-full") : "translate-x-0",
      )}
    >
      <div className="px-6 flex items-center mb-6">
        <Avatar className="mr-2">
          <AvatarImage src={profile?.avatarUrl} />
          <AvatarFallback>{profile?.username?.charAt(0).toUpperCase() || '?'}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{profile?.username || 'Chargement...'}</p>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
      </div>
      <ScrollArea className="flex-1 space-y-4 px-3">
        <div className="space-y-1">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary hover:text-foreground",
                  isActive ? "bg-secondary text-foreground font-semibold" : "text-muted-foreground",
                  isActive && "sidebar-active-link"
                )
              }
              onClick={() => isMobile && expanded ? onToggle() : null}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4">
        <button
          onClick={handleSignOut}
          className="group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary hover:text-foreground text-muted-foreground w-full"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Déconnexion
        </button>
      </div>
    </div>
  );
}

export const Sidebar = DesktopSidebar;
