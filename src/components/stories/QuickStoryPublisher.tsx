
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useUserBehavior } from '@/hooks/use-user-behavior';
import { useNeuroAesthetic } from '@/hooks/use-neuro-aesthetic';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import StoryPublisher from './StoryPublisher';

/**
 * Version simplifiée du StoryPublisher pour les boutons d'accès rapide
 */
const QuickStoryPublisher: React.FC = () => {
  const { isCreator } = useAuth();
  const { triggerMicroReward } = useNeuroAesthetic();
  const { trackInteraction } = useUserBehavior();
  const { toast } = useToast();
  
  if (!isCreator) return null;
  
  return (
    <Button 
      className="rounded-full" 
      size="icon"
      variant="secondary"
      onClick={() => {
        trackInteraction('click', { feature: 'quick_story_publisher' });
        triggerMicroReward('click');
      }}
    >
      <Camera className="h-5 w-5" />
    </Button>
  );
};

export default QuickStoryPublisher;
