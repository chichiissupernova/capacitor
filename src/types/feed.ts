
export interface FeedActivity {
  id: string;
  user_id: string;
  activity_type: 'win' | 'milestone' | 'streak' | 'badge_unlock' | 'connection' | 'task_completion' | 'content_progress';
  title: string;
  description: string | null;
  data: Record<string, any>;
  is_public: boolean;
  created_at: string;
  user_name: string | null;
  username: string | null;
  avatar_url: string | null;
  niche_preferences: string[] | null;
}

export interface FeedReaction {
  id: string;
  activity_id: string;
  user_id: string;
  reaction_type: 'big' | 'inspired' | 'goal';
  created_at: string;
}
