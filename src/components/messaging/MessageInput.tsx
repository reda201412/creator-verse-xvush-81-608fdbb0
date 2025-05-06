
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Mic, 
  Image, 
  Smile,
  Camera,
  Zap,
  X,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MonetizationTier } from '@/types/messaging';
import useHapticFeedback from '@/hooks/use-haptic-feedback';

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
  const [showCamera, setShowCamera] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const recordingInterval = useRef<number | null>(null);
  const { triggerHaptic } = useHapticFeedback();
  
  const handleSend = () => {
    if (message.trim()) {
      triggerHaptic('medium');
      onSendMessage(message);
      setMessage('');
    }
  };
  
  const startRecording = () => {
    triggerHaptic('medium');
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
    
    // Simulate sending a voice message
    onSendMessage("🎤 Message vocal");
    triggerHaptic('strong');
  };
  
  const toggleCamera = () => {
    triggerHaptic('medium');
    setShowCamera(!showCamera);
  };
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div>
      {/* Camera mode overlay */}
      <AnimatePresence>
        {showCamera && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-0 left-0 right-0 top-0 bg-black z-10 flex flex-col"
          >
            <div className="flex justify-between items-center p-4 border-b border-white/10">
              <h3 className="text-sm font-medium">Camera</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full h-8 w-8" 
                onClick={toggleCamera}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex-1 flex items-center justify-center bg-gray-900">
              <Camera className="h-16 w-16 text-gray-600" />
            </div>
            
            <div className="p-4 flex justify-center">
              <Button 
                size="icon" 
                className="h-16 w-16 rounded-full bg-white"
                onClick={() => {
                  triggerHaptic('strong');
                  toggleCamera();
                }}
              >
                <div className="h-14 w-14 rounded-full border-2 border-gray-900" />
              </Button>
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
            className="bg-gray-900 rounded-lg p-3 flex items-center justify-between mb-2"
          >
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm">{formatTime(recordingTime)}</span>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="rounded-full bg-red-500/10 text-red-500"
              onClick={stopRecording}
            >
              Envoyer
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main input area */}
      <div className="flex items-center gap-2">
        <div className="flex-shrink-0">
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            className="rounded-full h-10 w-10"
            onClick={toggleCamera}
          >
            <Camera className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            placeholder="Message..."
            className={cn(
              "w-full bg-gray-800 text-white rounded-full py-2 px-4 pr-10 outline-none",
              "border border-white/10 focus:border-purple-500/50",
              monetizationEnabled && "border-amber-500/50"
            )}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              setIsComposing(e.target.value.length > 0);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className={cn(
                "h-7 w-7 rounded-full",
                monetizationEnabled && "text-amber-500"
              )}
              onClick={() => {
                triggerHaptic('light');
                onToggleMonetization();
              }}
            >
              <Zap className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {message ? (
          <Button 
            type="button" 
            variant="ghost"
            size="icon" 
            className="rounded-full h-10 w-10 bg-purple-600 text-white hover:bg-purple-700"
            onClick={handleSend}
          >
            <Send className="h-5 w-5" />
          </Button>
        ) : (
          <Button 
            type="button" 
            variant="ghost"
            size="icon" 
            className="rounded-full h-10 w-10 bg-purple-600 text-white hover:bg-purple-700"
            onClick={startRecording}
            disabled={isRecording}
          >
            <Mic className="h-5 w-5" />
          </Button>
        )}
      </div>
      
      {/* Emoji row */}
      <div className="flex justify-center mt-2 overflow-x-auto no-scrollbar">
        <div className="flex gap-2">
          {['❤️', '👍', '🔥', '😂', '😍', '🎉', '💫'].map((emoji, i) => (
            <button 
              key={i} 
              className="text-lg hover:scale-125 transition-transform"
              onClick={() => {
                setMessage(prev => prev + emoji);
                triggerHaptic('light');
              }}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
