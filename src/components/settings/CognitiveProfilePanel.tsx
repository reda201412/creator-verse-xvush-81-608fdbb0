import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
// Remove unused import
// import { Slider } from '@/components/ui/slider';

interface CognitiveProfilePanelProps {
  
}

const CognitiveProfilePanel = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [themePreference, setThemePreference] = useState<string>('auto');
  // Remove unused variable
  // const [preferredTimeOfDay, setPreferredTimeOfDay] = useState<string>('evening');
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profil cognitif</CardTitle>
        <CardDescription>
          Personnalisez votre expérience en fonction de vos préférences cognitives.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="notifications">Notifications</Label>
            <CardDescription>
              Recevez des notifications personnalisées pour rester informé.
            </CardDescription>
          </div>
          <Switch id="notifications" checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
        </div>
        <div>
          <Label>Thème</Label>
          <Select value={themePreference} onValueChange={setThemePreference}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez un thème" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Auto</SelectItem>
              <SelectItem value="light">Clair</SelectItem>
              <SelectItem value="dark">Sombre</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Préférence de l'heure de la journée</Label>
          <RadioGroup defaultValue="evening" className="flex">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="morning" id="morning" />
              <Label htmlFor="morning">Matin</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="afternoon" id="afternoon" />
              <Label htmlFor="afternoon">Après-midi</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="evening" id="evening" />
              <Label htmlFor="evening">Soir</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter>
        <Button>Enregistrer les modifications</Button>
      </CardFooter>
    </Card>
  );
};

export default CognitiveProfilePanel;
