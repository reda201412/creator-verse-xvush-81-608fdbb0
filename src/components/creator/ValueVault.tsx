
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Vault, Crown, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface ContentItem {
  id: string;
  title: string;
  type: 'premium' | 'standard' | 'vip';
  category: string;
  views: number;
  thumbnail?: string;
}

interface ValueVaultProps {
  premiumContent: ContentItem[];
  className?: string;
}

const ValueVault = ({ premiumContent = [], className }: ValueVaultProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...new Set(premiumContent.map(item => item.category))];
  
  const filteredContent = selectedCategory === 'all' 
    ? premiumContent
    : premiumContent.filter(item => item.category === selectedCategory);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'premium':
        return <Crown size={14} className="text-yellow-500" />;
      case 'vip':
        return <Star size={14} className="text-purple-500" />;
      default:
        return null;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Vault className="h-6 w-6 text-primary" />
          <CardTitle>Value Vault</CardTitle>
        </div>
        <CardDescription>
          Contenu exclusif et premium organisé intelligemment
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full flex mb-4 overflow-x-auto">
            {categories.map(category => (
              <TabsTrigger 
                key={category}
                value={category}
                onClick={() => setSelectedCategory(category)}
                className="flex-shrink-0"
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value={selectedCategory}>
            <motion.div 
              layout 
              className="grid grid-cols-1 md:grid-cols-2 gap-3"
            >
              {filteredContent.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="bg-secondary/20 rounded-lg p-3 border border-border/50 hover:border-primary/30 transition-all cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-sm">{item.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{item.views.toLocaleString()} vues</p>
                    </div>
                    <Badge 
                      variant={item.type === 'vip' ? 'destructive' : 'default'} 
                      className="flex items-center gap-1 text-xs"
                    >
                      {getTypeIcon(item.type)}
                      {item.type.toUpperCase()}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ValueVault;
