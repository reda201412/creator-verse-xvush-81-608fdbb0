
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HamburgerMenu } from './MobileMenu';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Upload, Image, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNeuroAesthetic } from '@/hooks/use-neuro-aesthetic';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import StoryPublisher from '@/components/stories/StoryPublisher';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const { isCreator } = useAuth();
  const { triggerMicroReward } = useNeuroAesthetic();
  
  const handleQuickUpload = () => {
    navigate('/videos');
    triggerMicroReward('navigate');
  };
  
  return (
    <header className={`flex items-center justify-between p-4 ${className}`}>
      <Link to="/" className="text-xvush-pink text-2xl font-bold transition-transform hover:scale-105">
        XDose
      </Link>
      
      <div className="flex items-center gap-4">
        {isCreator && !isMobile && (
          <div className="flex items-center gap-2">
            {/* Remplaçons le bouton existant par un menu déroulant */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  size="sm"
                  className="bg-xvush-pink hover:bg-xvush-pink-dark"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Créer
                  <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background border border-border w-48">
                <DropdownMenuItem onClick={handleQuickUpload}>
                  <Upload className="mr-2 h-4 w-4" />
                  <span>Vidéo</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/stories')}>
                  <Image className="mr-2 h-4 w-4" />
                  <span>Story</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Ajout du bouton de création de story directement */}
            <StoryPublisher />
          </div>
        )}
        
        {!isMobile && (
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/">
                  <NavigationMenuLink 
                    className={cn(
                      navigationMenuTriggerStyle(),
                      location.pathname === "/" ? "bg-accent" : ""
                    )}
                  >
                    Accueil
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link to="/creators">
                  <NavigationMenuLink 
                    className={cn(
                      navigationMenuTriggerStyle(),
                      location.pathname === "/creators" ? "bg-accent" : ""
                    )}
                  >
                    Créateurs
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link to="/stories">
                  <NavigationMenuLink 
                    className={cn(
                      navigationMenuTriggerStyle(),
                      location.pathname === "/stories" ? "bg-accent" : ""
                    )}
                  >
                    Stories
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link to="/creator">
                  <NavigationMenuLink 
                    className={cn(
                      navigationMenuTriggerStyle(),
                      location.pathname === "/creator" ? "bg-accent" : ""
                    )}
                  >
                    Profil Créateur
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              
              {isCreator && (
                <NavigationMenuItem>
                  <Link to="/dashboard">
                    <NavigationMenuLink 
                      className={cn(
                        navigationMenuTriggerStyle(),
                        location.pathname === "/dashboard" ? "bg-accent" : ""
                      )}
                    >
                      Tableau de Bord
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )}
              
              <NavigationMenuItem>
                <NavigationMenuTrigger>Autres</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                    {isCreator && (
                      <li>
                        <Link to="/calendar" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Calendrier</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Planifiez et visualisez vos contenus
                          </p>
                        </Link>
                      </li>
                    )}
                    <li>
                      <Link to="/messages" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Messages</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Communiquez avec vos abonnés
                        </p>
                      </Link>
                    </li>
                    {isCreator && (
                      <li>
                        <Link to="/subscribers" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Abonnés</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Gérez vos abonnés et communauté
                          </p>
                        </Link>
                      </li>
                    )}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        )}
        
        {isMobile && <HamburgerMenu />}
      </div>
    </header>
  );
};

export default Header;
