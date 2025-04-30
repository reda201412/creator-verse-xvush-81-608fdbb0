
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dna } from 'lucide-react';

interface CreatorDNAProps {
  creatorName: string;
  creatorSkills: string[];
  creatorStyle: string[];
  creatorAchievements: string[];
  className?: string;
}

const CreatorDNA = ({ 
  creatorName,
  creatorSkills = [],
  creatorStyle = [],
  creatorAchievements = [],
  className 
}: CreatorDNAProps) => {
  const [activeSection, setActiveSection] = useState<'skills' | 'style' | 'achievements'>('skills');

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Dna className="h-6 w-6 text-primary" />
          <CardTitle>Creator DNA</CardTitle>
        </div>
        <CardDescription>
          Découvrez ce qui rend {creatorName} unique
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex justify-between mb-6 border-b">
          <button 
            className={`pb-2 px-4 ${activeSection === 'skills' ? 'border-b-2 border-primary font-medium' : 'text-muted-foreground'}`}
            onClick={() => setActiveSection('skills')}
          >
            Compétences
          </button>
          <button 
            className={`pb-2 px-4 ${activeSection === 'style' ? 'border-b-2 border-primary font-medium' : 'text-muted-foreground'}`}
            onClick={() => setActiveSection('style')}
          >
            Style
          </button>
          <button 
            className={`pb-2 px-4 ${activeSection === 'achievements' ? 'border-b-2 border-primary font-medium' : 'text-muted-foreground'}`}
            onClick={() => setActiveSection('achievements')}
          >
            Réussites
          </button>
        </div>
        
        <div className="min-h-[180px]">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: activeSection === 'skills' ? 1 : 0 }}
            className={`${activeSection !== 'skills' ? 'hidden' : ''}`}
          >
            <div className="flex flex-wrap gap-2">
              {creatorSkills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-sm py-1">
                  {skill}
                </Badge>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: activeSection === 'style' ? 1 : 0 }}
            className={`${activeSection !== 'style' ? 'hidden' : ''}`}
          >
            <div className="flex flex-wrap gap-2">
              {creatorStyle.map((style, index) => (
                <Badge key={index} variant="outline" className="text-sm py-1 border-primary/30">
                  {style}
                </Badge>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: activeSection === 'achievements' ? 1 : 0 }}
            className={`${activeSection !== 'achievements' ? 'hidden' : ''}`}
          >
            <div className="flex flex-wrap gap-2">
              {creatorAchievements.map((achievement, index) => (
                <Badge key={index} variant="default" className="text-sm py-1">
                  {achievement}
                </Badge>
              ))}
            </div>
          </motion.div>
        </div>
      </CardContent>

      <CardFooter className="text-sm text-muted-foreground">
        <p>Ces traits définissent le contenu et l'expérience unique de ce créateur</p>
      </CardFooter>
    </Card>
  );
};

export default CreatorDNA;
