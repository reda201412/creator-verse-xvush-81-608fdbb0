import { useState } from 'react';
import { 
  Home, Settings, Bookmark, 
  Camera
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface SidebarProps {
  expanded: boolean; // Adding this property that App.tsx is using
  onToggle: () => void; // Adding this property that App.tsx is using
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ expanded, onToggle, className }) => {
  const [activeRoute, setActiveRoute] = useState('home');

  const handleRouteChange = (route: string) => {
    setActiveRoute(route);
    onToggle();
  };

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 h-full w-64 bg-background border-r border-border/20 transition-transform duration-300 ease-in-out z-50",
        expanded ? "translate-x-0" : "-translate-x-full",
        className
      )}
    >
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Menu</h2>
        <nav>
          <ul className="space-y-2">
            <li>
              <button
                className={cn(
                  "flex items-center w-full p-2 rounded-md hover:bg-secondary/50 transition-colors duration-200",
                  activeRoute === 'home' ? "bg-secondary/50" : ""
                )}
                onClick={() => handleRouteChange('home')}
              >
                <Home className="mr-2 h-4 w-4" />
                Home
              </button>
            </li>
            <li>
              <button
                className={cn(
                  "flex items-center w-full p-2 rounded-md hover:bg-secondary/50 transition-colors duration-200",
                  activeRoute === 'camera' ? "bg-secondary/50" : ""
                )}
                onClick={() => handleRouteChange('camera')}
              >
                <Camera className="mr-2 h-4 w-4" />
                Camera
              </button>
            </li>
            <li>
              <button
                className={cn(
                  "flex items-center w-full p-2 rounded-md hover:bg-secondary/50 transition-colors duration-200",
                  activeRoute === 'bookmark' ? "bg-secondary/50" : ""
                )}
                onClick={() => handleRouteChange('bookmark')}
              >
                <Bookmark className="mr-2 h-4 w-4" />
                Bookmark
              </button>
            </li>
            <li>
              <button
                className={cn(
                  "flex items-center w-full p-2 rounded-md hover:bg-secondary/50 transition-colors duration-200",
                  activeRoute === 'settings' ? "bg-secondary/50" : ""
                )}
                onClick={() => handleRouteChange('settings')}
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
