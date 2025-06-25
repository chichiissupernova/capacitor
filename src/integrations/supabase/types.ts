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
      "activity logs": {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      activity_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      brand_profiles: {
        Row: {
          audience_type: string | null
          bio: string | null
          brand_name: string
          budget_range: string
          collaboration_types: string[]
          contact_person: string
          created_at: string
          email: string
          id: string
          preferred_platforms: string[]
          product_niches: string[]
          status: string
          updated_at: string
          website_url: string | null
        }
        Insert: {
          audience_type?: string | null
          bio?: string | null
          brand_name: string
          budget_range: string
          collaboration_types?: string[]
          contact_person: string
          created_at?: string
          email: string
          id?: string
          preferred_platforms?: string[]
          product_niches?: string[]
          status?: string
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          audience_type?: string | null
          bio?: string | null
          brand_name?: string
          budget_range?: string
          collaboration_types?: string[]
          contact_person?: string
          created_at?: string
          email?: string
          id?: string
          preferred_platforms?: string[]
          product_niches?: string[]
          status?: string
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      calendar_tasks: {
        Row: {
          completed: boolean
          content_type: string
          created_at: string
          date: string
          description: string | null
          id: string
          platform: string
          points: number
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          content_type: string
          created_at?: string
          date: string
          description?: string | null
          id?: string
          platform: string
          points?: number
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          content_type?: string
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          platform?: string
          points?: number
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_creator_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_participants: {
        Row: {
          challenge_id: string
          id: string
          joined_at: string
          user_id: string
        }
        Insert: {
          challenge_id: string
          id?: string
          joined_at?: string
          user_id: string
        }
        Update: {
          challenge_id?: string
          id?: string
          joined_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenge_participants_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenge_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_creator_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenge_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenge_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      challenges: {
        Row: {
          challenge_length: number
          challenger_id: string
          challenger_points: number
          created_at: string
          end_date: string
          id: string
          invite_expires_at: string | null
          invite_token: string | null
          invited_username: string | null
          opponent_id: string | null
          opponent_points: number
          start_date: string
          status: string
          updated_at: string
          winner_id: string | null
        }
        Insert: {
          challenge_length?: number
          challenger_id: string
          challenger_points?: number
          created_at?: string
          end_date: string
          id?: string
          invite_expires_at?: string | null
          invite_token?: string | null
          invited_username?: string | null
          opponent_id?: string | null
          opponent_points?: number
          start_date: string
          status?: string
          updated_at?: string
          winner_id?: string | null
        }
        Update: {
          challenge_length?: number
          challenger_id?: string
          challenger_points?: number
          created_at?: string
          end_date?: string
          id?: string
          invite_expires_at?: string | null
          invite_token?: string | null
          invited_username?: string | null
          opponent_id?: string | null
          opponent_points?: number
          start_date?: string
          status?: string
          updated_at?: string
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "challenges_challenger_id_fkey"
            columns: ["challenger_id"]
            isOneToOne: false
            referencedRelation: "public_creator_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenges_challenger_id_fkey"
            columns: ["challenger_id"]
            isOneToOne: false
            referencedRelation: "public_user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenges_challenger_id_fkey"
            columns: ["challenger_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenges_opponent_id_fkey"
            columns: ["opponent_id"]
            isOneToOne: false
            referencedRelation: "public_creator_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenges_opponent_id_fkey"
            columns: ["opponent_id"]
            isOneToOne: false
            referencedRelation: "public_user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenges_opponent_id_fkey"
            columns: ["opponent_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenges_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "public_creator_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenges_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "public_user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenges_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      Chichi: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      collaboration_messages: {
        Row: {
          collaboration_request_id: string
          created_at: string
          id: string
          message: string
          sender_id: string
          sender_type: string
        }
        Insert: {
          collaboration_request_id: string
          created_at?: string
          id?: string
          message: string
          sender_id: string
          sender_type: string
        }
        Update: {
          collaboration_request_id?: string
          created_at?: string
          id?: string
          message?: string
          sender_id?: string
          sender_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "collaboration_messages_collaboration_request_id_fkey"
            columns: ["collaboration_request_id"]
            isOneToOne: false
            referencedRelation: "collaboration_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      collaboration_requests: {
        Row: {
          brand_id: string
          created_at: string
          creator_id: string
          id: string
          message: string | null
          status: string
          updated_at: string
        }
        Insert: {
          brand_id: string
          created_at?: string
          creator_id: string
          id?: string
          message?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          brand_id?: string
          created_at?: string
          creator_id?: string
          id?: string
          message?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "collaboration_requests_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brand_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collaboration_requests_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "public_creator_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collaboration_requests_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "public_user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collaboration_requests_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      connection_requests: {
        Row: {
          created_at: string
          id: string
          requested_id: string
          requester_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          requested_id: string
          requester_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          requested_id?: string
          requester_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      creator_feed_activities: {
        Row: {
          activity_type: string
          created_at: string
          data: Json | null
          description: string | null
          id: string
          is_public: boolean | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string
          data?: Json | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          data?: Json | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      "dailty tasks": {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      daily_tasks: {
        Row: {
          completed: boolean | null
          created_at: string | null
          id: string
          points: number | null
          task_date: string
          task_id: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          points?: number | null
          task_date: string
          task_id: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          points?: number | null
          task_date?: string
          task_id?: string
          user_id?: string
        }
        Relationships: []
      }
      feed_reactions: {
        Row: {
          activity_id: string
          created_at: string
          id: string
          reaction_type: string
          user_id: string
        }
        Insert: {
          activity_id: string
          created_at?: string
          id?: string
          reaction_type: string
          user_id: string
        }
        Update: {
          activity_id?: string
          created_at?: string
          id?: string
          reaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feed_reactions_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "creator_feed_activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feed_reactions_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "creator_feed_with_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          browser_info: Json | null
          content: string
          created_at: string
          feedback_type: string | null
          id: string
          user_id: string
        }
        Insert: {
          browser_info?: Json | null
          content: string
          created_at?: string
          feedback_type?: string | null
          id?: string
          user_id: string
        }
        Update: {
          browser_info?: Json | null
          content?: string
          created_at?: string
          feedback_type?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      instagram_analytics: {
        Row: {
          account_type: string | null
          biography: string | null
          connection_id: string
          created_at: string
          followers_count: number | null
          following_count: number | null
          id: string
          media_count: number | null
          profile_picture_url: string | null
          synced_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          account_type?: string | null
          biography?: string | null
          connection_id: string
          created_at?: string
          followers_count?: number | null
          following_count?: number | null
          id?: string
          media_count?: number | null
          profile_picture_url?: string | null
          synced_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          account_type?: string | null
          biography?: string | null
          connection_id?: string
          created_at?: string
          followers_count?: number | null
          following_count?: number | null
          id?: string
          media_count?: number | null
          profile_picture_url?: string | null
          synced_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "instagram_analytics_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "instagram_connections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "instagram_analytics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_creator_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "instagram_analytics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "instagram_analytics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      instagram_connections: {
        Row: {
          access_token: string
          connected_at: string
          id: string
          instagram_user_id: string
          is_active: boolean
          last_synced_at: string | null
          refresh_token: string | null
          token_expires_at: string | null
          user_id: string
          username: string
        }
        Insert: {
          access_token: string
          connected_at?: string
          id?: string
          instagram_user_id: string
          is_active?: boolean
          last_synced_at?: string | null
          refresh_token?: string | null
          token_expires_at?: string | null
          user_id: string
          username: string
        }
        Update: {
          access_token?: string
          connected_at?: string
          id?: string
          instagram_user_id?: string
          is_active?: boolean
          last_synced_at?: string | null
          refresh_token?: string | null
          token_expires_at?: string | null
          user_id?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "instagram_connections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_creator_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "instagram_connections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "instagram_connections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      instagram_posts: {
        Row: {
          caption: string | null
          comments_count: number | null
          connection_id: string
          id: string
          instagram_post_id: string
          like_count: number | null
          media_type: string
          media_url: string | null
          permalink: string | null
          synced_at: string
          thumbnail_url: string | null
          timestamp: string | null
          user_id: string
        }
        Insert: {
          caption?: string | null
          comments_count?: number | null
          connection_id: string
          id?: string
          instagram_post_id: string
          like_count?: number | null
          media_type: string
          media_url?: string | null
          permalink?: string | null
          synced_at?: string
          thumbnail_url?: string | null
          timestamp?: string | null
          user_id: string
        }
        Update: {
          caption?: string | null
          comments_count?: number | null
          connection_id?: string
          id?: string
          instagram_post_id?: string
          like_count?: number | null
          media_type?: string
          media_url?: string | null
          permalink?: string | null
          synced_at?: string
          thumbnail_url?: string | null
          timestamp?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "instagram_posts_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "instagram_connections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "instagram_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_creator_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "instagram_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "instagram_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          message: string
          read_at: string | null
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          message: string
          read_at?: string | null
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          message?: string
          read_at?: string | null
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      post_progress: {
        Row: {
          caption_complete: boolean
          created_at: string | null
          date: string
          editing_complete: boolean
          id: string
          idea_complete: boolean
          post_complete: boolean
          recording_complete: boolean
          updated_at: string | null
          user_id: string
        }
        Insert: {
          caption_complete?: boolean
          created_at?: string | null
          date?: string
          editing_complete?: boolean
          id?: string
          idea_complete?: boolean
          post_complete?: boolean
          recording_complete?: boolean
          updated_at?: string | null
          user_id: string
        }
        Update: {
          caption_complete?: boolean
          created_at?: string | null
          date?: string
          editing_complete?: boolean
          id?: string
          idea_complete?: boolean
          post_complete?: boolean
          recording_complete?: boolean
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      "task completions": {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      task_completions: {
        Row: {
          completed_at: string | null
          id: string
          points_earned: number | null
          task_id: string
          task_name: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          id?: string
          points_earned?: number | null
          task_id: string
          task_name: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          id?: string
          points_earned?: number | null
          task_id?: string
          task_name?: string
          user_id?: string
        }
        Relationships: []
      }
      "user profiles": {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      user_follows: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "public_creator_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "public_user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "public_creator_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "public_user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_leaderboard_stats: {
        Row: {
          all_time_points: number
          created_at: string
          current_streak: number
          id: string
          last_rank_update: string | null
          monthly_points: number
          rank_change: number
          updated_at: string
          user_id: string
          weekly_points: number
        }
        Insert: {
          all_time_points?: number
          created_at?: string
          current_streak?: number
          id?: string
          last_rank_update?: string | null
          monthly_points?: number
          rank_change?: number
          updated_at?: string
          user_id: string
          weekly_points?: number
        }
        Update: {
          all_time_points?: number
          created_at?: string
          current_streak?: number
          id?: string
          last_rank_update?: string | null
          monthly_points?: number
          rank_change?: number
          updated_at?: string
          user_id?: string
          weekly_points?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_leaderboard_stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "public_creator_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_leaderboard_stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "public_user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_leaderboard_stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_messages: {
        Row: {
          created_at: string
          id: string
          message: string
          read_at: string | null
          recipient_id: string
          sender_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read_at?: string | null
          recipient_id: string
          sender_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read_at?: string | null
          recipient_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      user_privacy_settings: {
        Row: {
          created_at: string
          id: string
          share_progress_on_creator_connect: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          share_progress_on_creator_connect?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          share_progress_on_creator_connect?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_privacy_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "public_creator_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_privacy_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "public_user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_privacy_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          current_streak: number | null
          email: string
          id: string
          instagram_handle: string | null
          joined_at: string | null
          last_activity_date: string | null
          level: number | null
          level_points: number | null
          longest_streak: number | null
          max_level_points: number | null
          name: string | null
          niche_preferences: string[] | null
          pinterest_handle: string | null
          points: number | null
          social_links: Json | null
          tasks_completed: number | null
          tiktok_handle: string | null
          total_tasks: number | null
          twitter_handle: string | null
          unlocked_achievements: string[] | null
          updated_at: string | null
          username: string | null
          weekly_activity: number | null
          youtube_handle: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          current_streak?: number | null
          email: string
          id: string
          instagram_handle?: string | null
          joined_at?: string | null
          last_activity_date?: string | null
          level?: number | null
          level_points?: number | null
          longest_streak?: number | null
          max_level_points?: number | null
          name?: string | null
          niche_preferences?: string[] | null
          pinterest_handle?: string | null
          points?: number | null
          social_links?: Json | null
          tasks_completed?: number | null
          tiktok_handle?: string | null
          total_tasks?: number | null
          twitter_handle?: string | null
          unlocked_achievements?: string[] | null
          updated_at?: string | null
          username?: string | null
          weekly_activity?: number | null
          youtube_handle?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          current_streak?: number | null
          email?: string
          id?: string
          instagram_handle?: string | null
          joined_at?: string | null
          last_activity_date?: string | null
          level?: number | null
          level_points?: number | null
          longest_streak?: number | null
          max_level_points?: number | null
          name?: string | null
          niche_preferences?: string[] | null
          pinterest_handle?: string | null
          points?: number | null
          social_links?: Json | null
          tasks_completed?: number | null
          tiktok_handle?: string | null
          total_tasks?: number | null
          twitter_handle?: string | null
          unlocked_achievements?: string[] | null
          updated_at?: string | null
          username?: string | null
          weekly_activity?: number | null
          youtube_handle?: string | null
        }
        Relationships: []
      }
      user_social_links: {
        Row: {
          created_at: string
          handle: string
          id: string
          platform: string
          updated_at: string
          url: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          handle: string
          id?: string
          platform: string
          updated_at?: string
          url?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          handle?: string
          id?: string
          platform?: string
          updated_at?: string
          url?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_social_links_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_creator_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_social_links_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_social_links_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      win_reactions: {
        Row: {
          created_at: string
          id: string
          reaction_type: string
          user_id: string
          win_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          reaction_type: string
          user_id: string
          win_id: string
        }
        Update: {
          created_at?: string
          id?: string
          reaction_type?: string
          user_id?: string
          win_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "win_reactions_win_id_fkey"
            columns: ["win_id"]
            isOneToOne: false
            referencedRelation: "community_wins_with_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "win_reactions_win_id_fkey"
            columns: ["win_id"]
            isOneToOne: false
            referencedRelation: "wins"
            referencedColumns: ["id"]
          },
        ]
      }
      wins: {
        Row: {
          created_at: string
          date: string
          description: string | null
          id: string
          platform: string
          screenshot_url: string | null
          share_to_community: boolean
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          platform: string
          screenshot_url?: string | null
          share_to_community?: boolean
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          platform?: string
          screenshot_url?: string | null
          share_to_community?: boolean
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      community_wins_with_profiles: {
        Row: {
          avatar_url: string | null
          big_reactions: number | null
          created_at: string | null
          date: string | null
          description: string | null
          goal_reactions: number | null
          id: string | null
          inspired_reactions: number | null
          platform: string | null
          screenshot_url: string | null
          tags: string[] | null
          title: string | null
          user_name: string | null
          username: string | null
        }
        Relationships: []
      }
      creator_feed_with_profiles: {
        Row: {
          activity_type: string | null
          avatar_url: string | null
          created_at: string | null
          data: Json | null
          description: string | null
          id: string | null
          is_public: boolean | null
          niche_preferences: string[] | null
          title: string | null
          updated_at: string | null
          user_id: string | null
          user_name: string | null
          username: string | null
        }
        Relationships: []
      }
      messages_with_profiles: {
        Row: {
          created_at: string | null
          id: string | null
          message: string | null
          read_at: string | null
          recipient_avatar_url: string | null
          recipient_id: string | null
          recipient_name: string | null
          recipient_username: string | null
          sender_avatar_url: string | null
          sender_id: string | null
          sender_name: string | null
          sender_username: string | null
        }
        Relationships: []
      }
      public_creator_profiles: {
        Row: {
          avatar_url: string | null
          current_streak: number | null
          follower_count: number | null
          following_count: number | null
          id: string | null
          joined_at: string | null
          level: number | null
          longest_streak: number | null
          name: string | null
          points: number | null
          username: string | null
        }
        Relationships: []
      }
      public_user_profiles: {
        Row: {
          avatar_url: string | null
          current_streak: number | null
          follower_count: number | null
          following_count: number | null
          id: string | null
          joined_at: string | null
          level: number | null
          longest_streak: number | null
          name: string | null
          points: number | null
          social_links: Json | null
          username: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_challenge_points: {
        Args: {
          user_uuid: string
          start_date_param: string
          end_date_param: string
        }
        Returns: number
      }
      create_notification: {
        Args: {
          target_user_id: string
          notification_type: string
          notification_title: string
          notification_message: string
          notification_data?: Json
        }
        Returns: string
      }
      expire_old_challenges: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      generate_invite_token: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_conversations: {
        Args: { user_uuid: string }
        Returns: {
          other_user_id: string
          other_user_name: string
          other_user_username: string
          other_user_avatar_url: string
          last_message: string
          last_message_date: string
          unread_count: number
        }[]
      }
      join_challenge_by_token: {
        Args: { token: string; joiner_id: string }
        Returns: Json
      }
      update_user_leaderboard_stats: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      user_has_active_challenge: {
        Args: { user_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
