
import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Brain, ZapFast, Crown, Edit2, Clock, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const CognitiveProfilePanel = () => {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    focus: 65,
    attention: 80,
    creativity: 70,
    cognition: 90,
  });

  const [userPreferences, setUserPreferences] = useState({
    autoAdaptContent: true,
    enhancedVisuals: true,
    contentPacing: 'balanced', // slow, balanced, fast
  });

  const handlePreferenceChange = (key: string, value: boolean | string) => {
    setUserPreferences(prev => ({
      ...prev,
      [key]: value
    }));
    
    let message = '';
    if (key === 'autoAdaptContent') {
      message = value 
        ? 'Adaptation automatique du contenu activée' 
        : 'Adaptation automatique du contenu désactivée';
    } else if (key === 'enhancedVisuals') {
      message = value 
        ? 'Mode visuel amélioré activé' 
        : 'Mode visuel standard activé';
    } else if (key === 'contentPacing') {
      message = `Rythme de contenu défini sur : ${value}`;
    }
    
    toast.success(message);
  };

  const handleSave = () => {
    setEditing(false);
    toast.success("Profil cognitif mis à jour", 
      "Vos préférences ont été enregistrées");
  };

  const calculateCognitiveScore = () => {
    const { focus, attention, creativity, cognition } = profile;
    return Math.round((focus + attention + creativity + cognition) / 4);
  };

  return (
    <div className="bg-card border rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-primary/10 p-3 rounded-full">
            <Brain className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Profil Cognitif</h3>
            <p className="text-muted-foreground text-sm">Personnalisation basée sur vos préférences cognitives</p>
          </div>
        </div>
        <Button size="sm" variant={editing ? "secondary" : "outline"} onClick={() => setEditing(!editing)}>
          <Edit2 className="h-4 w-4 mr-2" />
          {editing ? "Annuler" : "Modifier"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* Cognitive metrics */}
          <div className="space-y-4">
            <h4 className="font-medium">Métriques Cognitives</h4>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Focus</span>
                  <span className="font-medium">{profile.focus}%</span>
                </div>
                {editing ? (
                  <Slider 
                    value={[profile.focus]} 
                    onValueChange={(val) => setProfile({...profile, focus: val[0]})} 
                    max={100} 
                    step={1}
                  />
                ) : (
                  <Progress value={profile.focus} className="h-2" />
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Attention</span>
                  <span className="font-medium">{profile.attention}%</span>
                </div>
                {editing ? (
                  <Slider 
                    value={[profile.attention]} 
                    onValueChange={(val) => setProfile({...profile, attention: val[0]})} 
                    max={100} 
                    step={1}
                  />
                ) : (
                  <Progress value={profile.attention} className="h-2" />
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Créativité</span>
                  <span className="font-medium">{profile.creativity}%</span>
                </div>
                {editing ? (
                  <Slider 
                    value={[profile.creativity]} 
                    onValueChange={(val) => setProfile({...profile, creativity: val[0]})} 
                    max={100} 
                    step={1}
                  />
                ) : (
                  <Progress value={profile.creativity} className="h-2" />
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Cognition</span>
                  <span className="font-medium">{profile.cognition}%</span>
                </div>
                {editing ? (
                  <Slider 
                    value={[profile.cognition]} 
                    onValueChange={(val) => setProfile({...profile, cognition: val[0]})} 
                    max={100} 
                    step={1}
                  />
                ) : (
                  <Progress value={profile.cognition} className="h-2" />
                )}
              </div>
            </div>
          </div>
          
          {/* Score section */}
          <div className="flex items-center justify-between bg-muted/50 p-4 rounded-lg">
            <div>
              <span className="text-sm text-muted-foreground">Score Cognitif</span>
              <div className="text-2xl font-bold">{calculateCognitiveScore()}</div>
            </div>
            <div className="bg-primary/10 p-3 rounded-full">
              <Crown className="h-5 w-5 text-primary" />
            </div>
          </div>
          
          {editing && (
            <Button onClick={handleSave} className="w-full">Sauvegarder les modifications</Button>
          )}
        </div>
        
        <div className="space-y-6">
          <h4 className="font-medium">Préférences d'expérience</h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <ZapFast className="h-4 w-4 text-primary" />
                  <span className="font-medium">Adaptation automatique du contenu</span>
                </div>
                <p className="text-sm text-muted-foreground">Ajuster automatiquement l'expérience cognitive</p>
              </div>
              <Switch 
                checked={userPreferences.autoAdaptContent} 
                onCheckedChange={(checked) => handlePreferenceChange('autoAdaptContent', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">Visuels améliorés</span>
                </div>
                <p className="text-sm text-muted-foreground">Utiliser des effets visuels dynamiques</p>
              </div>
              <Switch 
                checked={userPreferences.enhancedVisuals}
                onCheckedChange={(checked) => handlePreferenceChange('enhancedVisuals', checked)}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-amber-500" />
                <span className="font-medium">Rythme du contenu</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">Définir la vitesse à laquelle le contenu est présenté</p>
              
              <div className="flex border rounded-lg overflow-hidden">
                {['lent', 'équilibré', 'rapide'].map((pace) => (
                  <button
                    key={pace}
                    className={`flex-1 text-center py-2 text-sm ${
                      userPreferences.contentPacing === pace ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                    }`}
                    onClick={() => handlePreferenceChange('contentPacing', pace)}
                  >
                    {pace}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <h5 className="font-medium mb-2">À propos du profil cognitif</h5>
            <p className="text-sm text-muted-foreground">
              Votre profil cognitif influence la façon dont le contenu est présenté et organisé pour vous.
              L'IA adapte l'expérience en fonction de vos préférences pour optimiser votre engagement et votre satisfaction.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CognitiveProfilePanel;
