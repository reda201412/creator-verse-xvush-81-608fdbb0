
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Lock, Zap, Smile, Send } from 'lucide-react';
import { MonetizationTier } from '@/types/messaging';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  monetizationEnabled?: boolean;
  onToggleMonetization?: () => void;
  monetizationTier?: MonetizationTier;
  monetizationAmount?: number;
  isEncrypted?: boolean;
  isComposing?: boolean;
  setIsComposing?: React.Dispatch<React.SetStateAction<boolean>>;
  setMonetizationTier?: React.Dispatch<React.SetStateAction<MonetizationTier>>;
  setMonetizationAmount?: React.Dispatch<React.SetStateAction<number>>;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  monetizationEnabled = false,
  onToggleMonetization,
  monetizationTier = 'basic',
  monetizationAmount = 1.99,
  isEncrypted = false,
  isComposing,
  setIsComposing,
  setMonetizationTier,
  setMonetizationAmount
}) => {
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={cn(
      "relative flex items-end gap-2",
      monetizationEnabled && "pb-6"
    )}>
      {monetizationEnabled && (
        <div className="absolute -top-10 left-0 right-0 bg-amber-50 dark:bg-amber-950/30 p-2 rounded-lg text-xs text-amber-600 dark:text-amber-400 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Zap size={14} />
            <span>Message monétisé: {monetizationTier} ({monetizationAmount}€)</span>
          </div>
        </div>
      )}
      
      <div className="flex-1 relative">
        <Textarea
          ref={inputRef}
          placeholder="Votre message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-10 py-2 pl-3 pr-10 max-h-32 resize-none"
          rows={1}
        />
        
        {isEncrypted && (
          <div className="absolute right-2 top-2 text-green-500">
            <Lock size={16} />
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Smile size={18} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Emojis</TooltipContent>
        </Tooltip>
        
        {onToggleMonetization && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={monetizationEnabled ? "default" : "ghost"} 
                size="icon" 
                className={cn(
                  "rounded-full",
                  monetizationEnabled && "bg-amber-500 text-white hover:bg-amber-600"
                )}
                onClick={onToggleMonetization}
              >
                <Zap size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {monetizationEnabled ? "Désactiver la monétisation" : "Monétiser ce message"}
            </TooltipContent>
          </Tooltip>
        )}
        
        <Button 
          variant="default" 
          size="icon" 
          className="rounded-full" 
          onClick={handleSendMessage}
          disabled={!message.trim()}
        >
          <Send size={18} />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
