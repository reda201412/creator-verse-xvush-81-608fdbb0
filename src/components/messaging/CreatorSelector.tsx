
import React, { useState, useEffect } from 'react';
import { fetchAvailableCreators } from '@/utils/create-conversation-utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import useHapticFeedback from '@/hooks/use-haptic-feedback';

interface Creator {
  id: number;
  user_id: string;
  username: string;
  name: string | null;
  avatar: string | null;
  bio: string | null;
}

interface CreatorSelectorProps {
  onSelectCreator: (creator: Creator) => void;
  onCancel: () => void;
}

const CreatorSelector: React.FC<CreatorSelectorProps> = ({ onSelectCreator, onCancel }) => {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const { triggerHaptic } = useHapticFeedback();
  
  useEffect(() => {
    const loadCreators = async () => {
      setIsLoading(true);
      const result = await fetchAvailableCreators();
      setCreators(result);
      setIsLoading(false);
    };
    
    loadCreators();
  }, []);
  
  const filteredCreators = creators.filter(creator => {
    const searchLower = searchTerm.toLowerCase();
    const nameLower = creator.name?.toLowerCase() || '';
    const usernameLower = creator.username?.toLowerCase() || '';
    return nameLower.includes(searchLower) || usernameLower.includes(searchLower);
  });
  
  const handleSelectCreator = (creator: Creator) => {
    triggerHaptic('light');
    onSelectCreator(creator);
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-bold mb-4">Démarrer une conversation</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" size={18} />
          <Input 
            placeholder="Rechercher un créateur..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredCreators.length > 0 ? (
          <div className="space-y-2">
            {filteredCreators.map((creator) => (
              <div
                key={creator.id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                onClick={() => handleSelectCreator(creator)}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 dark:border-gray-800">
                    <img 
                      src={creator.avatar || `https://i.pravatar.cc/150?u=${creator.user_id}`} 
                      alt={creator.name || creator.username}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></span>
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold">{creator.name || creator.username}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                    {creator.bio || `@${creator.username}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-center">
              {searchTerm ? "Aucun créateur trouvé pour votre recherche" : "Aucun créateur disponible pour le moment"}
            </p>
          </div>
        )}
      </ScrollArea>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <Button variant="outline" className="w-full" onClick={onCancel}>
          Annuler
        </Button>
      </div>
    </div>
  );
};

export default CreatorSelector;
