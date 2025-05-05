
export type PathIcon = 'creator' | 'explorer' | 'curator' | 'supporter' | 'analyst';
export type BadgeRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type TaskDifficulty = 'easy' | 'medium' | 'hard';
export type RewardType = 'badge' | 'token' | 'experience' | 'feature';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: BadgeRarity;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  progress: number;
  total: number;
  completed: boolean;
  reward: {
    type: RewardType;
    itemId?: string;
    itemName?: string;
    amount?: number;
  };
}

export interface Task {
  id: string;
  name: string;
  description: string;
  progress: number;
  total: number;
  completed: boolean;
  difficulty: TaskDifficulty;
  reward: {
    type: RewardType;
    amount: number;
  };
}

export interface PathProgress {
  id: string;
  name: string;
  description: string;
  icon: PathIcon;
  level: number;
  maxLevel: number;
  experience: number;
  experienceToNextLevel: number;
  primaryColor: string;
  unlocked: boolean;
  badges: Badge[];
  achievements: Achievement[];
  tasks: Task[];
}
