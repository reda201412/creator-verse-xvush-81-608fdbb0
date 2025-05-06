
import { Message, MessageThread } from '@/types/messaging';
import { supabase } from '@/integrations/supabase/client';

export const fetchUserThreads = async (userId: string) => {
  try {
    // Fetch all threads where the user is a participant
    const { data, error } = await supabase
      .from('message_threads')
      .select('*, messages:message_thread_messages(*)')
      .contains('participants', [userId])
      .order('last_activity', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching user threads:', error);
    return [];
  }
};

export const sendMessage = async ({ 
  threadId, 
  senderId,
  senderName,
  senderAvatar,
  recipientIds, 
  content, 
  isEncrypted = false,
  monetizationData = null 
}: {
  threadId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  recipientIds: string[];
  content: string;
  isEncrypted?: boolean;
  monetizationData?: any;
}) => {
  try {
    const timestamp = new Date().toISOString();
    
    // Create message
    const { data: message, error: messageError } = await supabase
      .from('message_thread_messages')
      .insert({
        thread_id: threadId,
        sender_id: senderId,
        sender_name: senderName,
        sender_avatar: senderAvatar,
        recipient_id: recipientIds,
        content,
        type: 'text',
        is_encrypted: isEncrypted,
        monetization_data: monetizationData,
        created_at: timestamp
      })
      .select()
      .single();

    if (messageError) throw messageError;

    // Update thread's last activity
    await supabase
      .from('message_threads')
      .update({ last_activity: timestamp })
      .eq('id', threadId);

    return message;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const createThread = async ({
  participants,
  creatorId,
  name
}: {
  participants: string[];
  creatorId?: string;
  name?: string;
}) => {
  try {
    const { data, error } = await supabase
      .from('message_threads')
      .insert({
        participants,
        creator_id: creatorId,
        name,
        last_activity: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error creating thread:', error);
    throw error;
  }
};

export const markMessagesAsRead = async (threadId: string, userId: string) => {
  try {
    const { data, error } = await supabase
      .from('message_thread_messages')
      .update({ status: 'read' })
      .eq('thread_id', threadId)
      .neq('sender_id', userId)
      .neq('status', 'read');

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Error marking messages as read:', error);
    return false;
  }
};
