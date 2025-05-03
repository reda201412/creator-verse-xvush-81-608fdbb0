
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
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

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const isMobile = useIsMobile();
  const location = useLocation();
  
  return (
    <header className={`flex items-center justify-between p-4 ${className}`}>
      <Link to="/" className="text-xvush-pink text-2xl font-bold transition-transform hover:scale-105">
        CreaVerse
      </Link>
      
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
            
            <NavigationMenuItem>
              <NavigationMenuTrigger>Autres</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                  <li>
                    <Link to="/calendar" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                      <div className="text-sm font-medium leading-none">Calendrier</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Planifiez et visualisez vos contenus
                      </p>
                    </Link>
                  </li>
                  <li>
                    <Link to="/messages" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                      <div className="text-sm font-medium leading-none">Messages</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Communiquez avec vos abonnés
                      </p>
                    </Link>
                  </li>
                  <li>
                    <Link to="/subscribers" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                      <div className="text-sm font-medium leading-none">Abonnés</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Gérez vos abonnés et communauté
                      </p>
                    </Link>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      )}
      
      {isMobile && <HamburgerMenu />}
    </header>
  );
};

export default Header;
