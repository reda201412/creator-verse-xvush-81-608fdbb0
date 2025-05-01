
import { MessageThread } from '@/types/messaging';

// Mock data for message threads
export const mockMessageThreads: MessageThread[] = [
  {
    id: 'thread_1',
    participants: ['user_1', 'user_2'],
    messages: [
      {
        id: 'msg_1',
        senderId: 'user_2',
        senderName: 'Sophie',
        senderAvatar: 'https://i.pravatar.cc/300?img=25',
        recipientId: 'user_1',
        content: 'Salut ! Comment vas-tu aujourd\'hui ?',
        type: 'text',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        status: 'read',
        isEncrypted: true,
      },
      {
        id: 'msg_2',
        senderId: 'user_1',
        senderName: 'Julie Sky',
        senderAvatar: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?crop=faces&w=200&h=200',
        recipientId: 'user_2',
        content: 'Hey Sophie ! Ça va bien, je viens de finir une séance photo. Et toi ?',
        type: 'text',
        timestamp: new Date(Date.now() - 3500000).toISOString(),
        status: 'delivered',
        isEncrypted: true,
      },
      {
        id: 'msg_3',
        senderId: 'user_2',
        senderName: 'Sophie',
        senderAvatar: 'https://i.pravatar.cc/300?img=25',
        recipientId: 'user_1',
        content: 'Super ! J\'aimerais voir quelques photos, as-tu quelque chose à partager ?',
        type: 'text',
        timestamp: new Date(Date.now() - 3400000).toISOString(),
        status: 'read',
        isEncrypted: true,
      },
      {
        id: 'msg_4',
        senderId: 'user_1',
        senderName: 'Julie Sky',
        senderAvatar: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?crop=faces&w=200&h=200',
        recipientId: 'user_2',
        content: 'Bien sûr ! J\'ai quelques clichés exclusifs de ma dernière séance.',
        type: 'text',
        timestamp: new Date(Date.now() - 3300000).toISOString(),
        status: 'delivered',
        isEncrypted: true,
      },
      {
        id: 'msg_5',
        senderId: 'user_1',
        senderName: 'Julie Sky',
        senderAvatar: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?crop=faces&w=200&h=200',
        recipientId: 'user_2',
        content: 'Voici une preview de ma série "Sunset Dance". J\'ai d\'autres photos disponibles en premium.',
        type: 'media',
        timestamp: new Date(Date.now() - 3200000).toISOString(),
        status: 'delivered',
        isEncrypted: true,
        mediaUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
        monetization: {
          tier: 'basic',
          price: 4.99,
          currency: 'USD',
          instantPayoutEnabled: true,
          accessControl: {
            isGated: true,
            requiredTier: 'basic'
          },
          analytics: {
            views: 14,
            revenue: 49.90,
            conversionRate: 0.7,
            engagementTime: 45
          }
        },
      }
    ],
    isGated: false,
    lastActivity: new Date(Date.now() - 3200000).toISOString(),
    emotionalMap: {
      dominantEmotion: 'curiosity',
      volatility: 15,
      affinity: 85
    }
  },
  {
    id: 'thread_2',
    participants: ['user_1', 'user_3'],
    messages: [
      {
        id: 'msg_6',
        senderId: 'user_3',
        senderName: 'Thomas',
        senderAvatar: 'https://i.pravatar.cc/300?img=60',
        recipientId: 'user_1',
        content: 'Bonjour Julie ! J\'adore ton dernier post, c\'est incroyable.',
        type: 'text',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        status: 'read',
        isEncrypted: true,
      },
      {
        id: 'msg_7',
        senderId: 'user_1',
        senderName: 'Julie Sky',
        senderAvatar: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?crop=faces&w=200&h=200',
        recipientId: 'user_3',
        content: 'Merci beaucoup Thomas ! J\'ai passé beaucoup de temps sur ces photos.',
        type: 'text',
        timestamp: new Date(Date.now() - 85000000).toISOString(),
        status: 'read',
        isEncrypted: true,
      }
    ],
    isGated: false,
    lastActivity: new Date(Date.now() - 85000000).toISOString(),
  },
  {
    id: 'thread_3',
    participants: ['user_1', 'user_4'],
    name: 'VIP Backstage',
    messages: [
      {
        id: 'msg_8',
        senderId: 'user_4',
        senderName: 'Alex',
        senderAvatar: 'https://i.pravatar.cc/300?img=33',
        recipientId: 'user_1',
        content: 'J\'ai vu que tu proposes un nouveau tier VIP. Qu\'est-ce qui est inclus ?',
        type: 'text',
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        status: 'read',
        isEncrypted: true,
      },
      {
        id: 'msg_9',
        senderId: 'user_1',
        senderName: 'Julie Sky',
        senderAvatar: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?crop=faces&w=200&h=200',
        recipientId: 'user_4',
        content: 'Salut Alex ! Le tier VIP inclut accès à toutes mes photos et vidéos exclusives, des sessions live mensuelles et des chats privés comme celui-ci.',
        type: 'text',
        timestamp: new Date(Date.now() - 172000000).toISOString(),
        status: 'read',
        isEncrypted: true,
      },
      {
        id: 'msg_10',
        senderId: 'user_1',
        senderName: 'Julie Sky',
        senderAvatar: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?crop=faces&w=200&h=200',
        recipientId: 'user_4',
        content: 'Voici un aperçu d\'une vidéo exclusive de ma dernière session.',
        type: 'media',
        timestamp: new Date(Date.now() - 171000000).toISOString(),
        status: 'read',
        isEncrypted: true,
        mediaUrl: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb',
        monetization: {
          tier: 'vip',
          price: 24.99,
          currency: 'USD',
          instantPayoutEnabled: true,
          accessControl: {
            isGated: true,
            requiredTier: 'vip'
          },
          analytics: {
            views: 7,
            revenue: 174.93,
            conversionRate: 1,
            engagementTime: 120
          }
        },
      }
    ],
    isGated: true,
    requiredTier: 'vip',
    lastActivity: new Date(Date.now() - 171000000).toISOString(),
    emotionalMap: {
      dominantEmotion: 'excitement',
      volatility: 35,
      affinity: 95
    }
  },
  {
    id: 'thread_4',
    participants: ['user_1', 'user_5', 'user_6', 'user_7'],
    name: 'Fans Premium',
    messages: [
      {
        id: 'msg_11',
        senderId: 'user_5',
        senderName: 'Marie',
        senderAvatar: 'https://i.pravatar.cc/300?img=5',
        recipientId: ['user_1', 'user_6', 'user_7'],
        content: 'Salut tout le monde ! Qui sera à la prochaine session live ?',
        type: 'text',
        timestamp: new Date(Date.now() - 259200000).toISOString(),
        status: 'read',
        isEncrypted: true,
      },
      {
        id: 'msg_12',
        senderId: 'user_6',
        senderName: 'Paul',
        senderAvatar: 'https://i.pravatar.cc/300?img=13',
        recipientId: ['user_1', 'user_5', 'user_7'],
        content: 'Je serai là ! J\'ai hâte de voir le nouveau set.',
        type: 'text',
        timestamp: new Date(Date.now() - 258000000).toISOString(),
        status: 'read',
        isEncrypted: true,
      },
      {
        id: 'msg_13',
        senderId: 'user_1',
        senderName: 'Julie Sky',
        senderAvatar: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?crop=faces&w=200&h=200',
        recipientId: ['user_5', 'user_6', 'user_7'],
        content: 'Coucou tout le monde ! La session live commencera demain à 20h. J\'ai préparé quelque chose de spécial ! 💃',
        type: 'text',
        timestamp: new Date(Date.now() - 257000000).toISOString(),
        status: 'read',
        isEncrypted: true,
      }
    ],
    isGated: true,
    requiredTier: 'premium',
    lastActivity: new Date(Date.now() - 257000000).toISOString(),
  }
];
