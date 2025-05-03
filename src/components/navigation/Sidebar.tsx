
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Home,
  User,
  Calendar,
  BarChart2,
  MessageCircle,
  Menu,
  ChevronLeft,
  Users,
  Settings,
  Bell,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ProfileAvatar from "@/components/ProfileAvatar";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  isExpanded?: boolean;
  onClick?: () => void;
}

const NavItem = ({ to, icon, label, isActive, isExpanded, onClick }: NavItemProps) => {
  return (
    <Link to={to} onClick={onClick}>
      <div
        className={cn(
          "relative flex items-center group rounded-lg py-3 px-3 my-1 transition-all duration-200",
          isActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
        )}
      >
        <div className="flex items-center">
          <span className="text-xl">{icon}</span>
          <AnimatePresence>
            {isExpanded && (
              <motion.span
                className="ml-3 font-medium text-sm"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        {isActive && (
          <motion.div
            className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-primary"
            layoutId="activeIndicator"
          />
        )}
      </div>
    </Link>
  );
};

export const DesktopSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const location = useLocation();

  const navItems = [
    { to: "/", icon: <Home size={22} />, label: "Accueil" },
    { to: "/creator", icon: <User size={22} />, label: "Profil créateur" },
    { to: "/dashboard", icon: <BarChart2 size={22} />, label: "Tableau de bord" },
    { to: "/calendar", icon: <Calendar size={22} />, label: "Calendrier" },
    { to: "/messages", icon: <MessageCircle size={22} />, label: "Messages" },
    { to: "/subscribers", icon: <Users size={22} />, label: "Abonnés" },
  ];

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  // Apply a transition to the width of the sidebar
  const sidebarWidth = isExpanded ? "w-64" : "w-16";

  return (
    <motion.div
      className={cn(
        "h-screen sticky top-0 left-0 z-30 flex flex-col border-r bg-background/70 backdrop-blur-lg",
        sidebarWidth
      )}
      initial={false}
      animate={{ width: isExpanded ? 256 : 64 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      <div className="flex items-center justify-between p-4">
        {isExpanded ? (
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/0038954d-233c-440e-91b6-639b6b22bd82.png" 
              alt="CreatorVerse Logo" 
              className="w-8 h-8" 
            />
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-lg font-semibold text-primary"
            >
              CreatorVerse
            </motion.span>
          </Link>
        ) : (
          <Link to="/" className="mx-auto">
            <img 
              src="/lovable-uploads/0038954d-233c-440e-91b6-639b6b22bd82.png" 
              alt="Logo" 
              className="w-8 h-8" 
            />
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="md:flex hidden"
          onClick={toggleSidebar}
        >
          {isExpanded ? <ChevronLeft size={16} /> : <Menu size={16} />}
        </Button>
      </div>

      <div className="flex flex-col flex-1 p-3 overflow-y-auto scrollbar-none">
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              isActive={location.pathname === item.to}
              isExpanded={isExpanded}
            />
          ))}
        </div>

        <div className="mt-auto pt-4 space-y-1">
          <NavItem
            to="/settings"
            icon={<Settings size={22} />}
            label="Paramètres"
            isActive={location.pathname === "/settings"}
            isExpanded={isExpanded}
          />
          <NavItem
            to="/notifications"
            icon={<Bell size={22} />}
            label="Notifications"
            isActive={location.pathname === "/notifications"}
            isExpanded={isExpanded}
          />
        </div>

        <div className="mt-6 pt-6 border-t">
          {isExpanded ? (
            <div className="flex items-center p-3">
              <ProfileAvatar src="https://avatars.githubusercontent.com/u/124599?v=4" size="sm" status="online" />
              <div className="ml-3">
                <p className="text-sm font-medium">Sarah K.</p>
                <p className="text-xs text-muted-foreground">Creator</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center p-3">
              <ProfileAvatar src="https://avatars.githubusercontent.com/u/124599?v=4" size="sm" status="online" />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
