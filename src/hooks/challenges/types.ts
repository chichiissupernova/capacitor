
export interface Challenge {
  id: string;
  challenger_id: string;
  opponent_id: string | null;
  start_date: string;
  end_date: string;
  status: 'pending' | 'active' | 'completed' | 'expired' | 'cancelled';
  challenger_points: number;
  opponent_points: number;
  winner_id: string | null;
  created_at: string;
  updated_at: string;
  challenge_length: number;
  invite_token: string | null;
  invite_expires_at: string | null;
  invited_username: string | null;
  challenger_profile?: {
    name: string;
    username: string | null;
    avatar_url: string | null;
  };
  opponent_profile?: {
    name: string;
    username: string | null;
    avatar_url: string | null;
  };
}
