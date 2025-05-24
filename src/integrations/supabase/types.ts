export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      content_purchases: {
        Row: {
          amount_usdt: number
          content_id: number
          created_at: string | null
          expires_at: string | null
          id: string
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          amount_usdt: number
          content_id: number
          created_at?: string | null
          expires_at?: string | null
          id?: string
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          amount_usdt?: number
          content_id?: number
          created_at?: string | null
          expires_at?: string | null
          id?: string
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_purchases_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_payouts: {
        Row: {
          amount_usdt: number
          created_at: string | null
          creator_id: string
          destination_address: string
          id: string
          status: string
          transaction_id: string | null
          tron_tx_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount_usdt: number
          created_at?: string | null
          creator_id: string
          destination_address: string
          id?: string
          status: string
          transaction_id?: string | null
          tron_tx_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount_usdt?: number
          created_at?: string | null
          creator_id?: string
          destination_address?: string
          id?: string
          status?: string
          transaction_id?: string | null
          tron_tx_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_payouts_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      creators: {
        Row: {
          avatar: string | null
          bio: string | null
          id: number
          name: string | null
          user_id: string | null
          username: string | null
        }
        Insert: {
          avatar?: string | null
          bio?: string | null
          id?: number
          name?: string | null
          user_id?: string | null
          username?: string | null
        }
        Update: {
          avatar?: string | null
          bio?: string | null
          id?: number
          name?: string | null
          user_id?: string | null
          username?: string | null
        }
        Relationships: []
      }
      message_thread_messages: {
        Row: {
          content: string
          created_at: string
          emotional_data: Json | null
          id: string
          is_encrypted: boolean
          media_url: string | null
          monetization_data: Json | null
          recipient_id: string[] | null
          sender_avatar: string | null
          sender_id: string
          sender_name: string
          status: string
          thread_id: string
          type: string
        }
        Insert: {
          content: string
          created_at?: string
          emotional_data?: Json | null
          id?: string
          is_encrypted?: boolean
          media_url?: string | null
          monetization_data?: Json | null
          recipient_id?: string[] | null
          sender_avatar?: string | null
          sender_id: string
          sender_name: string
          status?: string
          thread_id: string
          type?: string
        }
        Update: {
          content?: string
          created_at?: string
          emotional_data?: Json | null
          id?: string
          is_encrypted?: boolean
          media_url?: string | null
          monetization_data?: Json | null
          recipient_id?: string[] | null
          sender_avatar?: string | null
          sender_id?: string
          sender_name?: string
          status?: string
          thread_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_thread_messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "message_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      message_threads: {
        Row: {
          created_at: string
          creator_id: string | null
          emotional_map: Json | null
          id: string
          is_gated: boolean
          last_activity: string
          name: string | null
          participants: string[]
          required_tier: string | null
        }
        Insert: {
          created_at?: string
          creator_id?: string | null
          emotional_map?: Json | null
          id?: string
          is_gated?: boolean
          last_activity?: string
          name?: string | null
          participants: string[]
          required_tier?: string | null
        }
        Update: {
          created_at?: string
          creator_id?: string | null
          emotional_map?: Json | null
          id?: string
          is_gated?: boolean
          last_activity?: string
          name?: string | null
          participants?: string[]
          required_tier?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          id: string
          role: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          id: string
          role?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      site_wallet: {
        Row: {
          commission_percentage: number | null
          id: string
          last_updated: string | null
          total_balance_usdt: number | null
          tron_address: string
        }
        Insert: {
          commission_percentage?: number | null
          id?: string
          last_updated?: string | null
          total_balance_usdt?: number | null
          tron_address: string
        }
        Update: {
          commission_percentage?: number | null
          id?: string
          last_updated?: string | null
          total_balance_usdt?: number | null
          tron_address?: string
        }
        Relationships: []
      }
      stories: {
        Row: {
          caption: string | null
          created_at: string
          creator_id: string
          duration: number
          expires_at: string
          filter_used: string | null
          format: string
          id: string
          is_highlighted: boolean | null
          media_url: string
          metadata: Json | null
          thumbnail_url: string | null
          view_count: number | null
        }
        Insert: {
          caption?: string | null
          created_at?: string
          creator_id: string
          duration?: number
          expires_at: string
          filter_used?: string | null
          format?: string
          id?: string
          is_highlighted?: boolean | null
          media_url: string
          metadata?: Json | null
          thumbnail_url?: string | null
          view_count?: number | null
        }
        Update: {
          caption?: string | null
          created_at?: string
          creator_id?: string
          duration?: number
          expires_at?: string
          filter_used?: string | null
          format?: string
          id?: string
          is_highlighted?: boolean | null
          media_url?: string
          metadata?: Json | null
          thumbnail_url?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      story_tags: {
        Row: {
          created_at: string
          id: string
          story_id: string
          tag_name: string
        }
        Insert: {
          created_at?: string
          id?: string
          story_id: string
          tag_name: string
        }
        Update: {
          created_at?: string
          id?: string
          story_id?: string
          tag_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_tags_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      story_views: {
        Row: {
          id: string
          story_id: string
          view_duration: number | null
          viewed_at: string
          viewer_id: string
        }
        Insert: {
          id?: string
          story_id: string
          view_duration?: number | null
          viewed_at?: string
          viewer_id: string
        }
        Update: {
          id?: string
          story_id?: string
          view_duration?: number | null
          viewed_at?: string
          viewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_views_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_tiers: {
        Row: {
          created_at: string | null
          duration_days: number
          features: Json | null
          id: string
          is_active: boolean | null
          name: string
          price_usdt: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          duration_days: number
          features?: Json | null
          id?: string
          is_active?: boolean | null
          name: string
          price_usdt: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          duration_days?: number
          features?: Json | null
          id?: string
          is_active?: boolean | null
          name?: string
          price_usdt?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount_usdt: number
          created_at: string | null
          id: string
          reference_id: string | null
          status: string
          transaction_type: string
          tron_tx_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount_usdt: number
          created_at?: string | null
          id?: string
          reference_id?: string | null
          status: string
          transaction_type: string
          tron_tx_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount_usdt?: number
          created_at?: string | null
          id?: string
          reference_id?: string | null
          status?: string
          transaction_type?: string
          tron_tx_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      tron_transactions: {
        Row: {
          amount: number
          created_at: string
          from_address: string
          id: string
          metadata: Json | null
          status: string
          to_address: string
          token_type: string
          transaction_hash: string | null
          updated_at: string
          user_id: string | null
          verified_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          from_address: string
          id?: string
          metadata?: Json | null
          status?: string
          to_address: string
          token_type?: string
          transaction_hash?: string | null
          updated_at?: string
          user_id?: string | null
          verified_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          from_address?: string
          id?: string
          metadata?: Json | null
          status?: string
          to_address?: string
          token_type?: string
          transaction_hash?: string | null
          updated_at?: string
          user_id?: string | null
          verified_at?: string | null
        }
        Relationships: []
      }
      user_follows: {
        Row: {
          created_at: string
          creator_id: string
          follower_id: string
          id: string
        }
        Insert: {
          created_at?: string
          creator_id: string
          follower_id: string
          id?: string
        }
        Update: {
          created_at?: string
          creator_id?: string
          follower_id?: string
          id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_name: string | null
          id: string
          role: string
          updated_at: string | null
          username: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id: string
          role: string
          updated_at?: string | null
          username: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          role?: string
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          is_active: boolean | null
          starts_at: string | null
          tier_id: string
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          is_active?: boolean | null
          starts_at?: string | null
          tier_id: string
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          is_active?: boolean | null
          starts_at?: string | null
          tier_id?: string
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "subscription_tiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_subscriptions_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      video_stats: {
        Row: {
          avg_watch_time_seconds: number
          comments_count: number
          last_updated_at: string
          likes: number
          video_id: number
          views: number
        }
        Insert: {
          avg_watch_time_seconds?: number
          comments_count?: number
          last_updated_at?: string
          likes?: number
          video_id: number
          views?: number
        }
        Update: {
          avg_watch_time_seconds?: number
          comments_count?: number
          last_updated_at?: string
          likes?: number
          video_id?: number
          views?: number
        }
        Relationships: []
      }
      wallet_addresses: {
        Row: {
          balance_usdt: number | null
          created_at: string | null
          id: string
          is_verified: boolean | null
          tron_address: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          balance_usdt?: number | null
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          tron_address?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          balance_usdt?: number | null
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          tron_address?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      decrement_balance: {
        Args: { user_id_param: string; amount_param: number }
        Returns: number
      }
      increment_balance: {
        Args: { user_id_param: string; amount_param: number }
        Returns: number
      }
      is_creator: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      user_role: "fan" | "creator"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["fan", "creator"],
    },
  },
} as const
