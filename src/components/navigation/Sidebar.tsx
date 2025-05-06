
import React, { useEffect, useState } from 'react';
import { LucideIcon, Home, Video, Medal, MessageCircle, Calendar, Layers, Users, DollarSign, Wallet, Settings, Menu, Film, BookOpen, Image, TrendingUp } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import ProfileAvatar from '@/components/ProfileAvatar';
import StoryPublisher from '@/components/stories/StoryPublisher';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

// Updated common navigation items with Trending
const commonNavItems: NavItem[] = [
  { href: '/', label: 'Accueil', icon: Home },
  { href: '/creators', label: 'Créateurs', icon: Users },
  { href: '/trending', label: 'Tendances', icon: TrendingUp },
  { href: '/stories', label: 'Stories', icon: Image },
];

const creatorNavItems: NavItem[] = [
  { href: '/dashboard', label: 'Tableau de bord', icon: Home },
  { href: '/videos', label: 'Vidéos', icon: Film },
  { href: '/exclusive', label: 'Contenu Exclusif', icon: BookOpen },
  { href: '/subscribers', label: 'Abonnés', icon: Users },
  { href: '/revenue', label: 'Revenus', icon: DollarSign },
  { href: '/calendar', label: 'Calendrier', icon: Calendar },
];

const accountNavItems: NavItem[] = [
  { href: '/messages', label: 'Messages', icon: MessageCircle },
  { href: '/tokens', label: 'Tokens', icon: Wallet },
  { href: '/settings', label: 'Paramètres', icon: Settings },
];

export const DesktopSidebar: React.FC = () => {
  const location = useLocation();
  const { user, profile, isCreator } = useAuth();
  
  // Added a state to ensure the sidebar is active
  const [isActive, setIsActive] = useState(true);

  return (
    <aside className="hidden md:flex flex-col w-64 border-r bg-secondary/10 h-screen fixed z-10">
      <div className="p-4">
        {profile && profile.avatar_url ? (
          <ProfileAvatar 
            src={profile.avatar_url} 
            alt={profile.display_name || profile.username} 
          />
        ) : (
          <div className="rounded-full bg-muted w-12 h-12 flex items-center justify-center">
            {profile?.display_name?.charAt(0) || profile?.username?.charAt(0) || '?'}
          </div>
        )}
      </div>
      <Separator />
      <nav className="flex flex-col flex-1 p-2 space-y-1 overflow-y-auto">
        {commonNavItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center space-x-2 rounded-md p-2 text-sm font-medium hover:bg-secondary hover:text-foreground cursor-pointer",
                isActive ? "bg-secondary text-foreground" : "text-muted-foreground"
              )
            }
          >
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </NavLink>
        ))}
        {isCreator && (
          <>
            <Separator className="my-2" />
            {creatorNavItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center space-x-2 rounded-md p-2 text-sm font-medium hover:bg-secondary hover:text-foreground cursor-pointer",
                    isActive ? "bg-secondary text-foreground" : "text-muted-foreground"
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </>
        )}
        <Separator className="my-2" />
        {accountNavItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center space-x-2 rounded-md p-2 text-sm font-medium hover:bg-secondary hover:text-foreground cursor-pointer",
                isActive ? "bg-secondary text-foreground" : "text-muted-foreground"
              )
            }
          >
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export const MobileSidebar: React.FC = () => {
  const location = useLocation();
  const { user, profile, isCreator } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile) {
      setIsOpen(false);
    }
  }, [isMobile]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-3/4 sm:w-2/3">
        <SheetHeader className="text-left">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        {profile && (
          <div className="p-4">
            {profile.avatar_url ? (
              <ProfileAvatar 
                src={profile.avatar_url} 
                alt={profile.display_name || profile.username} 
              />
            ) : (
              <div className="rounded-full bg-muted w-12 h-12 flex items-center justify-center">
                {profile.display_name?.charAt(0) || profile.username.charAt(0)}
              </div>
            )}
          </div>
        )}
        <Separator />
        <nav className="flex flex-col flex-1 p-2 space-y-1">
          {commonNavItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center space-x-2 rounded-md p-2 text-sm font-medium hover:bg-secondary hover:text-foreground",
                  isActive ? "bg-secondary text-foreground" : "text-muted-foreground"
                )
              }
              onClick={() => setIsOpen(false)}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </NavLink>
          ))}
          {isCreator && (
            <>
              <Separator className="my-2" />
              {creatorNavItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center space-x-2 rounded-md p-2 text-sm font-medium hover:bg-secondary hover:text-foreground",
                      isActive ? "bg-secondary text-foreground" : "text-muted-foreground"
                    )
                  }
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </>
          )}
          <Separator className="my-2" />
          {accountNavItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center space-x-2 rounded-md p-2 text-sm font-medium hover:bg-secondary hover:text-foreground",
                  isActive ? "bg-secondary text-foreground" : "text-muted-foreground"
                )
              }
              onClick={() => setIsOpen(false)}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
};
