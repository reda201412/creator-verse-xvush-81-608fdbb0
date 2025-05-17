import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export const NeuroConfigEditor = () => {
  const [previewActive, setPreviewActive] = useState(false);

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Neuro-Aesthetic Configuration</CardTitle>
        <CardDescription>Customize micro-reward triggers and behaviors.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="likeThreshold">Like Threshold</Label>
          <Slider id="likeThreshold" defaultValue={[50]} max={100} step={1} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="commentFrequency">Comment Frequency</Label>
          <Input id="commentFrequency" type="number" defaultValue={5} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="engagementScore">Engagement Score Weight</Label>
          <Slider id="engagementScore" defaultValue={[75]} max={100} step={1} />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <Label htmlFor="previewMode">Preview Mode</Label>
          <Switch id="previewMode" checked={previewActive} onCheckedChange={setPreviewActive} />
        </div>
        <AnimatePresence>
          {previewActive && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-3 p-3 rounded-md bg-muted"
            >
              <p className="text-sm text-muted-foreground">
                Previewing micro-reward triggers...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export const AdvancedSettings = () => {
  const [isAdvanced, setIsAdvanced] = useState(false);

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Advanced Settings</CardTitle>
        <CardDescription>Toggle advanced features for power users.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <Label htmlFor="advancedMode">Enable Advanced Mode</Label>
          <Switch id="advancedMode" checked={isAdvanced} onCheckedChange={setIsAdvanced} />
        </div>
        <AnimatePresence>
          {isAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-3 p-3 rounded-md bg-muted"
            >
              <p className="text-sm text-muted-foreground">
                Advanced settings are now enabled.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export const DebugPanel = () => {
  const [debugMode, setDebugMode] = useState(false);

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Debug Panel</CardTitle>
        <CardDescription>Enable debug mode for detailed insights.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <Label htmlFor="debugMode">Enable Debug Mode</Label>
          <Switch id="debugMode" checked={debugMode} onCheckedChange={setDebugMode} />
        </div>
        <AnimatePresence>
          {debugMode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-3 p-3 rounded-md bg-muted"
            >
              <p className="text-sm text-muted-foreground">
                Debug mode is active.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};
