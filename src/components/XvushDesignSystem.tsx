
import React, { useEffect } from 'react';
import { useNeuroAesthetic } from '@/hooks/use-neuro-aesthetic';

interface XvushDesignSystemProps {
  children: React.ReactNode;
  className?: string;
}

const XvushDesignSystem: React.FC<XvushDesignSystemProps> = ({
  children,
  className
}) => {
  const { triggerMicroReward } = useNeuroAesthetic();
  
  // Apply design system to the document
  useEffect(() => {
    // Add design system CSS variables and classes
    document.documentElement.classList.add('xvush-design-system');
    
    // Clean up when unmounted
    return () => {
      document.documentElement.classList.remove('xvush-design-system');
      document.documentElement.classList.remove('focus-mode');
    };
  }, []);
  
  return (
    <div className={className}>
      {/* Main content */}
      {children}
    </div>
  );
};

export default XvushDesignSystem;
