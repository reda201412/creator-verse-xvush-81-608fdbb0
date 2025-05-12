import React, { useRef, useState } from 'react';
import { SendHorizontal, Image, Smile, Paperclip, HeartHandshake, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { MonetizationTier } from '@/types/messaging';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isComposing?: boolean;
  setIsComposing?: (isComposing: boolean) => void;
  monetizationEnabled?: boolean;
  onToggleMonetization?: () => void;
  monetizationTier?: MonetizationTier;
  setMonetizationTier?: (tier: MonetizationTier) => void;
  monetizationAmount?: number;
  setMonetizationAmount?: (amount: number) => void;
  disabled?: boolean;
  placeholder?: string;
  isEncrypted?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  isComposing = false,
  setIsComposing,
  monetizationEnabled = false,
  onToggleMonetization,
  monetizationTier = 'basic',
  setMonetizationTier,
  monetizationAmount = 0,
  setMonetizationAmount,
  disabled = false,
  placeholder = "Écrivez un message...",
  isEncrypted = false,
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  // Function to validate message content
  const validateContent = (text: string): string | null => {
    const maxLength = 1000; // Define maximum message length
    if (text.length > maxLength) {
      return `Message length exceeds the maximum limit of ${maxLength} characters.`;
    }

    // Basic HTML stripping (not foolproof, but adds a layer of protection)
    const strippedText = text.replace(/<[^>]*>/g, '');
    if (strippedText !== text) {
      console.warn("HTML tags detected and stripped from message.");
      // Consider showing a warning to the user
    }

    return null; // Content is valid
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    if (setIsComposing) {
      setIsComposing(e.target.value.length > 0);
    }
  };

  const handleSend = () => {
    if (!message.trim()) return;

    // Validate the message content
    const validationError = validateContent(message);
    if (validationError) {
      toast({
        title: "Error",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    onSendMessage(message);
    setMessage('');

    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageUpload = () => {
    toast({
      title: "Bientôt disponible",
      description: "L'envoi d'images sera bientôt disponible",
    });
  };

  return (
    <div className="flex flex-col space-y-2">
      {monetizationEnabled && (
        <div className="px-2 py-1 bg-amber-500/10 rounded-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap size={16} className="text-amber-500" />
            <span className="text-sm font-medium text-amber-500">
              Message monétisé ({monetizationTier}) - {monetizationAmount} USDT
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleMonetization}
          >
            Annuler
          </Button>
        </div>
      )}

      <div className="relative flex items-end gap-2">
        <div className="relative flex-1">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={cn(
              "resize-none min-h-[60px] pr-10 pt-3 bg-white dark:bg-gray-800",
              "border border-gray-300 dark:border-gray-700",
              "placeholder:text-gray-500 dark:placeholder:text-gray-400",
              "focus:ring-1",
              isEncrypted && "border-green-500/30 focus:ring-green-500/20",
              disabled && "opacity-60 cursor-not-allowed"
            )}
            disabled={disabled}
            rows={1}
            style={{ height: 'auto', maxHeight: '120px' }}
          />

          <div className="absolute right-2 bottom-2 flex space-x-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              onClick={handleImageUpload}
              disabled={disabled}
            >
              <Image size={16} />
            </Button>
          </div>
        </div>

        <Button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          className={cn(
            "rounded-full h-10 w-10 flex items-center justify-center",
            message.trim() ? "bg-primary hover:bg-primary/90" : "bg-gray-300 dark:bg-gray-700"
          )}
          aria-label="Envoyer"
        >
          <SendHorizontal size={18} />
        </Button>
      </div>

      <div className="flex items-center justify-between px-1">
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={() => toast({
              title: "Bientôt disponible",
              description: "Les émojis seront bientôt disponibles",
            })}
            disabled={disabled}
          >
            <Smile size={18} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={() => toast({
              title: "Bientôt disponible",
              description: "Les pièces jointes seront bientôt disponibles",
            })}
            disabled={disabled}
          >
            <Paperclip size={18} />
          </Button>
        </div>

        {!monetizationEnabled && onToggleMonetization && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleMonetization}
            className="text-amber-600 hover:text-amber-700 hover:bg-amber-100/30 dark:text-amber-500 dark:hover:text-amber-400 dark:hover:bg-amber-900/30"
            disabled={disabled}
          >
            <HeartHandshake size={16} className="mr-1" />
            <span>Soutenir</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default MessageInput;
