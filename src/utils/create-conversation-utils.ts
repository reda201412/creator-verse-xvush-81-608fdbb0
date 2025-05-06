
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MessageType, MonetizationTier } from '@/types/messaging';

/**
 * Crée une nouvelle conversation entre un utilisateur et un créateur
 */
export const createNewConversationWithCreator = async ({
  userId,
  userName,
  userAvatar,
  creatorId,
  creatorName,
  initialMessage = "Bonjour, j'aimerais discuter avec vous!"
}: {
  userId: string;
  userName: string;
  userAvatar: string;
  creatorId: string;
  creatorName: string;
  initialMessage?: string;
}) => {
  try {
    // 1. Créer un nouveau thread de conversation
    const { data: threadData, error: threadError } = await supabase
      .from('message_threads')
      .insert({
        participants: [userId, creatorId],
        name: creatorName, // Le nom affiché pour l'utilisateur
        last_activity: new Date().toISOString(),
        is_gated: false
      })
      .select('*')
      .single();

    if (threadError) throw threadError;

    // 2. Envoyer le premier message
    const { data: messageData, error: messageError } = await supabase
      .from('message_thread_messages')
      .insert({
        thread_id: threadData.id,
        sender_id: userId,
        sender_name: userName,
        sender_avatar: userAvatar,
        recipient_id: [creatorId],
        content: initialMessage,
        type: 'text' as MessageType,
        created_at: new Date().toISOString(),
        is_encrypted: false
      })
      .select('*')
      .single();

    if (messageError) throw messageError;

    return {
      success: true,
      threadId: threadData.id,
      message: messageData
    };
  } catch (error) {
    console.error('Erreur lors de la création de la conversation:', error);
    toast.error("Impossible de créer une conversation. Veuillez réessayer.");
    return {
      success: false,
      error
    };
  }
};

/**
 * Récupère la liste des créateurs disponibles pour conversation
 */
export const fetchAvailableCreators = async () => {
  try {
    const { data, error } = await supabase
      .from('creators')
      .select(`
        id,
        user_id,
        username,
        name,
        avatar,
        bio
      `);

    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des créateurs:', error);
    return [];
  }
};
