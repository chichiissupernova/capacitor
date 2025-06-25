
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface UpcomingBadge {
  id: string;
  name: string;
  description: string;
  progress: number;
  current: number;
  target: number;
  icon: string;
}

export const sampleBadges: Badge[] = [
  {
    id: 'badge-1',
    name: 'First Post',
    description: 'Complete your first content task',
    icon: '🚀',
    unlocked: true,
  },
  {
    id: 'badge-2',
    name: '3-Day Streak',
    description: 'Post content for 3 days in a row',
    icon: '🔥',
    unlocked: true,
  },
  {
    id: 'badge-3',
    name: '7-Day Streak',
    description: 'Post content for 7 days in a row',
    icon: '🏆',
    unlocked: false,
  },
  {
    id: 'badge-4',
    name: '30-Day Streak',
    description: 'Post content for 30 days in a row',
    icon: '💎',
    unlocked: false,
  },
  {
    id: 'badge-5',
    name: 'Video Master',
    description: 'Create 5 video content pieces',
    icon: '🎬',
    unlocked: false,
  },
  {
    id: 'badge-6',
    name: 'Story Pro',
    description: 'Create 10 stories',
    icon: '📸',
    unlocked: false,
  },
];

export const upcomingBadges: UpcomingBadge[] = [
  {
    id: 'upcoming-1',
    name: '7-Day Streak',
    description: 'Post content for 7 days in a row',
    progress: 42,
    current: 3,
    target: 7,
    icon: '🏆',
  },
  {
    id: 'upcoming-2',
    name: 'Video Master',
    description: 'Create 5 video content pieces',
    progress: 20,
    current: 1,
    target: 5,
    icon: '🎬',
  },
  {
    id: 'upcoming-3',
    name: 'Story Pro',
    description: 'Create 10 stories',
    progress: 10,
    current: 1,
    target: 10,
    icon: '📸',
  },
];
