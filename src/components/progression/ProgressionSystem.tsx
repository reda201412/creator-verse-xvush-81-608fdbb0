import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { CircleDashed, Trophy, Star, 
  // Remove unused imports
  // Sparkles, Zap, ArrowUpRight
} from 'lucide-react';

interface ProgressionSystemProps {
  level: number;
  xp: number;
  xpRequiredForNextLevel: number;
  achievements: {
    title: string;
    description: string;
    icon: React.ReactNode;
  }[];
}

const ProgressionSystem = ({
  level,
  xp,
  xpRequiredForNextLevel,
  achievements
}: ProgressionSystemProps) => {
  const [showAchievements, setShowAchievements] = useState(false);
  
  return (
    <div className="glass-card rounded-2xl overflow-hidden shadow-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Progression</h3>
        <button 
          className="text-sm text-muted-foreground hover:text-foreground"
          onClick={() => setShowAchievements(!showAchievements)}
        >
          {showAchievements ? 'Cacher' : 'Voir'} les succès
        </button>
      </div>
      
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <CircleDashed size={20} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Niveau {level}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div 
            className="bg-primary h-2.5 rounded-full" 
            style={{ width: `${(xp / xpRequiredForNextLevel) * 100}%` }}
          ></div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {xp} / {xpRequiredForNextLevel} XP
        </p>
      </div>
      
      {showAchievements && (
        <div className="space-y-3">
          {achievements.map((achievement, index) => (
            <div key={index} className="flex items-center gap-3 p-2 rounded-md bg-muted/30">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                {achievement.icon}
              </div>
              <div>
                <p className="text-sm font-medium">{achievement.title}</p>
                <p className="text-xs text-muted-foreground">{achievement.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgressionSystem;
