
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Book } from 'lucide-react';
import { motion } from 'framer-motion';

interface JourneyMilestone {
  id: string;
  date: string;
  title: string;
  description: string;
  metricBefore?: number;
  metricAfter?: number;
  metricLabel?: string;
}

interface CreatorJourneyProps {
  milestones: JourneyMilestone[];
  className?: string;
}

const CreatorJourney = ({ milestones = [], className }: CreatorJourneyProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  const toggleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Book className="h-6 w-6 text-primary" />
          <CardTitle>Creator Journey</CardTitle>
        </div>
        <CardDescription>
          Chronologie d'évolution et moments clés
        </CardDescription>
      </CardHeader>
      
      <CardContent className="relative">
        <div className="absolute left-[22px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 via-primary/30 to-muted-foreground/20"></div>
        
        <div className="space-y-6 relative ml-3">
          {milestones.map((milestone, index) => (
            <motion.div 
              key={milestone.id}
              layout
              className="relative"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="relative">
                <div 
                  className="absolute left-[-14px] h-5 w-5 rounded-full border-2 border-border bg-background"
                  style={{ top: '2px' }}
                ></div>
                
                <div className="ml-4 space-y-1">
                  <div className="flex justify-between items-start">
                    <button 
                      className="text-sm font-medium hover:text-primary transition-colors text-left"
                      onClick={() => toggleExpand(milestone.id)}
                    >
                      {milestone.title}
                    </button>
                    <span className="text-xs text-muted-foreground">{milestone.date}</span>
                  </div>
                  
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ 
                      height: expandedId === milestone.id ? 'auto' : 0,
                      opacity: expandedId === milestone.id ? 1 : 0
                    }}
                    className="overflow-hidden"
                  >
                    <div className="py-2">
                      <p className="text-sm text-muted-foreground">{milestone.description}</p>
                      
                      {milestone.metricLabel && milestone.metricBefore !== undefined && milestone.metricAfter !== undefined && (
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs">{milestone.metricLabel}:</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">{milestone.metricBefore.toLocaleString()}</span>
                            <span className="text-xs">→</span>
                            <span className="text-sm font-medium text-primary">{milestone.metricAfter.toLocaleString()}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                  
                  <Separator className="my-2" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatorJourney;
