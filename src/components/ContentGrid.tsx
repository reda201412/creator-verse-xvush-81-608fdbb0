
import React, { useState } from 'react';
import ContentCard from './ContentCard';
import { cn } from '@/lib/utils';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Separator } from '@/components/ui/separator';
import { ChevronDown, ChevronUp, Layers } from 'lucide-react';
import { useNeuroAesthetic } from '@/hooks/use-neuro-aesthetic';

interface Content {
  id: string;
  imageUrl: string;
  title?: string;
  type: 'premium' | 'vip' | 'standard';
  format?: 'image' | 'video' | 'audio' | 'text';
  duration?: number;
  collection?: string;
  metrics?: {
    likes?: number;
    comments?: number;
    views?: number;
    revenue?: number;
    growth?: number;
  };
}

interface ContentCollection {
  name: string;
  contents: Content[];
}

interface ContentGridProps {
  contents: Content[];
  layout?: 'grid' | 'masonry' | 'featured' | 'vertical' | 'collections';
  className?: string;
  isCreator?: boolean;
  collections?: ContentCollection[];
}

const ContentGrid = ({ 
  contents, 
  layout = 'grid', 
  className,
  isCreator = false,
  collections = []
}: ContentGridProps) => {
  const [expandedCollections, setExpandedCollections] = useState<Record<string, boolean>>({});
  const { triggerMicroReward } = useNeuroAesthetic();
  
  // Déterminer les contenus tendances (si views > 10k ou growth > 15%)
  const trendingContents = contents.filter(content => 
    (content.metrics?.views && content.metrics.views > 10000) || 
    (content.metrics?.growth && content.metrics.growth > 15)
  ).sort((a, b) => {
    const aScore = (a.metrics?.views || 0) + (a.metrics?.growth || 0) * 100;
    const bScore = (b.metrics?.views || 0) + (b.metrics?.growth || 0) * 100;
    return bScore - aScore;
  });
  
  const toggleCollection = (name: string) => {
    setExpandedCollections(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
    triggerMicroReward('click');
  };
  
  // Layout: Vertical Flow (similaire à TikTok/Instagram Reels)
  if (layout === 'vertical') {
    return (
      <div className={cn("flex flex-col space-y-4", className)}>
        {trendingContents.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 flex items-center">
              <Layers size={18} className="mr-2 text-red-500" />
              Trending Content
            </h2>
            <div className="w-full overflow-hidden">
              <Carousel className="w-full">
                <CarouselContent>
                  {trendingContents.slice(0, 5).map((content) => (
                    <CarouselItem key={content.id} className="basis-3/4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                      <ContentCard 
                        key={content.id}
                        imageUrl={content.imageUrl}
                        title={content.title}
                        type={content.type}
                        format={content.format}
                        duration={content.duration}
                        metrics={content.metrics}
                        isTrending={true}
                        isCreator={isCreator}
                        size="md"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-1 sm:-left-4" />
                <CarouselNext className="right-1 sm:-right-4" />
              </Carousel>
            </div>
          </div>
        )}
        
        {contents.map((content) => (
          <ContentCard 
            key={content.id}
            imageUrl={content.imageUrl}
            title={content.title}
            type={content.type}
            format={content.format}
            duration={content.duration}
            metrics={content.metrics}
            isCreator={isCreator}
            size="xl"
            className="w-full max-w-2xl mx-auto"
          />
        ))}
      </div>
    );
  }
  
  // Layout: Collections
  if (layout === 'collections') {
    // Si pas de collections explicites, générer des collections à partir des tags
    const renderedCollections = collections.length > 0 ? collections : 
      // Regrouper le contenu par collection si spécifiée
      Object.entries(
        contents.reduce<Record<string, Content[]>>((acc, content) => {
          const collection = content.collection || 'Uncategorized';
          if (!acc[collection]) acc[collection] = [];
          acc[collection].push(content);
          return acc;
        }, {})
      ).map(([name, items]) => ({ name, contents: items }));

    return (
      <div className={cn("space-y-8", className)}>
        {/* Trending section at top if we have trending content */}
        {trendingContents.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 flex items-center">
              <Layers size={18} className="mr-2 text-red-500" />
              Trending Content
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {trendingContents.slice(0, 3).map((content) => (
                <ContentCard 
                  key={content.id}
                  imageUrl={content.imageUrl}
                  title={content.title}
                  type={content.type}
                  format={content.format}
                  duration={content.duration}
                  metrics={content.metrics}
                  isTrending={true}
                  isCreator={isCreator}
                  size="lg"
                />
              ))}
            </div>
          </div>
        )}
        
        {renderedCollections.map((collection) => (
          <div key={collection.name} className="space-y-3">
            <div 
              className="flex justify-between items-center cursor-pointer" 
              onClick={() => toggleCollection(collection.name)}
            >
              <h3 className="text-lg font-medium">{collection.name}</h3>
              <button className="p-1 hover:bg-muted rounded-full">
                {expandedCollections[collection.name] ? 
                  <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
            </div>
            
            {(!expandedCollections[collection.name] || expandedCollections[collection.name] === true) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {collection.contents.map((content) => (
                  <ContentCard 
                    key={content.id}
                    imageUrl={content.imageUrl}
                    title={content.title}
                    type={content.type}
                    format={content.format}
                    duration={content.duration}
                    metrics={content.metrics}
                    isCreator={isCreator}
                    collectionName={collection.name}
                  />
                ))}
              </div>
            )}
            <Separator className="mt-6" />
          </div>
        ))}
      </div>
    );
  }
  
  if (layout === 'featured') {
    // First item is featured (larger), rest are in a standard grid
    const featured = contents[0];
    const rest = contents.slice(1);
    
    // Identifier les contenus tendances pour la section du milieu
    const trendingFromRest = rest
      .filter(content => 
        (content.metrics?.views && content.metrics.views > 10000) || 
        (content.metrics?.growth && content.metrics.growth > 15)
      )
      .slice(0, 3);
    
    // Contenu restant après avoir extrait featured et trending
    const remaining = rest.filter(content => !trendingFromRest.includes(content));
    
    return (
      <div className={cn("space-y-8", className)}>
        {/* Featured content */}
        {featured && (
          <div>
            <h2 className="text-xl font-semibold mb-3">Featured Content</h2>
            <ContentCard 
              imageUrl={featured.imageUrl}
              title={featured.title}
              type={featured.type}
              format={featured.format}
              duration={featured.duration}
              metrics={featured.metrics}
              size="xl"
              isCreator={isCreator}
              className="w-full"
            />
          </div>
        )}
        
        {/* Trending content */}
        {trendingFromRest.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-3 flex items-center">
              <Layers size={20} className="mr-2 text-red-500" />
              Trending Now
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {trendingFromRest.map((content) => (
                <ContentCard 
                  key={content.id}
                  imageUrl={content.imageUrl}
                  title={content.title}
                  type={content.type}
                  format={content.format}
                  duration={content.duration}
                  metrics={content.metrics}
                  isTrending={true}
                  isCreator={isCreator}
                  size="lg"
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Recent content */}
        <div>
          <h2 className="text-xl font-semibold mb-3">Recent Content</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {remaining.map((content) => (
              <ContentCard 
                key={content.id}
                imageUrl={content.imageUrl}
                title={content.title}
                type={content.type}
                format={content.format}
                duration={content.duration}
                metrics={content.metrics}
                isCreator={isCreator}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (layout === 'masonry') {
    // Create an irregular grid for visual interest based on metrics
    return (
      <div className={cn("grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-max", className)}>
        {contents.map((content, index) => {
          // Determine size based on metrics and position
          let size = 'md';
          let className = '';
          
          const hasHighEngagement = 
            (content.metrics?.views && content.metrics.views > 10000) ||
            (content.metrics?.likes && content.metrics.likes > 1000);
          
          const isTrending = 
            (content.metrics?.growth && content.metrics.growth > 15);
          
          if (index % 7 === 0 || hasHighEngagement) {
            size = 'lg';
            className = 'col-span-2 row-span-2';
          } else if (index % 5 === 0 || isTrending) {
            size = 'md';
            className = 'col-span-1 row-span-1';
          }
          
          return (
            <ContentCard 
              key={content.id}
              imageUrl={content.imageUrl}
              title={content.title}
              type={content.type}
              format={content.format}
              duration={content.duration}
              metrics={content.metrics}
              isCreator={isCreator}
              isTrending={isTrending}
              size={size as 'sm' | 'md' | 'lg' | 'xl'}
              className={className}
            />
          );
        })}
      </div>
    );
  }
  
  // Default grid layout with improved spacing
  return (
    <div className={cn("grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4", className)}>
      {contents.map((content) => (
        <ContentCard 
          key={content.id}
          imageUrl={content.imageUrl}
          title={content.title}
          type={content.type}
          format={content.format}
          duration={content.duration} 
          metrics={content.metrics}
          isCreator={isCreator}
        />
      ))}
    </div>
  );
};

export default ContentGrid;
