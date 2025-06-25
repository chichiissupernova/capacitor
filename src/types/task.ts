
export interface Task {
  id: string;
  label: string;
  points: number;
  completed: boolean;
}

export interface Feedback {
  id?: string;
  user_id: string;
  content: string;
  feedback_type?: 'bug' | 'feature' | 'general';
  browser_info?: {
    userAgent?: string;
    url?: string;
    recentLogs?: any[];
  };
  created_at?: string;
}
