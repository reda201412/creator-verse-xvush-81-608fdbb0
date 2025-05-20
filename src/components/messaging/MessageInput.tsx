
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Paperclip, Image, Send, Smile, Zap, Lock } from 'lucide-react';
import { MonetizationTier } from '@/types/messaging';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  isComposing: boolean;
  setIsComposing: (composing: boolean) => void;
  monetizationEnabled: boolean;
  onToggleMonetization?: () => void;
  monetizationTier: MonetizationTier;
  setMonetizationTier: (tier: MonetizationTier) => void;
  monetizationAmount: number;
  setMonetizationAmount: (amount: number) => void;
  isEncrypted?: boolean;
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
  setMonetizationAmount,
  isEncrypted = false
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => {
    if (textareaRef.current) {
      // Auto-resize textarea based on content
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    onSendMessage(message);
    setMessage('');
    
    // Reset height after sending
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Notify about composing state
    if (e.target.value.trim() && !isComposing) {
      setIsComposing(true);
    } else if (!e.target.value.trim() && isComposing) {
      setIsComposing(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="relative">
      {monetizationEnabled && (
        <div className="absolute -top-10 left-0 right-0 bg-amber-50 dark:bg-amber-900/30 p-2 rounded-t border border-amber-200 dark:border-amber-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="text-amber-500 h-4 w-4" />
            <span className="text-sm font-medium text-amber-700 dark:text-amber-300">Message premium</span>
          </div>
          <div className="flex items-center gap-2">
            <select 
              value={monetizationTier}
              onChange={(e) => setMonetizationTier(e.target.value as MonetizationTier)}
              className="bg-transparent border border-amber-300 dark:border-amber-700 rounded px-1 py-0.5 text-xs"
            >
              <option value="basic">Basic</option>
              <option value="premium">Premium</option>
              <option value="vip">VIP</option>
            </select>
            <input 
              type="number"
              value={monetizationAmount}
              onChange={(e) => setMonetizationAmount(Number(e.target.value))}
              min="0.01"
              step="0.01"
              className="w-16 bg-transparent border border-amber-300 dark:border-amber-700 rounded px-1 py-0.5 text-xs"
            />
          </div>
        </div>
      )}
      
      <div className={cn(
        "flex items-end gap-2 rounded-lg border bg-background p-2",
        monetizationEnabled && "border-amber-300 dark:border-amber-700"
      )}>
        <div className="flex gap-2 self-end">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-8 w-8"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-8 w-8"
          >
            <Image className="h-4 w-4" />
          </Button>
        </div>
        
        <Textarea
          ref={textareaRef}
          placeholder="Type a message..."
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="flex-1 resize-none border-0 focus-visible:ring-0 focus-visible:ring-transparent"
          rows={1}
          maxLength={2000}
        />
        
        <div className="flex gap-2 self-end">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-8 w-8"
          >
            <Smile className="h-4 w-4" />
          </Button>
          
          {onToggleMonetization && (
            <Button
              type="button"
              size="icon"
              variant={monetizationEnabled ? "default" : "ghost"}
              className={cn(
                "h-8 w-8", 
                monetizationEnabled && "bg-amber-500 hover:bg-amber-600 text-white"
              )}
              onClick={onToggleMonetization}
            >
              <Zap className="h-4 w-4" />
            </Button>
          )}
          
          {isEncrypted && (
            <div className="flex items-center px-2">
              <Lock className="h-3 w-3 text-green-500" />
            </div>
          )}
          
          <Button
            type="submit"
            size="icon"
            disabled={!message.trim()}
            className="h-8 w-8"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </form>
  );
};

export default MessageInput;
