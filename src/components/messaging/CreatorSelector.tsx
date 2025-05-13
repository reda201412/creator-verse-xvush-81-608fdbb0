
import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { db } from '@/integrations/firebase/firebase';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import usePresence from '@/hooks/use-presence';
import { Spinner } from '@/components/ui/spinner';

// Define a proper interface for the creator data
interface Creator {
  id: string;
  uid: string;
  username: string; 
  displayName: string;
  name: string;
  avatarUrl: string;
  avatar: string;
  bio: string;
}

interface CreatorSelectorProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSelectCreator: (creator: Creator) => void;
  onCancel?: () => void;
}

const CreatorSelector: React.FC<CreatorSelectorProps> = ({ 
  isOpen, 
  onClose, 
  onSelectCreator,
  onCancel
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [creators, setCreators] = useState<Creator[]>([]);
  const [filteredCreators, setFilteredCreators] = useState<Creator[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Fetch creators when the component mounts
  useEffect(() => {
    if (isOpen && user) {
      fetchCreators();
    }
  }, [isOpen, user]);

  // Filter creators based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCreators(creators);
      return;
    }

    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = creators.filter(creator => 
      creator.username?.toLowerCase().includes(lowerCaseQuery) ||
      creator.displayName?.toLowerCase().includes(lowerCaseQuery) ||
      creator.name?.toLowerCase().includes(lowerCaseQuery)
    );
    
    setFilteredCreators(filtered);
  }, [searchQuery, creators]);

  const fetchCreators = async () => {
    if (!db || !user) return;
    
    setIsLoading(true);
    try {
      // Query creators from Firestore
      const creatorsQuery = query(
        collection(db, 'users'),
        where('role', '==', 'creator'),
        limit(50)
      );
      
      const snapshot = await getDocs(creatorsQuery);
      const creatorsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          uid: doc.id,
          username: data.username || '',
          displayName: data.displayName || data.name || data.username || '',
          name: data.name || '',
          avatarUrl: data.avatarUrl || data.photoURL || '',
          avatar: data.avatar || data.photoURL || '',
          bio: data.bio || '',
        };
      }).filter(creator => creator.id !== user.uid); // Filter out the current user
      
      setCreators(creatorsData);
      setFilteredCreators(creatorsData);
    } catch (error) {
      console.error('Error fetching creators:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCreator = (creator: Creator) => {
    onSelectCreator(creator);
    if (onClose) onClose();
  };

  const handleClose = () => {
    if (onCancel) onCancel();
    if (onClose) onClose();
  };

  const CreatorItem = ({ creator }: { creator: Creator }) => {
    const presence = usePresence(creator.id);
    const isOnline = presence === 'online';
    
    return (
      <div 
        className="flex items-center p-3 hover:bg-muted rounded-md cursor-pointer transition-colors"
        onClick={() => handleSelectCreator(creator)}
      >
        <div className="relative">
          <Avatar className="h-10 w-10">
            <AvatarImage src={creator.avatarUrl || creator.avatar} alt={creator.displayName || creator.username} />
            <AvatarFallback>
              {(creator.displayName || creator.username || 'U').charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {isOnline && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
          )}
        </div>
        <div className="ml-3 flex-1 overflow-hidden">
          <p className="font-medium text-sm">{creator.displayName || creator.username}</p>
          <p className="text-xs text-muted-foreground truncate">@{creator.username}</p>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Démarrer une conversation</DialogTitle>
        </DialogHeader>
        
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher un créateur..."
            className="pl-8 pr-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-9 w-9 p-0"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Spinner size="lg" />
          </div>
        ) : (
          <ScrollArea className="h-[300px] pr-4">
            {filteredCreators.length > 0 ? (
              <div className="space-y-1">
                {filteredCreators.map((creator) => (
                  <CreatorItem key={creator.id} creator={creator} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? 'Aucun créateur trouvé' : 'Aucun créateur disponible'}
              </div>
            )}
          </ScrollArea>
        )}
        
        {onCancel && (
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={handleClose}>
              Annuler
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreatorSelector;
