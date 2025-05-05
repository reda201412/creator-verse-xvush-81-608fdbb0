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
            foreignKeyName: "content_purchases_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
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
      user_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
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
      videos: {
        Row: {
          creatorId: number | null
          description: string | null
          format: string | null
          id: number
          is_premium: boolean | null
          isFree: boolean | null
          restrictions: Json | null
          thumbnail_url: string | null
          title: string | null
          token_price: number | null
          type: string | null
          uploadedat: string | null
          user_id: string | null
          video_url: string | null
          videoUrl: string | null
        }
        Insert: {
          creatorId?: number | null
          description?: string | null
          format?: string | null
          id?: number
          is_premium?: boolean | null
          isFree?: boolean | null
          restrictions?: Json | null
          thumbnail_url?: string | null
          title?: string | null
          token_price?: number | null
          type?: string | null
          uploadedat?: string | null
          user_id?: string | null
          video_url?: string | null
          videoUrl?: string | null
        }
        Update: {
          creatorId?: number | null
          description?: string | null
          format?: string | null
          id?: number
          is_premium?: boolean | null
          isFree?: boolean | null
          restrictions?: Json | null
          thumbnail_url?: string | null
          title?: string | null
          token_price?: number | null
          type?: string | null
          uploadedat?: string | null
          user_id?: string | null
          video_url?: string | null
          videoUrl?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "videos_creatorId_fkey"
            columns: ["creatorId"]
            isOneToOne: false
            referencedRelation: "creators"
            referencedColumns: ["id"]
          },
        ]
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
