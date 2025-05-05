
import React, { useState } from 'react';
import { useNeuroAesthetic } from '@/hooks/use-neuro-aesthetic';
import { useUserBehavior } from '@/hooks/use-user-behavior';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/components/ui/sonner';
import { Brain, Eye, BarChart2, Compass, Clock, Zap, Sparkles } from 'lucide-react';

interface CognitiveProfilePanelProps {
  className?: string;
}

const CognitiveProfilePanel: React.FC<CognitiveProfilePanelProps> = ({ className }) => {
  const { config, updateConfig, circadian } = useNeuroAesthetic();
  const { getCognitiveProfile, resetBehaviorData } = useUserBehavior();
  
  const [detectedProfile, setDetectedProfile] = useState<string | null>(null);
  
  const profile = getCognitiveProfile();
  
  const detectProfile = () => {
    // Analyze behavior data to suggest cognitive profile
    const { attentionSpan, engagementLevel, preferredTimeOfDay } = profile;
    
    let suggestedProfile: 'visual' | 'analytical' | 'balanced' | 'immersive' = 'balanced';
    
    if (attentionSpan > 70) {
      suggestedProfile = 'analytical';
    } else if (attentionSpan < 30) {
      suggestedProfile = 'visual';
    }
    
    if (engagementLevel === 'high') {
      suggestedProfile = 'immersive';
    }
    
    setDetectedProfile(suggestedProfile);
    
    toast.success(`Profile détecté: ${suggestedProfile}`, {
      description: "Voulez-vous appliquer ce profil aux paramètres?"
    });
  };
  
  const applyDetectedProfile = () => {
    if (!detectedProfile) return;
    
    updateConfig({
      cognitiveProfile: detectedProfile as any,
      // Update other settings based on detected profile
      microRewardsIntensity: detectedProfile === 'visual' ? 70 : 
                              detectedProfile === 'analytical' ? 30 : 50,
      moodIntensity: detectedProfile === 'immersive' ? 80 : 50,
      animationSpeed: detectedProfile === 'analytical' ? 'reduced' : 'standard',
    });
    
    toast.success("Profil cognitif appliqué", {
      description: "L'interface s'adaptera à votre profil cognitif"
    });
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Profil Cognitif
        </CardTitle>
        <CardDescription>
          Personnalisez l'interface en fonction de votre profil cognitif
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium">Type de Profil</h4>
            <Button 
              variant="outline" 
              size="sm"
              onClick={detectProfile}
              className="flex items-center gap-1"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Détecter</span>
            </Button>
          </div>
          
          <RadioGroup 
            value={config.cognitiveProfile} 
            onValueChange={(value) => updateConfig({ 
              cognitiveProfile: value as 'visual' | 'analytical' | 'balanced' | 'immersive' 
            })}
            className="grid grid-cols-2 gap-2"
          >
            <div className="flex items-start space-x-2 rounded-md border p-3">
              <RadioGroupItem value="visual" id="visual" />
              <Label htmlFor="visual" className="grid gap-1 cursor-pointer">
                <div className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  <span>Visuel</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  Privilégie les stimuli visuels et les animations
                </span>
              </Label>
            </div>
            
            <div className="flex items-start space-x-2 rounded-md border p-3">
              <RadioGroupItem value="analytical" id="analytical" />
              <Label htmlFor="analytical" className="grid gap-1 cursor-pointer">
                <div className="flex items-center gap-1">
                  <BarChart2 className="h-3.5 w-3.5" />
                  <span>Analytique</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  Préfère les informations structurées, animations réduites
                </span>
              </Label>
            </div>
            
            <div className="flex items-start space-x-2 rounded-md border p-3">
              <RadioGroupItem value="balanced" id="balanced" />
              <Label htmlFor="balanced" className="grid gap-1 cursor-pointer">
                <div className="flex items-center gap-1">
                  <Compass className="h-3.5 w-3.5" />
                  <span>Équilibré</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  Équilibre entre visuels et informations structurées
                </span>
              </Label>
            </div>
            
            <div className="flex items-start space-x-2 rounded-md border p-3">
              <RadioGroupItem value="immersive" id="immersive" />
              <Label htmlFor="immersive" className="grid gap-1 cursor-pointer">
                <div className="flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Immersif</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  Expérience riche avec effets visuels amplifiés
                </span>
              </Label>
            </div>
          </RadioGroup>
          
          {detectedProfile && (
            <Button
              onClick={applyDetectedProfile}
              className="w-full mt-2"
            >
              Appliquer le profil détecté ({detectedProfile})
            </Button>
          )}
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <h4 className="text-sm font-medium">Adaptation Circadienne</h4>
            </div>
            <Switch 
              checked={config.autoAdapt}
              onCheckedChange={(checked) => updateConfig({ autoAdapt: checked })}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Adapte automatiquement l'interface en fonction de l'heure et de votre rythme circadien
          </p>
          
          {config.autoAdapt && (
            <div className="rounded-md bg-muted/50 p-3 text-sm">
              <p className="font-medium">Détection actuelle:</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Moment de la journée:</span>
                  <span className="font-medium capitalize">{circadian.timeOfDay}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phase circadienne:</span>
                  <span className="font-medium capitalize">{circadian.circadianPhase}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ambiance suggérée:</span>
                  <span className="font-medium capitalize">{circadian.suggestedMood}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vos préférences:</span>
                  <span className="font-medium capitalize">{profile.preferredTimeOfDay || "inconnues"}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Ajustements avancés</h4>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="contrast">Contraste</Label>
                <span className="text-xs text-muted-foreground capitalize">{config.contrastLevel}</span>
              </div>
              <RadioGroup 
                value={config.contrastLevel} 
                onValueChange={(value) => updateConfig({ 
                  contrastLevel: value as 'low' | 'standard' | 'high' 
                })}
                className="flex justify-between"
                id="contrast"
              >
                <div className="flex items-center gap-1.5">
                  <RadioGroupItem value="low" id="contrast-low" />
                  <Label htmlFor="contrast-low" className="text-xs">Bas</Label>
                </div>
                <div className="flex items-center gap-1.5">
                  <RadioGroupItem value="standard" id="contrast-standard" />
                  <Label htmlFor="contrast-standard" className="text-xs">Standard</Label>
                </div>
                <div className="flex items-center gap-1.5">
                  <RadioGroupItem value="high" id="contrast-high" />
                  <Label htmlFor="contrast-high" className="text-xs">Élevé</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="animation-speed">Vitesse d'animation</Label>
                <span className="text-xs text-muted-foreground capitalize">{config.animationSpeed}</span>
              </div>
              <RadioGroup 
                value={config.animationSpeed} 
                onValueChange={(value) => updateConfig({ 
                  animationSpeed: value as 'reduced' | 'standard' | 'enhanced' 
                })}
                className="flex justify-between"
                id="animation-speed"
              >
                <div className="flex items-center gap-1.5">
                  <RadioGroupItem value="reduced" id="animation-reduced" />
                  <Label htmlFor="animation-reduced" className="text-xs">Réduite</Label>
                </div>
                <div className="flex items-center gap-1.5">
                  <RadioGroupItem value="standard" id="animation-standard" />
                  <Label htmlFor="animation-standard" className="text-xs">Standard</Label>
                </div>
                <div className="flex items-center gap-1.5">
                  <RadioGroupItem value="enhanced" id="animation-enhanced" />
                  <Label htmlFor="animation-enhanced" className="text-xs">Dynamique</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={resetBehaviorData}
        >
          Réinitialiser les données
        </Button>
        <Button 
          size="sm"
          onClick={() => {
            updateConfig({
              ...defaultConfig,
              cognitiveProfile: 'balanced',
              contrastLevel: 'standard',
              animationSpeed: 'standard'
            });
            toast.success("Paramètres réinitialisés");
          }}
        >
          Rétablir les paramètres par défaut
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CognitiveProfilePanel;
