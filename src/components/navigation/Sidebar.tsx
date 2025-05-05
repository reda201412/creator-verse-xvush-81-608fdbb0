
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  Video,
  Upload,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import ProfileAvatar from "@/components/ProfileAvatar";
import { useNeuroAesthetic } from "@/hooks/use-neuro-aesthetic";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const DesktopSidebar = () => {
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
    { to: "/exclusive", icon: <Shield size={22} />, label: "Contenu Exclusif", role: "creator" },
    { to: "/videos", icon: <Video size={22} />, label: "Mes Vidéos", role: "creator" },
  ];

  // Combine navigation items based on user role
  if (isCreator) {
    navItems = [...navItems, ...creatorNavItems];
  }

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès."
      });
      navigate('/');
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

  // Ajouter un bouton d'upload rapide pour les créateurs
  const handleQuickUpload = () => {
    navigate('/videos');
    triggerMicroReward('navigate');
  };

  const displayName = profile?.display_name || profile?.username || "Utilisateur";
  const userRole = isCreator ? "Créateur" : "Fan";
  const avatarUrl = profile?.avatar_url || "https://avatars.githubusercontent.com/u/124599?v=4";

  return (
    <div className="hidden md:flex flex-col w-64 bg-card min-h-screen p-4 border-r">
      <div className="flex items-center justify-between mb-8">
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/0038954d-233c-440e-91b6-639b6b22bd82.png" 
            alt="XDose Logo" 
            className="w-10 h-10" 
          />
          <div className="text-2xl font-bold text-xvush-pink">XDose</div>
        </Link>
        
        {/* User Profile Image - This is the new part */}
        <div className="flex-shrink-0">
          <ProfileAvatar
            src={avatarUrl}
            size="sm"
            status="online"
            hasStory={true}
            onClick={() => navigate('/settings')}
          />
        </div>
      </div>

      {isCreator && (
        <Button 
          onClick={handleQuickUpload}
          className="w-full mb-4 bg-xvush-pink hover:bg-xvush-pink-dark flex items-center gap-2"
        >
          <Upload size={16} />
          Créer du contenu
        </Button>
      )}

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
          onClick={handleLogout}
        >
          <LogOut size={22} />
          <span className="ml-3 font-medium text-sm">Déconnexion</span>
        </Button>
      </div>

      <div className="flex items-center gap-3 mt-6 pt-4 border-t">
        <ProfileAvatar
          src={avatarUrl}
          size="sm"
          status="online"
        />
        <div>
          <div className="font-medium text-sm">{displayName}</div>
          <div className="text-xs text-muted-foreground">{userRole}</div>
        </div>
      </div>
    </div>
  );
};

export default DesktopSidebar;
