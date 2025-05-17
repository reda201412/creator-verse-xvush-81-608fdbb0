
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max: number;
  color?: string;
  height?: string;
  className?: string;
  showPercentage?: boolean;
}

const ProgressBar = ({ 
  value, 
  max, 
  color = 'bg-xvush-pink', 
  height = 'h-1.5',
  className,
  showPercentage = false
}: ProgressBarProps) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  return (
    <div className={className}>
      <div className={cn("progress-bar", height)}>
        <div 
          className={cn("progress-fill", color)}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showPercentage && (
        <div className="text-xs text-muted-foreground mt-1">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
