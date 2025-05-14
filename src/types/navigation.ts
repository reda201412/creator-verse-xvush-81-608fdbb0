
export interface RouteChangeProps {
  onRouteChange?: () => void;
}

export interface CreatorProfileRouteProps {
  creatorId: string;
  username?: string;
}

// Adding the FirestoreMessageThread and FirestoreMessage interfaces
export interface ExtendedFirestoreMessageThread extends FirestoreMessageThread {
  messages: FirestoreMessage[];
  readStatus?: Record<string, any>;
}

export interface CreateConversationParams {
  userId: string;
  userName: string;
  userAvatar: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string | null;
  initialMessageText?: string;
  isGated?: boolean;
}
