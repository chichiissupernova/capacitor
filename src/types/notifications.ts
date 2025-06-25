
export interface Notification {
  id: string;
  user_id: string;
  type: 'connection_request' | 'connection_accepted' | 'win_reaction' | 'milestone_unlocked' | 'system_update';
  title: string;
  message: string;
  data: Record<string, any>;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ConnectionRequest {
  id: string;
  requester_id: string;
  requested_id: string;
  status: 'pending' | 'accepted' | 'ignored';
  created_at: string;
  updated_at: string;
}

export interface GroupedNotifications {
  today: Notification[];
  yesterday: Notification[];
  older: Notification[];
}
