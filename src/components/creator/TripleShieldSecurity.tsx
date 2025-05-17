
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ShieldCheck, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TripleShieldSecurityProps {
  level: 1 | 2 | 3;
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animated?: boolean;
}

const TripleShieldSecurity: React.FC<TripleShieldSecurityProps> = ({
  level = 1,
  showLabels = true,
  size = 'md',
  className,
  animated = true
}) => {
  const tiers = [
    { 
      name: 'Standard', 
      color: 'text-blue-500',
      bgColor: 'bg-blue-100',
      icon: Shield,
      description: 'Protection de base contre la copie'
    },
    { 
      name: 'Premium', 
      color: 'text-purple-500',
      bgColor: 'bg-purple-100',
      icon: ShieldCheck,
      description: 'Filigrane invisible + détection de copie'
    },
    { 
      name: 'VIP', 
      color: 'text-amber-500',
      bgColor: 'bg-amber-100',
      icon: ShieldAlert,
      description: 'Filigrane + chiffrement + détection d\'écran'
    }
  ];
  
  const sizeClasses = {
    sm: 'h-4 w-4 text-xs',
    md: 'h-6 w-6 text-sm',
    lg: 'h-8 w-8 text-base'
  };
  
  const iconSize = {
    sm: 14,
    md: 18, 
    lg: 24
  }[size];
  
  return (
    <div className={cn("flex flex-col space-y-3", className)}>
      {showLabels && (
        <h3 className="text-sm font-medium">Niveau de Protection TRIPLE SHIELD</h3>
      )}
      
      <div className="flex space-x-3">
        {tiers.map((tier, index) => {
          const active = index < level;
          const Icon = tier.icon;
          
          return (
            <motion.div
              key={tier.name}
              className={cn(
                "relative flex flex-col items-center justify-center p-2 rounded-lg transition-colors",
                active ? tier.bgColor : "bg-gray-100",
                showLabels ? "w-full" : "w-auto"
              )}
              animate={animated && active ? {
                scale: [1, 1.05, 1],
                opacity: [0.8, 1, 0.9]
              } : {}}
              transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
            >
              <Icon 
                size={iconSize}
                className={cn(
                  active ? tier.color : "text-gray-400"
                )}
                fill={active ? "currentColor" : "none"}
                fillOpacity={active ? 0.2 : 0}
              />
              
              {showLabels && (
                <>
                  <span className={cn(
                    "mt-1 font-medium",
                    sizeClasses[size],
                    active ? tier.color : "text-gray-400"
                  )}>
                    {tier.name}
                  </span>
                  <span className="text-xs text-gray-500 mt-1 text-center">
                    {tier.description}
                  </span>
                </>
              )}
              
              {animated && active && (
                <motion.div
                  className={cn(
                    "absolute inset-0 rounded-lg border-2",
                    active ? tier.color : "border-gray-200"
                  )}
                  initial={{ opacity: 0.5, scale: 0.95 }}
                  animate={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TripleShieldSecurity;
