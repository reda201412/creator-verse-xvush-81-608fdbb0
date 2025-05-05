
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  User,
  Calendar,
  BarChart2,
  MessageCircle,
  Users,
  Settings,
  LogOut,
  Coins,
  Shield,
  Lock,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import ProfileAvatar from "@/components/ProfileAvatar";
import { useNeuroAesthetic } from "@/hooks/use-neuro-aesthetic";

export const DesktopSidebar = () => {
  const location = useLocation();
  const { triggerMicroReward } = useNeuroAesthetic();

  const navItems = [
    { to: "/", icon: <Home size={22} />, label: "Accueil" },
    { to: "/creators", icon: <Users size={22} />, label: "Créateurs" },
    { to: "/creator", icon: <User size={22} />, label: "Profil créateur" },
    { to: "/dashboard", icon: <BarChart2 size={22} />, label: "Tableau de bord" },
    { to: "/calendar", icon: <Calendar size={22} />, label: "Calendrier" },
    { to: "/messages", icon: <MessageCircle size={22} />, label: "Messages" },
    { to: "/subscribers", icon: <Users size={22} />, label: "Abonnés" },
    { to: "/tokens", icon: <Coins size={22} />, label: "Tokens" },
    { to: "/exclusive", icon: <Shield size={22} />, label: "Contenu Exclusif" },
  ];

  const userName = "Sarah K.";
  const userRole = "Créatrice";

  return (
    <div className="hidden md:flex flex-col w-64 bg-card min-h-screen p-4 border-r">
      <Link to="/" className="flex items-center gap-2 mb-8">
        <img 
          src="/lovable-uploads/0038954d-233c-440e-91b6-639b6b22bd82.png" 
          alt="CreatorVerse Logo" 
          className="w-10 h-10" 
        />
        <div className="text-2xl font-bold text-xvush-pink">CreaVerse</div>
      </Link>

      <div className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => triggerMicroReward('navigate')}
              className={cn(
                "relative flex items-center group rounded-lg py-3 px-3 transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
              )}
            >
              <div className="flex items-center">
                <span className="text-xl">{item.icon}</span>
                <span className="ml-3 font-medium text-sm">{item.label}</span>
              </div>
              {isActive && (
                <motion.div
                  className="absolute right-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-l-full bg-primary"
                  layoutId="activeIndicator"
                />
              )}
            </Link>
          );
        })}
      </div>

      <div className="border-t border-border pt-4 mt-4">
        <Link
          to="/settings"
          className="flex items-center py-3 px-3 rounded-lg text-muted-foreground hover:bg-primary/5 hover:text-foreground"
        >
          <Settings size={22} />
          <span className="ml-3 font-medium text-sm">Paramètres</span>
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-primary/5 rounded-lg"
        >
          <LogOut size={22} />
          <span className="ml-3 font-medium text-sm">Déconnexion</span>
        </Button>
      </div>

      <div className="flex items-center gap-3 mt-6 pt-4 border-t">
        <ProfileAvatar
          src="https://avatars.githubusercontent.com/u/124599?v=4"
          size="sm"
          status="online"
        />
        <div>
          <div className="font-medium text-sm">{userName}</div>
          <div className="text-xs text-muted-foreground">{userRole}</div>
        </div>
      </div>
    </div>
  );
};
