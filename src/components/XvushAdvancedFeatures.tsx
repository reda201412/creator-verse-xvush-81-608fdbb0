import { useState } from 'react';
// Remove unused imports
// import { Button } from '@/components/ui/button';
// import { cn } from '@/lib/utils';

interface XvushAdvancedFeaturesProps {
  type?: 'creator' | 'consumer';
  intensity?: 'low' | 'medium' | 'high';
}

const XvushAdvancedFeatures = ({ type = 'consumer', intensity = 'medium' }: XvushAdvancedFeaturesProps) => {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  // Remove unused config variable
  
  const config = {
    creator: {
      low: ['exclusiveContent', 'microRewards'],
      medium: ['aiAssistance', 'tieredMonetization'],
      high: ['nftIntegration', 'arExperiences'],
    },
    consumer: {
      low: ['personalizedFeed', 'contentRecommendations'],
      medium: ['communityEngagement', 'interactiveContent'],
      high: ['vrExperiences', 'aiDrivenPersonalization'],
    },
  };

  const features = config[type][intensity];

  const toggleFeature = (feature: string) => {
    setActiveFeature(activeFeature === feature ? null : feature);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Advanced Features ({type}, {intensity})</h3>
      <ul>
        {features.map((feature) => (
          <li key={feature} className="flex items-center justify-between">
            <span>{feature}</span>
            <button
              onClick={() => toggleFeature(feature)}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
            >
              {activeFeature === feature ? 'Disable' : 'Enable'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default XvushAdvancedFeatures;
