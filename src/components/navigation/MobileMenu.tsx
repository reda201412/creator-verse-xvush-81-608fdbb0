import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useModals } from '@/hooks/use-modals';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Home, 
  Search, 
  PlusSquare, 
  Heart, 
  User, 
  MessageSquare, 
  Bell, 
  Menu, 
  X, 
  LogOut, 
  Settings, 
  HelpCircle, 
  Wallet, 
  Sparkles
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useTronWallet } from '@/hooks/use-tron-wallet';
import { useLocalNeuroAesthetic } from '@/components/effects/MicroRewardsEnhanced';

const MobileMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [notificationCount, setNotificationCount] = useState(3);
  const [messageCount, setMessageCount] = useState(2);
  const location = useLocation();
  const navigate = useNavigate();
  const { openModal } = useModals();
  const isMobile = useIsMobile();
  const { profile } = useAuth();
  const { walletInfo } = useTronWallet();
  const { triggerMicroReward } = useLocalNeuroAesthetic();
  
  useEffect(() => {
    // Set active tab based on current route
    const path = location.pathname;
    if (path === '/' || path === '/home') setActiveTab('home');
    else if (path === '/search' || path.includes('/discover')) setActiveTab('search');
    else if (path === '/create' || path.includes('/studio')) setActiveTab('create');
    else if (path === '/activity' || path.includes('/notifications')) setActiveTab('activity');
    else if (path === '/profile' || path.includes('/user/')) setActiveTab('profile');
  }, [location]);
  
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    triggerMicroReward('navigate');
    
    switch (tab) {
      case 'home':
        navigate('/');
        break;
      case 'search':
        navigate('/discover');
        break;
      case 'create':
        navigate('/studio');
        break;
      case 'activity':
        navigate('/notifications');
        break;
      case 'profile':
        navigate('/profile');
        break;
      case 'messages':
        navigate('/messages');
        break;
      default:
        navigate('/');
    }
  };
  
  const handleLogout = () => {
    // Implement logout functionality
    console.log('Logging out...');
  };
  
  return (
    <>
      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <motion.div 
          className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-border z-50"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-around py-2">
            <TabButton 
              icon={<Home size={24} />} 
              isActive={activeTab === 'home'} 
              onClick={() => handleTabClick('home')} 
              label="Home"
            />
            <TabButton 
              icon={<Search size={24} />} 
              isActive={activeTab === 'search'} 
              onClick={() => handleTabClick('search')} 
              label="Discover"
            />
            <TabButton 
              icon={<PlusSquare size={24} />} 
              isActive={activeTab === 'create'} 
              onClick={() => handleTabClick('create')} 
              label="Create"
              className="bg-gradient-to-tr from-purple-500 to-pink-500 text-white rounded-lg"
            />
            <TabButton 
              icon={<Bell size={24} />} 
              isActive={activeTab === 'activity'} 
              onClick={() => handleTabClick('activity')} 
              label="Activity"
              badgeCount={notificationCount}
            />
            <TabButton 
              icon={<MessageSquare size={24} />} 
              isActive={activeTab === 'messages'} 
              onClick={() => handleTabClick('messages')} 
              label="Messages"
              badgeCount={messageCount}
            />
          </div>
        </motion.div>
      )}
      
      {/* Desktop Top Navigation */}
      {!isMobile && (
        <div className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-b border-border z-50">
          <div className="container mx-auto flex items-center justify-between py-2">
            <div className="flex items-center gap-6">
              <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
                XDose
              </div>
              
              <nav className="hidden md:flex items-center gap-1">
                <NavButton 
                  icon={<Home size={18} />} 
                  isActive={activeTab === 'home'} 
                  onClick={() => handleTabClick('home')} 
                  label="Home"
                />
                <NavButton 
                  icon={<Search size={18} />} 
                  isActive={activeTab === 'search'} 
                  onClick={() => handleTabClick('search')} 
                  label="Discover"
                />
                <NavButton 
                  icon={<Heart size={18} />} 
                  isActive={activeTab === 'activity'} 
                  onClick={() => handleTabClick('activity')} 
                  label="Activity"
                  badgeCount={notificationCount}
                />
              </nav>
            </div>
            
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="relative"
                    onClick={() => handleTabClick('messages')}
                  >
                    <MessageSquare size={20} />
                    {messageCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
                        {messageCount}
                      </Badge>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Messages</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => openModal('wallet')}
                  >
                    <Wallet size={20} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Wallet ({walletInfo?.wallet?.balance_usdt || 0} USDT)</TooltipContent>
              </Tooltip>
              
              <Button 
                variant="default" 
                size="sm" 
                className="hidden md:flex bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                onClick={() => handleTabClick('create')}
              >
                <PlusSquare size={16} className="mr-2" />
                Create
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.avatarUrl} />
                      <AvatarFallback>{profile?.displayName?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleTabClick('profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => openModal('wallet')}>
                    <Wallet className="mr-2 h-4 w-4" />
                    <span>Wallet</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/help')}>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Help & Support</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      )}
      
      {/* Mobile Menu Sheet */}
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="fixed top-4 right-4 z-50 md:hidden"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[80vw] sm:w-[350px]">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-80px)] py-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3 px-4 py-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={profile?.avatarUrl} />
                  <AvatarFallback>{profile?.displayName?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{profile?.displayName || 'User'}</p>
                  <p className="text-sm text-muted-foreground">@{profile?.username || 'username'}</p>
                </div>
              </div>
              
              <div className="border-t my-2"></div>
              
              <MenuItem 
                icon={<User size={20} />} 
                label="Profile" 
                onClick={() => {
                  handleTabClick('profile');
                  setIsMenuOpen(false);
                }} 
              />
              
              <MenuItem 
                icon={<Wallet size={20} />} 
                label="Wallet" 
                onClick={() => {
                  openModal('wallet');
                  setIsMenuOpen(false);
                }} 
                rightElement={
                  <span className="text-sm font-medium">{walletInfo?.wallet?.balance_usdt || 0} USDT</span>
                }
              />
              
              <MenuItem 
                icon={<Sparkles size={20} />} 
                label="Premium" 
                onClick={() => {
                  navigate('/premium');
                  setIsMenuOpen(false);
                }} 
                rightElement={
                  <Badge variant="outline" className="bg-gradient-to-r from-amber-200 to-yellow-400 text-amber-900">PRO</Badge>
                }
              />
              
              <div className="border-t my-2"></div>
              
              <MenuItem 
                icon={<Settings size={20} />} 
                label="Settings" 
                onClick={() => {
                  navigate('/settings');
                  setIsMenuOpen(false);
                }} 
              />
              
              <MenuItem 
                icon={<HelpCircle size={20} />} 
                label="Help & Support" 
                onClick={() => {
                  navigate('/help');
                  setIsMenuOpen(false);
                }} 
              />
              
              <div className="border-t my-2"></div>
              
              <MenuItem 
                icon={<LogOut size={20} />} 
                label="Log out" 
                onClick={handleLogout} 
              />
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
};

// Tab button for mobile bottom navigation
const TabButton = ({ 
  icon, 
  isActive, 
  onClick, 
  label, 
  badgeCount, 
  className 
}: { 
  icon: React.ReactNode; 
  isActive: boolean; 
  onClick: () => void; 
  label: string; 
  badgeCount?: number;
  className?: string;
}) => {
  return (
    <button 
      className={cn(
        "flex flex-col items-center justify-center p-1 relative",
        isActive && "text-primary",
        className
      )}
      onClick={onClick}
    >
      <div className="relative">
        {icon}
        {badgeCount !== undefined && badgeCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
            {badgeCount}
          </Badge>
        )}
      </div>
      <span className="text-[10px] mt-1">{label}</span>
    </button>
  );
};

// Navigation button for desktop
const NavButton = ({ 
  icon, 
  isActive, 
  onClick, 
  label, 
  badgeCount 
}: { 
  icon: React.ReactNode; 
  isActive: boolean; 
  onClick: () => void; 
  label: string; 
  badgeCount?: number;
}) => {
  return (
    <Button 
      variant={isActive ? "secondary" : "ghost"} 
      className={cn(
        "flex items-center gap-2 relative",
        isActive && "bg-secondary/50"
      )}
      onClick={onClick}
    >
      <span>{icon}</span>
      <span>{label}</span>
      {badgeCount !== undefined && badgeCount > 0 && (
        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
          {badgeCount}
        </Badge>
      )}
    </Button>
  );
};

// Menu item for mobile sheet
const MenuItem = ({ 
  icon, 
  label, 
  onClick, 
  rightElement 
}: { 
  icon: React.ReactNode; 
  label: string; 
  onClick: () => void; 
  rightElement?: React.ReactNode;
}) => {
  return (
    <button 
      className="flex items-center justify-between w-full px-4 py-3 hover:bg-secondary/20 rounded-lg transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <span className="text-muted-foreground">{icon}</span>
        <span>{label}</span>
      </div>
      {rightElement && (
        <div>{rightElement}</div>
      )}
    </button>
  );
};

export default MobileMenu;
