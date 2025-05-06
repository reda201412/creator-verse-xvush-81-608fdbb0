import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Home,
  User,
  Calendar,
  BarChart2,
  MessageCircle,
  X,
  Menu,
  Users,
  Settings,
  Bell,
  LogOut,
  Coins,
  Video,
  Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ProfileAvatar from "@/components/ProfileAvatar";
import { useNeuroAesthetic } from "@/hooks/use-neuro-aesthetic";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

const NavItem = ({ to, icon, label, isActive, onClick }: NavItemProps) => {
  const { triggerMicroReward } = useNeuroAesthetic();
  
  const handleClick = () => {
    triggerMicroReward("tab");
    if (onClick) onClick();
  };
  
  return (
    <Link to={to} onClick={handleClick}>
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
          <span className="ml-3 font-medium text-sm">{label}</span>
        </div>
        {isActive && (
          <motion.div
            className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-primary"
            layoutId="activeMobileIndicator"
          />
        )}
      </div>
    </Link>
  );
};

export const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { triggerMicroReward } = useNeuroAesthetic();
  const { user, profile, isCreator, signOut } = useAuth();
  const { toast } = useToast();

  // Common navigation items for all users
  let navItems = [
    { to: "/", icon: <Home size={22} />, label: "Accueil", role: "all" },
    { to: "/creators", icon: <Users size={22} />, label: "Créateurs", role: "all" },
    { to: "/creator", icon: <User size={22} />, label: "Profil créateur", role: "all" },
    { to: "/tokens", icon: <Coins size={22} />, label: "Tokens", role: "all" },
    { to: "/messages", icon: <MessageCircle size={22} />, label: "Messages", role: "all" },
  ];

  // Creator-only navigation items
  const creatorNavItems = [
    { to: "/dashboard", icon: <BarChart2 size={22} />, label: "Tableau de bord", role: "creator" },
    { to: "/calendar", icon: <Calendar size={22} />, label: "Calendrier", role: "creator" },
    { to: "/subscribers", icon: <Users size={22} />, label: "Abonnés", role: "creator" },
    { to: "/videos", icon: <Video size={22} />, label: "Mes Vidéos", role: "creator" },
  ];

  // Combine navigation items based on user role
  if (isCreator) {
    navItems = [...navItems, ...creatorNavItems];
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    triggerMicroReward("action");
  };
  
  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès."
      });
      navigate('/');
      closeMenu();
      triggerMicroReward('action');
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      toast({
        title: "Erreur de déconnexion",
        description: "Une erreur s'est produite lors de la déconnexion.",
        variant: "destructive"
      });
    }
  };

  const handleQuickUpload = () => {
    navigate('/videos');
    closeMenu();
    triggerMicroReward('navigate');
  };

  const displayName = profile?.display_name || profile?.username || "Utilisateur";
  const userRole = isCreator ? "Créateur" : "Fan";

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMenu}
        className="relative z-50"
        aria-label="Menu"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay to close menu when clicking outside */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
            />
            
            {/* Menu panel */}
            <motion.div
              className="fixed top-0 right-0 h-screen w-[80%] max-w-[300px] bg-background z-40 overflow-y-auto shadow-xl flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="flex flex-col overflow-y-auto flex-1 p-4">
                <div className="flex items-center justify-between py-4 px-2">
                  <Link to="/" onClick={closeMenu}>
                    <div className="flex items-center gap-2">
                      <img 
                        src="/lovable-uploads/0038954d-233c-440e-91b6-639b6b22bd82.png" 
                        alt="XDose Logo" 
                        className="w-8 h-8" 
                      />
                      <span className="text-lg font-semibold text-primary">XDose</span>
                    </div>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={closeMenu}>
                    <X size={18} />
                  </Button>
                </div>
                
                {isCreator && (
                  <Button 
                    onClick={handleQuickUpload}
                    className="mb-4 bg-xvush-pink hover:bg-xvush-pink-dark flex items-center gap-2"
                  >
                    <Upload size={16} />
                    Créer du contenu
                  </Button>
                )}
                
                <div className="mt-4 space-y-1">
                  {navItems.map((item) => (
                    <NavItem
                      key={item.to}
                      to={item.to}
                      icon={item.icon}
                      label={item.label}
                      isActive={location.pathname === item.to}
                      onClick={closeMenu}
                    />
                  ))}
                </div>

                <div className="mt-auto pt-4 space-y-1">
                  <NavItem
                    to="/settings"
                    icon={<Settings size={22} />}
                    label="Paramètres"
                    isActive={location.pathname === "/settings"}
                    onClick={closeMenu}
                  />
                  <div
                    className="relative flex items-center group rounded-lg py-3 px-3 my-1 transition-all duration-200 text-muted-foreground hover:bg-primary/5 hover:text-foreground cursor-pointer"
                    onClick={handleLogout}
                  >
                    <div className="flex items-center">
                      <span className="text-xl"><LogOut size={22} /></span>
                      <span className="ml-3 font-medium text-sm">Déconnexion</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center p-3">
                    <ProfileAvatar src={profile?.avatar_url || "https://avatars.githubusercontent.com/u/124599?v=4"} size="sm" status="online" />
                    <div className="ml-3">
                      <p className="text-sm font-medium">{displayName}</p>
                      <p className="text-xs text-muted-foreground">{userRole}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
