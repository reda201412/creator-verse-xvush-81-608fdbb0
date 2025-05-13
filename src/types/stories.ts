
export interface StoryTag {
  id: string;
  tag_name: string;
}

export interface StoryCreator {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string;
}

export interface Story {
  id: string;
  creator_id: string;
  media_url: string;
  thumbnail_url?: string;
  duration: number;
  created_at: string;
  viewed: boolean;
  view_count: number;
  caption?: string;
  filter_used?: string;
  is_highlighted?: boolean;
  format?: string; // Added format property
  tags?: StoryTag[];
  creator: StoryCreator;
}

export interface StoryGroup {
  creator: StoryCreator;
  stories: Story[];
  hasUnviewed: boolean;
}
