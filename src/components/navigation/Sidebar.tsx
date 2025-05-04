import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Home,
  User,
  Calendar,
  BarChart2,
  MessageCircle,
  Users,
  Settings,
  Bell,
  LogOut
} from "lucide-react";
import ProfileAvatar from "@/components/ProfileAvatar";
import { useNeuroAesthetic } from "@/hooks/use-neuro-aesthetic";

interface SidebarProps {
  className?: string;
}

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem = ({ to, icon, label }: NavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  const { triggerMicroReward } = useNeuroAesthetic();

  return (
    <Link to={to} onClick={() => triggerMicroReward("tab")}>
      <motion.div
        className={cn(
          "relative flex items-center group rounded-lg py-3 px-3 my-1 transition-all duration-200",
          isActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
        )}
        layout
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
        }}
      >
        <div className="flex items-center">
          <span className="text-xl">{icon}</span>
          <span className="ml-3 font-medium text-sm">{label}</span>
        </div>
        {isActive && (
          <motion.div
            className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-primary"
            layoutId="activeSidebarIndicator"
          />
        )}
      </motion.div>
    </Link>
  );
};

export const DesktopSidebar: React.FC<SidebarProps> = ({ className }) => {
  return (
    <div
      className={cn(
        "hidden border-r flex-col fixed h-screen z-20 bg-background w-[260px] p-3",
        className
      )}
    >
      <div className="flex flex-col flex-1 overflow-y-auto px-3 py-4">
        <Link to="/">
          <div className="flex items-center gap-2 pb-2 mb-4 border-b">
            <img 
              src="/lovable-uploads/0038954d-233c-440e-91b6-639b6b22bd82.png" 
              alt="CreatorVerse Logo" 
              className="w-8 h-8" 
            />
            <span className="text-lg font-semibold">CreaVerse</span>
          </div>
        </Link>
        
        <div className="space-y-1">
          <NavItem to="/" icon={<Home size={20} />} label="Accueil" />
          <NavItem to="/creators" icon={<Users size={20} />} label="Créateurs" />
          <NavItem to="/creator" icon={<User size={20} />} label="Profil créateur" />
          <NavItem to="/dashboard" icon={<BarChart2 size={20} />} label="Tableau de bord" />
          <NavItem to="/calendar" icon={<Calendar size={20} />} label="Calendrier" />
          <NavItem to="/messages" icon={<MessageCircle size={20} />} label="Messages" />
          <NavItem to="/subscribers" icon={<Users size={20} />} label="Abonnés" />
        </div>

        <div className="mt-auto pt-6 space-y-2">
          <NavItem to="/settings" icon={<Settings size={20} />} label="Paramètres" />
          <NavItem to="/notifications" icon={<Bell size={20} />} label="Notifications" />
        </div>

        <div className="mt-6 pt-6 border-t">
          <div className="flex items-center p-3 rounded-md hover:bg-primary/5">
            <ProfileAvatar src="https://avatars.githubusercontent.com/u/124599?v=4" size="sm" status="online" />
            <div className="ml-3">
              <p className="text-sm font-medium">Sarah K.</p>
              <p className="text-xs text-muted-foreground">Creator</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
