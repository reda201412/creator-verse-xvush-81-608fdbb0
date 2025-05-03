
export type ContentType = "premium" | "standard" | "vip";

export interface ContentItem {
  id: string;
  title: string;
  type: ContentType;
  category: string;
  views: number;
  thumbnail: string;
}

export type FeedbackType = "comment" | "request" | "appreciation";

export interface FeedbackMessage {
  id: string;
  username: string;
  avatar: string;
  message: string;
  timestamp: string;
  type: FeedbackType;
}
