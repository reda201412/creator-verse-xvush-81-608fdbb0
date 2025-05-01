
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Mic, 
  Image, 
  Smile,
  Paperclip,
  Zap,
  Volume,
  Video,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MonetizationTier } from '@/types/messaging';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isComposing: boolean;
  setIsComposing: (isComposing: boolean) => void;
  monetizationEnabled: boolean;
  onToggleMonetization: () => void;
  monetizationTier: MonetizationTier;
  setMonetizationTier: (tier: MonetizationTier) => void;
  monetizationAmount: number;
  setMonetizationAmount: (amount: number) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  isComposing,
  setIsComposing,
  monetizationEnabled,
  onToggleMonetization,
  monetizationTier,
  setMonetizationTier,
  monetizationAmount,
  setMonetizationAmount
}) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showEffects, setShowEffects] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recordingInterval = useRef<number | null>(null);
  
  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
      inputRef.current?.focus();
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const startRecording = () => {
    setIsRecording(true);
    let seconds = 0;
    recordingInterval.current = window.setInterval(() => {
      seconds += 1;
      setRecordingTime(seconds);
    }, 1000);
  };
  
  const stopRecording = () => {
    if (recordingInterval.current) {
      clearInterval(recordingInterval.current);
      recordingInterval.current = null;
    }
    setIsRecording(false);
    setRecordingTime(0);
    // In a real app, we would process the recorded audio here
    onSendMessage("🎤 Message vocal (0:00)");
  };
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="space-y-2">
      {/* Monetization indicator */}
      <AnimatePresence>
        {monetizationEnabled && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-amber-500/10 rounded-lg p-2 border border-amber-500/30"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap size={14} className="text-amber-500" />
                <span className="text-xs font-medium">Message monétisé</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold">{monetizationAmount}€</span>
                <Select 
                  value={monetizationTier} 
                  onValueChange={(value) => setMonetizationTier(value as MonetizationTier)}
                >
                  <SelectTrigger className="h-6 text-xs w-24">
                    <SelectValue placeholder="Tier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="vip">VIP</SelectItem>
                    <SelectItem value="exclusive">Exclusive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="mt-2">
              <Slider 
                min={0.99}
                max={49.99}
                step={0.5}
                value={[monetizationAmount]}
                onValueChange={(values) => setMonetizationAmount(values[0])}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Voice recording UI */}
      <AnimatePresence>
        {isRecording && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-primary/10 rounded-lg p-3 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm font-medium">Enregistrement {formatTime(recordingTime)}</span>
            </div>
            
            <Button variant="destructive" size="sm" onClick={stopRecording}>
              Terminer
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main input area */}
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <Textarea
            ref={inputRef}
            placeholder="Écrivez un message..."
            className={cn(
              "resize-none min-h-[60px] pr-12 transition-all",
              monetizationEnabled && "border-amber-500/50"
            )}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              setIsComposing(e.target.value.length > 0);
            }}
            onKeyDown={handleKeyDown}
            onBlur={() => setIsComposing(false)}
          />
          
          <div className="absolute bottom-2 right-2 flex items-center">
            <Button 
              type="button" 
              size="icon" 
              variant="ghost"
              className={cn(
                "rounded-full w-8 h-8",
                monetizationEnabled && "text-amber-500"
              )}
              onClick={onToggleMonetization}
            >
              <Zap size={16} />
            </Button>
          </div>
        </div>
        
        {message ? (
          <Button 
            type="button" 
            size="icon" 
            className="rounded-full h-10 w-10"
            onClick={handleSend}
          >
            <Send size={18} />
          </Button>
        ) : (
          <Button 
            type="button" 
            size="icon" 
            className="rounded-full h-10 w-10"
            onClick={startRecording}
            disabled={isRecording}
          >
            <Mic size={18} />
          </Button>
        )}
      </div>
      
      {/* Advanced options */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Button type="button" size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full">
            <Image size={16} />
          </Button>
          <Button type="button" size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full">
            <Video size={16} />
          </Button>
          <Button type="button" size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full">
            <Paperclip size={16} />
          </Button>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button type="button" size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full">
                <Smile size={16} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-60">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Effets visuels</h4>
                <div className="flex flex-wrap gap-2">
                  {['✨', '💖', '🔥', '🎉', '🌈', '💫', '🌟', '🎵', '🌈'].map((effect, i) => (
                    <Button 
                      key={i} 
                      size="sm" 
                      variant="outline" 
                      className="h-8 w-8 p-0"
                      onClick={() => setMessage(message + ' ' + effect)}
                    >
                      {effect}
                    </Button>
                  ))}
                </div>
                
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="encrypted" className="text-xs">Chiffrement</Label>
                    <Switch id="encrypted" defaultChecked />
                  </div>
                </div>
                
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="whisper-mode" className="text-xs">Mode Whisper</Label>
                    <Switch id="whisper-mode" />
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="text-xs text-muted-foreground">
          {isComposing ? "En train d'écrire..." : ""}
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
