
import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Users, Clock, User, TrendingUp } from 'lucide-react';

interface CreatorMetricsProps {
  metrics: {
    followers: number;
    following?: number;
    retentionRate?: number;
    superfans?: number;
    watchMinutes?: number;
  };
  className?: string;
}

const CreatorMetrics: React.FC<CreatorMetricsProps> = ({
  metrics,
  className
}) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <motion.div 
      className={cn("flex flex-wrap gap-5", className)}
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item} className="flex items-center gap-2">
        <div className="bg-primary/10 rounded-full p-2">
          <Users size={16} className="text-primary" />
        </div>
        <div>
          <div className="text-lg font-semibold">{formatNumber(metrics.followers)}</div>
          <div className="text-xs text-muted-foreground">Abonnés</div>
        </div>
      </motion.div>
      
      {metrics.following !== undefined && (
        <motion.div variants={item} className="flex items-center gap-2">
          <div className="bg-xvush-blue/10 rounded-full p-2">
            <User size={16} className="text-xvush-blue" />
          </div>
          <div>
            <div className="text-lg font-semibold">{formatNumber(metrics.following)}</div>
            <div className="text-xs text-muted-foreground">Abonnements</div>
          </div>
        </motion.div>
      )}
      
      {metrics.retentionRate !== undefined && (
        <motion.div variants={item} className="flex items-center gap-2">
          <div className="bg-green-500/10 rounded-full p-2">
            <TrendingUp size={16} className="text-green-500" />
          </div>
          <div>
            <div className="text-lg font-semibold">{metrics.retentionRate}%</div>
            <div className="text-xs text-muted-foreground">Rétention</div>
          </div>
        </motion.div>
      )}
      
      {metrics.superfans !== undefined && (
        <motion.div variants={item} className="flex items-center gap-2">
          <div className="bg-xvush-orange/10 rounded-full p-2">
            <User size={16} className="text-xvush-orange" />
          </div>
          <div>
            <div className="text-lg font-semibold">{metrics.superfans}</div>
            <div className="text-xs text-muted-foreground">Super-fans</div>
          </div>
        </motion.div>
      )}
      
      {metrics.watchMinutes !== undefined && (
        <motion.div variants={item} className="flex items-center gap-2">
          <div className="bg-xvush-teal/10 rounded-full p-2">
            <Clock size={16} className="text-xvush-teal" />
          </div>
          <div>
            <div className="text-lg font-semibold">{formatNumber(metrics.watchMinutes)}min</div>
            <div className="text-xs text-muted-foreground">Visionnage</div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CreatorMetrics;
