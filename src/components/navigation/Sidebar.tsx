
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, LayoutDashboard, Calendar, Users, MessageSquare, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

const navigationItems = [
  {
    title: 'Home',
    path: '/',
    icon: Home,
  },
  {
    title: 'Creator',
    path: '/creator',
    icon: User,
  },
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Calendar',
    path: '/calendar',
    icon: Calendar,
  },
  {
    title: 'Subscribers',
    path: '/subscribers',
    icon: Users,
  },
  {
    title: 'Messages',
    path: '/messages',
    icon: MessageSquare,
  },
];

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="text-black dark:text-white">
            <Menu size={24} />
            <span className="sr-only">Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-60 p-0 bg-gray-50 dark:bg-gray-900">
          <div className="flex justify-end p-4">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X size={24} />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <div className="px-3 py-2">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-md text-sm font-medium transition-colors",
                  location.pathname === item.path
                    ? "bg-gray-200 dark:bg-gray-800 text-primary border-l-4 border-primary"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
              >
                <item.icon size={18} />
                <span>{item.title}</span>
              </Link>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

const DesktopSidebar = () => {
  const location = useLocation();

  return (
    <div className="hidden md:block">
      <SidebarProvider>
        <Sidebar className="border-r">
          <SidebarContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.path}
                    tooltip={item.title}
                  >
                    <Link to={item.path} className={cn(
                      "flex items-center gap-3",
                      location.pathname === item.path && "bg-gray-100 dark:bg-gray-800"
                    )}>
                      <item.icon size={18} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    </div>
  );
};

export { HamburgerMenu, DesktopSidebar };
