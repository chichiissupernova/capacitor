
// Custom type definitions for tables we've added
// This supplements the auto-generated types until they're updated

export interface SocialConnection {
  id: string;
  user_id: string;
  platform: string;
  username: string | null;
  access_token: string;
  token_secret: string | null;
  refresh_token: string | null;
  expires_at: string | null;
  connected_at: string;
  last_used_at: string | null;
}

export interface ScheduledContent {
  id: string;
  user_id: string;
  title: string;
  content: string | null;
  platform: string;
  content_type: string;
  media_urls: string[] | null;
  scheduled_for: string;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  auto_post: boolean;
  auto_post_platforms: string[] | null;
  publishing_results: any | null;
  tags: string[] | null;
}

// Helper type to handle Supabase query responses
export type SupabaseCustomResponse<T> = T extends Array<infer U> ? U[] : T;
