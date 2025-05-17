import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Search,
  Compass,
  X
} from 'lucide-react';

interface NavigationOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const NavigationOverlay: React.FC<NavigationOverlayProps> = ({ isOpen, onClose }) => {
  return (
    <motion.div
      className={cn(
        "fixed inset-0 z-50 bg-background/80 backdrop-blur-md overflow-y-auto transition-all duration-300",
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}
    >
      <div className="container relative min-h-screen flex flex-col">
        <header className="sticky top-0 z-10 p-4 border-b bg-background/95 backdrop-blur-sm">
          <div className="container flex items-center justify-between">
            <h2 className="text-lg font-semibold">Menu</h2>
            <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center">
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>
        
        <div className="flex-1 py-4">
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              <input
                type="search"
                placeholder="Rechercher..."
                className="w-full pl-9 pr-3 py-2 rounded-md bg-secondary border-none focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <button className="glass-card p-3 rounded-lg flex flex-col items-center justify-center gap-2">
                <Compass size={32} className="text-blue-500" />
                <span className="text-sm">Explorer</span>
              </button>
              
              <button className="glass-card p-3 rounded-lg flex flex-col items-center justify-center gap-2">
                <Compass size={32} className="text-blue-500" />
                <span className="text-sm">Explorer</span>
              </button>
              
              <button className="glass-card p-3 rounded-lg flex flex-col items-center justify-center gap-2">
                <Compass size={32} className="text-blue-500" />
                <span className="text-sm">Explorer</span>
              </button>
              
              <button className="glass-card p-3 rounded-lg flex flex-col items-center justify-center gap-2">
                <Compass size={32} className="text-blue-500" />
                <span className="text-sm">Explorer</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NavigationOverlay;
