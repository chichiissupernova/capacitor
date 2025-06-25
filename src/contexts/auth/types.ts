export interface User {
  id: string;
  email: string;
  name?: string;
  username?: string;
  avatarUrl?: string;
  points: number;
  level: number;
  levelPoints: number;
  maxLevelPoints: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate?: Date;
  tasksCompleted?: number;
  totalTasks?: number;
  weeklyActivity?: number;
  joinedAt?: Date;
  unlockedAchievements: string[];
  nichePreferences?: string[];
  instagramHandle?: string;
  tiktokHandle?: string;
  twitterHandle?: string;
  pinterestHandle?: string;
  youtubeHandle?: string;
  isTemporary?: boolean;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  loading?: boolean; // Backwards compatibility
  error?: Error | null;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserPoints: (points: number) => Promise<void>;
  updateUserData: (userData: Partial<User>) => Promise<void>;
  updateUserName: (name: string) => Promise<void>;
  updateUserAvatar: (avatarUrl: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUserStreak: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  completeTask: () => Promise<void>;
  clearError: () => void;
}
