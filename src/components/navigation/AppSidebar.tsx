
import React from 'react';
import { Home, Users, Video, MessageCircle, LayoutDashboard, Calendar, Star, FileVideo, TrendingUp } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const AppSidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  // Determine if user is a creator
  const isCreator = user?.user_metadata?.role === 'creator' || false;

  const navigationItems = [
    {
      title: "Accueil",
      url: "/",
      icon: Home,
    },
    {
      title: "Tendances",
      url: "/trending",
      icon: TrendingUp,
    },
    {
      title: "Créateurs",
      url: "/creators",
      icon: Users,
    },
    {
      title: "Messages",
      url: "/messages",
      icon: MessageCircle,
      requiresAuth: true,
    },
  ];

  const creatorItems = [
    {
      title: "Tableau de bord",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Mes Vidéos",
      url: "/videos",
      icon: FileVideo,
    },
    {
      title: "Calendrier",
      url: "/calendar",
      icon: Calendar,
    },
  ];

  const displayName = user?.user_metadata?.display_name || user?.email || "Utilisateur";

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <img 
            src="/lovable-uploads/0038954d-233c-440e-91b6-639b6b22bd82.png" 
            alt="XDose Logo" 
            className="w-8 h-8" 
          />
          <span className="text-lg font-semibold text-primary">XDose</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems
                .filter(item => !item.requiresAuth || user)
                .map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={location.pathname === item.url}
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isCreator && (
          <SidebarGroup>
            <SidebarGroupLabel>Créateur</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {creatorItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild
                      isActive={location.pathname === item.url}
                    >
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {user && (
        <SidebarFooter className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{displayName}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
};

export default AppSidebar;
