
import { supabase } from '@/integrations/supabase/client';
import { StoryView } from '@/types/stories';

export const StoryViewService = {
  // Marquer une story comme vue par l'utilisateur actuel
  async markStoryAsViewed(storyId: string, viewDuration: number = 0): Promise<void> {
    // Get current user
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    
    if (!userId) {
      console.error('No authenticated user found');
      return;
    }
    
    const { error } = await supabase
      .from('story_views')
      .upsert({
        story_id: storyId,
        viewer_id: userId,
        view_duration: viewDuration,
        viewed_at: new Date().toISOString()
      }, {
        onConflict: 'story_id,viewer_id'
      });
    
    if (error) {
      console.error('Error marking story as viewed:', error);
      throw error;
    }
    
    try {
      // Call Supabase edge function to increment view count
      await supabase.functions.invoke('increment-story-views', {
        body: { storyId }
      });
    } catch (error) {
      console.error('Error incrementing story views:', error);
    }
  },
  
  // Récupérer les vues d'une story
  async getStoryViews(storyId: string): Promise<StoryView[]> {
    const { data, error } = await supabase
      .from('story_views')
      .select(`
        *,
        user_profiles:viewer_id(*)
      `)
      .eq('story_id', storyId)
      .order('viewed_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching story views:', error);
      throw error;
    }
    
    return data || [];
  }
};
