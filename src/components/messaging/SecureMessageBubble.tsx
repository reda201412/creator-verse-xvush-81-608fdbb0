import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import EphemeralIndicator from './EphemeralIndicator';

interface SecureMessageBubbleProps {
  content: string | React.ReactNode;
  senderName: string;
  senderAvatar?: string;
  isEncrypted?: boolean;
  isEphemeral?: boolean;
  isMonetized?: boolean;
  isOwnMessage?: boolean;
  isDelivered?: boolean;
  isRead?: boolean;
  timestamp?: string;
  duration?: number;
  onEphemeralEnd?: () => void;
}

const SecureMessageBubble: React.FC<SecureMessageBubbleProps> = ({
  content,
  senderName,
  senderAvatar,
  isEncrypted = false,
  isEphemeral = false,
  isMonetized = false,
  isOwnMessage = false,
  isDelivered = false,
  isRead = false,
  timestamp,
  duration = 5,
  onEphemeralEnd,
}) => {
  return (
    <motion.div
      className={cn(
        "relative flex flex-col rounded-xl px-3 py-2 my-1 transition-colors duration-200",
        isOwnMessage ? "bg-blue-100 dark:bg-blue-800 ml-auto" : "bg-gray-100 dark:bg-gray-800 mr-auto",
        isEncrypted && "border border-dashed border-yellow-500",
        isMonetized && "bg-gradient-to-br from-yellow-200 to-yellow-500 dark:from-yellow-700 dark:to-yellow-400 text-black"
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
    >
      <div className="flex items-center space-x-2">
        {senderAvatar && (
          <img src={senderAvatar} alt={senderName} className="w-6 h-6 rounded-full" />
        )}
        <div className="text-sm font-medium">{senderName}</div>
        {isEncrypted && (
          <Shield size={14} className="text-yellow-500" />
        )}
        {isEphemeral && (
          <EphemeralIndicator duration={duration} onComplete={onEphemeralEnd || (() => {})} />
        )}
        {isMonetized && (
          <Badge variant="secondary">Premium</Badge>
        )}
      </div>
      <div className="mt-1">{content}</div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">{timestamp}</div>
    </motion.div>
  );
};

export default SecureMessageBubble;
